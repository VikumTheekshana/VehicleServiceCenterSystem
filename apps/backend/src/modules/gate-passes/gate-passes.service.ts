import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TelemetryGateway } from '../telemetry/telemetry.gateway';

@Injectable()
export class GatePassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetry: TelemetryGateway,
  ) {}

  async findAll() {
    return this.prisma.gatePass.findMany({
      include: {
        invoice: { include: { jobCard: { include: { customer: true } } } },
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyQrToken(tokenHash: string) {
    const pass = await this.prisma.gatePass.findUnique({
      where: { qrTokenHash: tokenHash },
      include: {
        invoice: { include: { jobCard: { include: { customer: true } } } },
        vehicle: true,
      },
    });

    if (!pass) {
      throw new NotFoundException('Security Breach: QR Gate Pass token not recognized.');
    }

    if (pass.isCleared) {
      throw new BadRequestException('Security Notice: This Gate Pass has already been used and cleared for exit.');
    }

    if (new Date() > pass.expiresAt) {
      throw new BadRequestException('Security Notice: This Gate Pass has expired.');
    }

    if (pass.invoice.paymentStatus !== 'PAID') {
      throw new BadRequestException('Security Notice: Associated Invoice has not been settled.');
    }

    // Mark cleared
    const cleared = await this.prisma.gatePass.update({
      where: { id: pass.id },
      data: {
        isCleared: true,
        scannedAt: new Date(),
      },
    });

    const payload = {
      status: 'CLEARED_TO_EXIT',
      boomBarrierCommand: 'OPEN_RELAY_3_SECONDS',
      gatePassNumber: pass.gatePassNumber,
      vehicle: `${pass.vehicle.make} ${pass.vehicle.model} (${pass.vehicle.licensePlate})`,
      customer: `${pass.invoice.jobCard.customer.firstName} ${pass.invoice.jobCard.customer.lastName}`,
      invoiceNumber: pass.invoice.invoiceNumber,
      scannedAt: cleared.scannedAt,
    };

    return payload;
  }
}
