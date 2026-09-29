import { Controller, Get, Post, Param, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { BillingService } from './billing.service';

@ApiTags('Billing & Invoicing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  @ApiOperation({ summary: 'List all invoices across the workshop' })
  findAllInvoices() {
    return this.billingService.findAllInvoices();
  }

  @Get('invoice/:jobCardId')
  @ApiOperation({ summary: 'Calculate or retrieve split invoice statement (Labor vs Parts vs Tax)' })
  getInvoice(@Param('jobCardId') jobCardId: string) {
    return this.billingService.getOrCreateInvoice(jobCardId);
  }

  @Post('invoice/:jobCardId/pay')
  @ApiOperation({ summary: 'Process payment and issue cryptographic QR Gate Pass' })
  processPayment(
    @Param('jobCardId') jobCardId: string,
    @Body() body: { paymentMethod: string },
  ) {
    return this.billingService.processPayment(jobCardId, body.paymentMethod || 'CARD');
  }

  @Get('invoice/:jobCardId/pdf')
  @ApiOperation({ summary: 'Download official branded AutoOS PDF invoice statement' })
  async downloadPdf(@Param('jobCardId') jobCardId: string, @Res() res: Response) {
    const pdfBuffer = await this.billingService.generateInvoicePdf(jobCardId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="AutoOS-Invoice-${jobCardId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
