import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma.service';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'AutoOS Core Health & Telemetry Liveness' })
  async check() {
    let dbStatus = 'CONNECTED';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e: any) {
      dbStatus = `ERROR: ${e.message}`;
    }

    return {
      system: 'AutoOS Enterprise Workshop Core',
      version: '1.0.0',
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      database: {
        engine: 'PostgreSQL 16',
        status: dbStatus,
      },
      memory: process.memoryUsage(),
      uptimeSeconds: process.uptime(),
    };
  }
}
