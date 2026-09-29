import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class EVBatteryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.eVBatteryPassport.findMany({
      include: {
        vehicle: { include: { customer: true } },
        jobCard: true,
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findByJobId(jobCardId: string) {
    const passport = await this.prisma.eVBatteryPassport.findUnique({
      where: { jobCardId },
      include: {
        vehicle: { include: { customer: true } },
        jobCard: true,
      },
    });
    if (!passport) throw new NotFoundException('EV Battery Passport not found for this Job Card');
    return passport;
  }

  async createOrUpdate(data: {
    jobCardId: string;
    vehicleId: string;
    stateOfHealthPct: number;
    stateOfChargePct: number;
    cellVoltageDeltaMv: number;
    packInternalResistanceMohm?: number;
    inverterTempCelsius?: number;
    diagnosticSummary?: string;
  }) {
    const rawCertificateData = `${data.vehicleId}:${data.jobCardId}:${data.stateOfHealthPct}:${data.cellVoltageDeltaMv}:${Date.now()}`;
    const certificateHash = 'CERT-BATT-' + crypto.createHash('sha256').update(rawCertificateData).digest('hex').substring(0, 16).toUpperCase();

    let summary = data.diagnosticSummary;
    if (!summary) {
      if (data.stateOfHealthPct >= 90) {
        summary = `High-Voltage pack in Grade-A condition (${data.stateOfHealthPct}% SoH). Cell voltage variance is optimal at ${data.cellVoltageDeltaMv}mV.`;
      } else if (data.stateOfHealthPct >= 80) {
        summary = `High-Voltage pack in Grade-B condition (${data.stateOfHealthPct}% SoH). Normal cell degradation observed.`;
      } else {
        summary = `WARNING: Severe cell degradation (${data.stateOfHealthPct}% SoH). High cell imbalance (${data.cellVoltageDeltaMv}mV). Module balancing or pack replacement recommended.`;
      }
    }

    return this.prisma.eVBatteryPassport.upsert({
      where: { jobCardId: data.jobCardId },
      create: {
        jobCardId: data.jobCardId,
        vehicleId: data.vehicleId,
        stateOfHealthPct: data.stateOfHealthPct,
        stateOfChargePct: data.stateOfChargePct,
        cellVoltageDeltaMv: data.cellVoltageDeltaMv,
        packInternalResistanceMohm: data.packInternalResistanceMohm || 15.0,
        inverterTempCelsius: data.inverterTempCelsius || 32.0,
        diagnosticSummary: summary,
        certificateHash,
      },
      update: {
        stateOfHealthPct: data.stateOfHealthPct,
        stateOfChargePct: data.stateOfChargePct,
        cellVoltageDeltaMv: data.cellVoltageDeltaMv,
        packInternalResistanceMohm: data.packInternalResistanceMohm || 15.0,
        inverterTempCelsius: data.inverterTempCelsius || 32.0,
        diagnosticSummary: summary,
      },
      include: { vehicle: true, jobCard: true },
    });
  }

  async verifyCertificate(hash: string) {
    const passport = await this.prisma.eVBatteryPassport.findUnique({
      where: { certificateHash: hash },
      include: {
        vehicle: { include: { customer: true } },
        jobCard: true,
      },
    });
    if (!passport) throw new NotFoundException('Invalid or unrecognized Battery Health Certificate');
    return {
      isValid: true,
      certificateHash: passport.certificateHash,
      issuedAt: passport.issuedAt,
      vehicle: `${passport.vehicle.make} ${passport.vehicle.model} (${passport.vehicle.licensePlate})`,
      vin: passport.vehicle.vinNumber,
      metrics: {
        stateOfHealth: `${passport.stateOfHealthPct}%`,
        stateOfCharge: `${passport.stateOfChargePct}%`,
        cellVoltageImbalance: `${passport.cellVoltageDeltaMv} mV`,
        inverterTemperature: `${passport.inverterTempCelsius} °C`,
      },
      diagnosticSummary: passport.diagnosticSummary,
    };
  }
}
