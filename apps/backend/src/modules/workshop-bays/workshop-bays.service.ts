import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TelemetryGateway } from '../telemetry/telemetry.gateway';

@Injectable()
export class WorkshopBaysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetry: TelemetryGateway,
  ) {}

  async findAll() {
    return this.prisma.workshopBay.findMany({
      include: {
        jobCards: {
          where: {
            status: { in: ['QUEUED', 'IN_PROGRESS', 'WAITING_PARTS', 'QC_CHECK'] },
          },
          include: {
            vehicle: true,
            customer: true,
          },
        },
      },
      orderBy: { bayName: 'asc' },
    });
  }

  async findOne(id: string) {
    const bay = await this.prisma.workshopBay.findUnique({
      where: { id },
      include: { jobCards: { include: { vehicle: true, customer: true } } },
    });
    if (!bay) throw new NotFoundException('Workshop bay not found');
    return bay;
  }

  // Dynamic Constraint Rebalancing Algorithm
  async rebalanceSchedule(bayId: string, delayMinutes: number, reason: string) {
    const delayedBay = await this.findOne(bayId);

    // Find all active bays
    const allBays = await this.prisma.workshopBay.findMany({
      include: {
        jobCards: {
          where: { status: 'QUEUED' },
          include: { vehicle: true },
        },
      },
    });

    const candidateBays = allBays.filter(
      (b) => b.id !== bayId && (!b.isOccupied || b.bayType === delayedBay.bayType),
    );

    let rebalancedJob: any = null;
    let targetBay: any = null;

    // If delayed bay has queued jobs, shift the next queued job to a matching candidate bay
    const queuedJob = delayedBay.jobCards.find((j) => j.status === 'QUEUED');
    if (queuedJob && candidateBays.length > 0) {
      targetBay = candidateBays[0];
      rebalancedJob = await this.prisma.jobCard.update({
        where: { id: queuedJob.id },
        data: {
          assignedBayId: targetBay.id,
          technicianVoiceNotes: `[AUTO-REBALANCE]: Shifted from ${delayedBay.bayName} to ${targetBay.bayName} due to delay: ${reason} (${delayMinutes}m).`,
        },
        include: { vehicle: true, customer: true, assignedBay: true },
      });
    }

    const payload = {
      action: 'SCHEDULE_REBALANCED',
      sourceBay: delayedBay.bayName,
      delayMinutes,
      reason,
      rebalancedJob: rebalancedJob ? rebalancedJob.jobNumber : null,
      targetBay: targetBay ? targetBay.bayName : 'No compatible bay free',
      timestamp: new Date().toISOString(),
    };

    this.telemetry.broadcastBayUpdate(payload);
    return payload;
  }
}
