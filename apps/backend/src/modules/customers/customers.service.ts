import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.customer.findMany({
      include: { vehicles: true, jobCards: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { vehicles: true, jobCards: { include: { vehicle: true } } },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    isCorporateAccount?: boolean;
    creditLimit?: number;
  }) {
    return this.prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        isCorporateAccount: data.isCorporateAccount || false,
        creditLimit: data.creditLimit || 0.0,
      },
    });
  }
}
