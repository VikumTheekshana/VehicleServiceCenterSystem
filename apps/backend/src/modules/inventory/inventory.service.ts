import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = {};
    if (category) where.category = category;
    return this.prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id },
      include: { iotDispenseLogs: true },
    });
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async create(data: {
    partNumber: string;
    name: string;
    category: string;
    isBulkFluid?: boolean;
    currentStock: number;
    unitOfMeasure?: string;
    reorderLevel?: number;
    unitCost: number;
    unitPrice: number;
    binLocation?: string;
  }) {
    return this.prisma.inventoryItem.create({
      data: {
        partNumber: data.partNumber,
        name: data.name,
        category: data.category,
        isBulkFluid: data.isBulkFluid || false,
        currentStock: data.currentStock,
        unitOfMeasure: data.unitOfMeasure || (data.isBulkFluid ? 'LITER' : 'UNIT'),
        reorderLevel: data.reorderLevel || 5.0,
        unitCost: data.unitCost,
        unitPrice: data.unitPrice,
        binLocation: data.binLocation,
      },
    });
  }

  async updateStock(id: string, deltaStock: number) {
    const item = await this.findOne(id);
    return this.prisma.inventoryItem.update({
      where: { id },
      data: { currentStock: Math.max(0, item.currentStock + deltaStock) },
    });
  }
}
