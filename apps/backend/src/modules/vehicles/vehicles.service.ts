import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FuelType } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicle.findMany({
      include: {
        customer: true,
        jobCards: { orderBy: { createdAt: 'desc' }, take: 5 },
        batteryPassports: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        customer: true,
        jobCards: {
          include: {
            assignedBay: true,
            jobCardItems: true,
            invoice: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        batteryPassports: true,
        gatePasses: true,
      },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async findByPlate(licensePlate: string) {
    return this.prisma.vehicle.findUnique({
      where: { licensePlate },
      include: { customer: true, jobCards: { orderBy: { createdAt: 'desc' } } },
    });
  }

  async create(data: {
    customerId: string;
    licensePlate: string;
    vinNumber?: string;
    make: string;
    model: string;
    modelYear?: number;
    fuelType: FuelType;
    engineCapacityCc?: number;
    recommendedOilGrade?: string;
    oilCapacityLiters?: number;
    currentOdometer: number;
  }) {
    return this.prisma.vehicle.create({
      data: {
        customerId: data.customerId,
        licensePlate: data.licensePlate,
        vinNumber: data.vinNumber,
        make: data.make,
        model: data.model,
        modelYear: data.modelYear,
        fuelType: data.fuelType,
        engineCapacityCc: data.engineCapacityCc,
        recommendedOilGrade: data.recommendedOilGrade,
        oilCapacityLiters: data.oilCapacityLiters,
        currentOdometer: data.currentOdometer,
      },
      include: { customer: true },
    });
  }
}
