import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TelemetryGateway } from '../telemetry/telemetry.gateway';
import { DispenseStatus, ItemType } from '@prisma/client';

@Injectable()
export class IoTDispensingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetry: TelemetryGateway,
  ) {}

  async findAllLogs() {
    return this.prisma.ioTFluidDispenseLog.findMany({
      include: {
        jobCard: { include: { vehicle: true, customer: true } },
        inventoryItem: true,
      },
      orderBy: { dispensedAt: 'desc' },
    });
  }

  // Interlock Step 1: Authorize exact volume against active Job Card
  async authorizeDispense(data: {
    jobCardId: string;
    inventoryItemId: string;
    requestedLiters: number;
    dispenserDeviceId: string;
  }) {
    const job = await this.prisma.jobCard.findUnique({
      where: { id: data.jobCardId },
      include: { vehicle: true },
    });
    if (!job) throw new NotFoundException('Active Job Card not found');

    if (!['APPROVED', 'QUEUED', 'IN_PROGRESS'].includes(job.status)) {
      throw new BadRequestException(`Cannot dispense fluid for job in ${job.status} state. Job must be Active.`);
    }

    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: data.inventoryItemId },
    });
    if (!item) throw new NotFoundException('Fluid inventory item not found');

    if (item.currentStock < data.requestedLiters) {
      throw new BadRequestException(`Insufficient bulk fluid stock. Available: ${item.currentStock}L, Requested: ${data.requestedLiters}L`);
    }

    // Default K-factor for engine oil flow meter (e.g. 450 pulses per liter)
    const kFactor = 450.0;
    const targetPulses = Math.round(data.requestedLiters * kFactor);

    const log = await this.prisma.ioTFluidDispenseLog.create({
      data: {
        jobCardId: data.jobCardId,
        inventoryItemId: data.inventoryItemId,
        dispenserDeviceId: data.dispenserDeviceId || 'ESP32-DISPENSER-01',
        authorizedLiters: data.requestedLiters,
        dispensedLiters: 0.0,
        pulseCount: 0,
        kFactor,
        status: DispenseStatus.AUTHORIZED,
      },
      include: { inventoryItem: true, jobCard: { include: { vehicle: true } } },
    });

    // Notify floor via WebSockets
    this.telemetry.broadcastFluidPulse({
      event: 'DISPENSE_AUTHORIZED',
      logId: log.id,
      jobNumber: job.jobNumber,
      vehicle: `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.licensePlate})`,
      fluidName: item.name,
      authorizedLiters: data.requestedLiters,
      targetPulses,
      deviceId: log.dispenserDeviceId,
      timestamp: new Date().toISOString(),
    });

    return {
      status: 'AUTHORIZED',
      logId: log.id,
      deviceId: log.dispenserDeviceId,
      authorizedLiters: data.requestedLiters,
      targetPulses,
      valveState: 'UNLOCKED_READY',
      mqttTopic: `autoos/dispensers/${log.dispenserDeviceId}/command`,
      mqttPayload: { action: 'OPEN_VALVE', targetPulses },
    };
  }

  // Interlock Step 2: Solenoid auto-cutoff callback from ESP32 pulse counter
  async completeDispense(data: {
    logId: string;
    pulseCount: number;
  }) {
    const log = await this.prisma.ioTFluidDispenseLog.findUnique({
      where: { id: data.logId },
      include: { inventoryItem: true, jobCard: true },
    });
    if (!log) throw new NotFoundException('Dispense session not found');

    const actualLiters = parseFloat((data.pulseCount / log.kFactor).toFixed(2));

    // Update log
    const updatedLog = await this.prisma.ioTFluidDispenseLog.update({
      where: { id: data.logId },
      data: {
        dispensedLiters: actualLiters,
        pulseCount: data.pulseCount,
        status: DispenseStatus.COMPLETED,
      },
      include: { inventoryItem: true, jobCard: true },
    });

    // Deduct stock from inventory
    await this.prisma.inventoryItem.update({
      where: { id: log.inventoryItemId },
      data: { currentStock: Math.max(0, log.inventoryItem.currentStock - actualLiters) },
    });

    // Auto-append line item to Job Card
    await this.prisma.jobCardItem.create({
      data: {
        jobCardId: log.jobCardId,
        itemType: ItemType.PART,
        inventoryItemId: log.inventoryItemId,
        description: `${log.inventoryItem.name} (${actualLiters}L IoT Dispensed)`,
        quantity: actualLiters,
        unitPrice: log.inventoryItem.unitPrice,
        totalAmount: actualLiters * log.inventoryItem.unitPrice,
        isApprovedByCustomer: true,
      },
    });

    this.telemetry.broadcastFluidPulse({
      event: 'DISPENSE_COMPLETED',
      logId: updatedLog.id,
      dispensedLiters: actualLiters,
      valveState: 'LOCKED',
      timestamp: new Date().toISOString(),
    });

    return {
      status: 'COMPLETED',
      valveState: 'LOCKED',
      dispensedLiters: actualLiters,
      inventoryDeducted: actualLiters,
      jobCardUpdated: log.jobCard.jobNumber,
    };
  }
}
