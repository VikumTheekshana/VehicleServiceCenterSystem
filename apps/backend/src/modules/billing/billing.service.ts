import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TelemetryGateway } from '../telemetry/telemetry.gateway';
import { PaymentStatus, JobStatus } from '@prisma/client';
import * as crypto from 'crypto';
const PDFDocument = require('pdfkit');

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetry: TelemetryGateway,
  ) {}

  async findAllInvoices() {
    return this.prisma.invoice.findMany({
      include: {
        jobCard: {
          include: {
            vehicle: true,
            customer: true,
            jobCardItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrCreateInvoice(jobCardId: string) {
    const job = await this.prisma.jobCard.findUnique({
      where: { id: jobCardId },
      include: {
        jobCardItems: { include: { inventoryItem: true } },
        vehicle: true,
        customer: true,
        invoice: { include: { gatePass: true } },
      },
    });
    if (!job) throw new NotFoundException('Job Card not found');

    if (job.invoice) return job.invoice;

    // Calculate labor and parts
    let totalLabor = 0;
    let totalParts = 0;

    job.jobCardItems.forEach((item) => {
      if (item.itemType === 'LABOR') {
        totalLabor += item.totalAmount;
      } else {
        totalParts += item.totalAmount;
      }
    });

    const taxAmount = parseFloat(((totalLabor + totalParts) * 0.15).toFixed(2)); // 15% VAT
    const netTotal = parseFloat((totalLabor + totalParts + taxAmount).toFixed(2));

    const invoiceCount = await this.prisma.invoice.count();
    const invoiceNumber = `INV-2026-${String(invoiceCount + 1).padStart(4, '0')}`;

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        jobCardId,
        totalLaborAmount: totalLabor,
        totalPartsAmount: totalParts,
        taxAmount,
        discountAmount: 0.0,
        netTotal,
        paymentStatus: PaymentStatus.UNPAID,
      },
      include: { jobCard: { include: { vehicle: true, customer: true } } },
    });
  }

  async processPayment(jobCardId: string, paymentMethod: string) {
    const invoice = await this.getOrCreateInvoice(jobCardId);

    if (invoice.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Invoice is already fully PAID');
    }

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: paymentMethod || 'CREDIT_CARD',
        paidAt: new Date(),
      },
      include: { jobCard: { include: { vehicle: true, customer: true } } },
    });

    // Auto-generate Cryptographic QR Gate Pass
    const rawQrToken = `AUTOOS:GP:${updatedInvoice.id}:${updatedInvoice.jobCard.vehicleId}:${Date.now()}`;
    const qrTokenHash = 'HMAC-SHA256-' + crypto.createHmac('sha256', 'autoos-gate-pass-secret-2026').update(rawQrToken).digest('hex').toUpperCase();

    const gatePassCount = await this.prisma.gatePass.count();
    const gatePassNumber = `GP-2026-${String(gatePassCount + 1).padStart(4, '0')}`;

    const gatePass = await this.prisma.gatePass.create({
      data: {
        gatePassNumber,
        invoiceId: updatedInvoice.id,
        vehicleId: updatedInvoice.jobCard.vehicleId,
        qrTokenHash,
        expiresAt: new Date(Date.now() + 3600000 * 24), // 24 Hours valid
        isCleared: false,
      },
    });

    // Transition Job to INVOICED
    await this.prisma.jobCard.update({
      where: { id: jobCardId },
      data: { status: JobStatus.INVOICED },
    });

    this.telemetry.broadcastJobStatusChange({
      event: 'INVOICE_PAID_GATE_PASS_ISSUED',
      invoiceNumber: updatedInvoice.invoiceNumber,
      gatePassNumber: gatePass.gatePassNumber,
      qrToken: qrTokenHash,
      timestamp: new Date().toISOString(),
    });

    return {
      invoice: updatedInvoice,
      gatePass,
      message: 'Payment settled. Cryptographic Gate Pass generated successfully.',
    };
  }

  async generateInvoicePdf(jobCardId: string): Promise<Buffer> {
    const invoice = await this.getOrCreateInvoice(jobCardId);
    const job = await this.prisma.jobCard.findUnique({
      where: { id: jobCardId },
      include: {
        jobCardItems: true,
        vehicle: true,
        customer: true,
        assignedBay: true,
      },
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header Banner
      doc.rect(40, 40, 515, 65).fill('#090d16');
      doc.fillColor('#00f5ff').fontSize(20).font('Helvetica-Bold').text('AUTOOS ENTERPRISE WORKSHOP', 55, 55);
      doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('Intelligent Vehicle Service & Multi-Point Diagnostic Ledger', 55, 80);

      // Metadata
      doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold').text(`TAX INVOICE: ${invoice.invoiceNumber}`, 40, 125);
      doc.font('Helvetica').fontSize(9).fillColor('#475569');
      doc.text(`Issue Date: ${new Date().toLocaleDateString('en-GB')}`, 40, 142);
      doc.text(`Job Card #: ${job.jobNumber}`, 40, 156);
      doc.text(`Vehicle: ${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.licensePlate})`, 40, 170);
      doc.text(`Owner: ${job.customer.firstName} ${job.customer.lastName} | Phone: ${job.customer.phoneNumber}`, 40, 184);

      // Items Table
      let y = 215;
      doc.rect(40, y, 515, 20).fill('#0ea5e9');
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
      doc.text('DESCRIPTION / PART', 50, y + 6);
      doc.text('TYPE', 290, y + 6);
      doc.text('QTY', 360, y + 6);
      doc.text('UNIT (LKR)', 410, y + 6);
      doc.text('TOTAL (LKR)', 480, y + 6);

      y += 24;
      doc.font('Helvetica').fontSize(8.5).fillColor('#334155');

      job.jobCardItems.forEach((item) => {
        doc.text(item.description, 50, y, { width: 230 });
        doc.text(item.itemType, 290, y);
        doc.text(String(item.quantity), 360, y);
        doc.text(item.unitPrice.toLocaleString('en-LK'), 410, y);
        doc.text(item.totalAmount.toLocaleString('en-LK'), 480, y);
        y += 18;
      });

      // Settlement Box
      y += 15;
      doc.rect(300, y, 255, 95).fill('#f8fafc').stroke('#cbd5e1');
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9);
      doc.text(`Labor Subtotal: LKR ${invoice.totalLaborAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`, 315, y + 15);
      doc.text(`Parts Subtotal: LKR ${invoice.totalPartsAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`, 315, y + 32);
      doc.text(`VAT (15%): LKR ${invoice.taxAmount.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`, 315, y + 49);
      doc.fillColor('#0ea5e9').fontSize(11).text(`NET TOTAL: LKR ${invoice.netTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`, 315, y + 70);

      // Security Signature
      doc.fontSize(8).fillColor('#94a3b8').text('This computer-generated invoice is backed by AutoOS cryptographic security gate pass ledger.', 40, 760, { align: 'center' });

      doc.end();
    });
  }
}
