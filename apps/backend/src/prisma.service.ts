import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('⚡ [AutoOS Database] Connected to PostgreSQL 16 successfully.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
