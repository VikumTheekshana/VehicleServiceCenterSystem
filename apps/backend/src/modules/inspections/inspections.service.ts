import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class InspectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.aIDamageInspection.findMany({
      include: { jobCard: { include: { vehicle: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByJobId(jobCardId: string) {
    const inspection = await this.prisma.aIDamageInspection.findUnique({
      where: { jobCardId },
      include: { jobCard: { include: { vehicle: true } } },
    });
    if (!inspection) throw new NotFoundException('AI Damage Inspection not found for this Job Card');
    return inspection;
  }

  async createOrUpdate(data: {
    jobCardId: string;
    anprPlateDetected: string;
    anprConfidence: number;
    detectedDamages: any[];
    treadDepthMm: Record<string, number>;
    snapshotUrls?: string[];
  }) {
    return this.prisma.aIDamageInspection.upsert({
      where: { jobCardId: data.jobCardId },
      create: {
        jobCardId: data.jobCardId,
        anprPlateDetected: data.anprPlateDetected,
        anprConfidence: data.anprConfidence,
        detectedDamages: data.detectedDamages,
        treadDepthMm: data.treadDepthMm,
        snapshotUrls: data.snapshotUrls || [],
      },
      update: {
        anprPlateDetected: data.anprPlateDetected,
        anprConfidence: data.anprConfidence,
        detectedDamages: data.detectedDamages,
        treadDepthMm: data.treadDepthMm,
        snapshotUrls: data.snapshotUrls || [],
      },
      include: { jobCard: true },
    });
  }
}
