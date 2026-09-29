import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TelemetryGateway } from '../telemetry/telemetry.gateway';
import { JobStatus, ItemType } from '@prisma/client';

@Injectable()
export class JobCardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetry: TelemetryGateway,
  ) {}

  // Finite State Machine Allowed Transitions
  private readonly stateTransitions: Record<JobStatus, JobStatus[]> = {
    DRAFT: [JobStatus.ESTIMATED],
    ESTIMATED: [JobStatus.APPROVED],
    APPROVED: [JobStatus.QUEUED],
    QUEUED: [JobStatus.IN_PROGRESS],
    IN_PROGRESS: [JobStatus.WAITING_PARTS, JobStatus.QC_CHECK],
    WAITING_PARTS: [JobStatus.IN_PROGRESS],
    QC_CHECK: [JobStatus.IN_PROGRESS, JobStatus.COMPLETED],
    COMPLETED: [JobStatus.INVOICED],
    INVOICED: [],
  };

  async findAll(status?: JobStatus, bayId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (bayId) where.assignedBayId = bayId;

    return this.prisma.jobCard.findMany({
      where,
      include: {
        vehicle: true,
        customer: true,
        assignedBay: true,
        jobCardItems: { include: { inventoryItem: true } },
        aiInspection: true,
        batteryPassport: true,
        invoice: { include: { gatePass: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.jobCard.findUnique({
      where: { id },
      include: {
        vehicle: true,
        customer: true,
        assignedBay: true,
        jobCardItems: { include: { inventoryItem: true } },
        aiInspection: true,
        iotDispenseLogs: { include: { inventoryItem: true } },
        batteryPassport: true,
        invoice: { include: { gatePass: true } },
      },
    });
    if (!job) throw new NotFoundException('Job card not found');
    return job;
  }

  async create(data: {
    vehicleId: string;
    customerId: string;
    intakeOdometer: number;
    assignedBayId?: string;
    customerNotes?: string;
  }) {
    const count = await this.prisma.jobCard.count();
    const jobNumber = `JOB-2026-${String(count + 1).padStart(4, '0')}`;

    const job = await this.prisma.jobCard.create({
      data: {
        jobNumber,
        vehicleId: data.vehicleId,
        customerId: data.customerId,
        assignedBayId: data.assignedBayId,
        intakeOdometer: data.intakeOdometer,
        customerNotes: data.customerNotes || 'Standard intake inspection scheduled.',
        status: JobStatus.DRAFT,
      },
      include: { vehicle: true, customer: true, assignedBay: true },
    });

    this.telemetry.broadcastJobStatusChange({
      jobId: job.id,
      jobNumber: job.jobNumber,
      status: job.status,
      timestamp: new Date().toISOString(),
    });

    return job;
  }

  // FSM Transition Validator
  async transitionStatus(id: string, nextStatus: JobStatus, voiceNotes?: string) {
    const job = await this.findOne(id);
    const allowed = this.stateTransitions[job.status] || [];

    if (!allowed.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid State Transition: Cannot transition from ${job.status} to ${nextStatus}. Allowed: [${allowed.join(', ')}]`,
      );
    }

    const updateData: any = { status: nextStatus };
    if (voiceNotes) updateData.technicianVoiceNotes = voiceNotes;
    if (nextStatus === JobStatus.APPROVED) updateData.customerApprovedAt = new Date();
    if (nextStatus === JobStatus.COMPLETED) updateData.completedAt = new Date();

    const updated = await this.prisma.jobCard.update({
      where: { id },
      data: updateData,
      include: { vehicle: true, customer: true, assignedBay: true },
    });

    this.telemetry.broadcastJobStatusChange({
      jobId: updated.id,
      jobNumber: updated.jobNumber,
      previousStatus: job.status,
      newStatus: updated.status,
      bayId: updated.assignedBayId,
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async addItem(jobCardId: string, item: {
    itemType: ItemType;
    inventoryItemId?: string;
    serviceCode?: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }) {
    const totalAmount = item.quantity * item.unitPrice;

    return this.prisma.jobCardItem.create({
      data: {
        jobCardId,
        itemType: item.itemType,
        inventoryItemId: item.inventoryItemId,
        serviceCode: item.serviceCode,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount,
        isApprovedByCustomer: true,
      },
      include: { inventoryItem: true },
    });
  }

  // Ambient Voice-to-Job Hands-Free Assistant
  async processVoiceIntake(jobCardId: string, rawTranscript: string) {
    const job = await this.findOne(jobCardId);
    const transcriptLower = rawTranscript.toLowerCase();
    const createdItems: any[] = [];

    // Rule-based entity & intent extraction
    if (transcriptLower.includes('brake pad') || transcriptLower.includes('brake')) {
      const brakePart = await this.prisma.inventoryItem.findFirst({
        where: { category: 'BRAKES' },
      });
      if (brakePart) {
        const item = await this.addItem(jobCardId, {
          itemType: ItemType.PART,
          inventoryItemId: brakePart.id,
          description: `${brakePart.name} (Hands-Free Voice Requisition)`,
          quantity: 1,
          unitPrice: brakePart.unitPrice,
        });
        createdItems.push(item);
      }
      const labor = await this.addItem(jobCardId, {
        itemType: ItemType.LABOR,
        serviceCode: 'BRK-REPL-01',
        description: 'Brake Pad Replacement & Hydraulic Line Bleeding Labor',
        quantity: 1.0,
        unitPrice: 4500.00,
      });
      createdItems.push(labor);
    }

    if (transcriptLower.includes('spark plug') || transcriptLower.includes('plug')) {
      const plugPart = await this.prisma.inventoryItem.findFirst({
        where: { category: 'IGNITION' },
      });
      if (plugPart) {
        const item = await this.addItem(jobCardId, {
          itemType: ItemType.PART,
          inventoryItemId: plugPart.id,
          description: `${plugPart.name} x4 (Voice Requisition)`,
          quantity: 4,
          unitPrice: plugPart.unitPrice,
        });
        createdItems.push(item);
      }
    }

    if (transcriptLower.includes('oil') || transcriptLower.includes('lube')) {
      const oilPart = await this.prisma.inventoryItem.findFirst({
        where: { isBulkFluid: true },
      });
      if (oilPart) {
        const volume = job.vehicle.oilCapacityLiters || 4.0;
        const item = await this.addItem(jobCardId, {
          itemType: ItemType.PART,
          inventoryItemId: oilPart.id,
          description: `${oilPart.name} (${volume}L Automated Allocation)`,
          quantity: volume,
          unitPrice: oilPart.unitPrice,
        });
        createdItems.push(item);
      }
    }

    // Append to voice notes
    await this.prisma.jobCard.update({
      where: { id: jobCardId },
      data: {
        technicianVoiceNotes: job.technicianVoiceNotes
          ? `${job.technicianVoiceNotes} | [VOICE ASSISTANT]: "${rawTranscript}"`
          : `[VOICE ASSISTANT]: "${rawTranscript}"`,
      },
    });

    return {
      status: 'PARSED_SUCCESSFULLY',
      rawTranscript,
      itemsCreated: createdItems.length,
      createdItems,
    };
  }
}
