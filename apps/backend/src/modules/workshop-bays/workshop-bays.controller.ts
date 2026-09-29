import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkshopBaysService } from './workshop-bays.service';

@ApiTags('Workshop Bays & Scheduling')
@Controller('bays')
export class WorkshopBaysController {
  constructor(private readonly baysService: WorkshopBaysService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all workshop bays with real-time active jobs and occupancy' })
  findAll() {
    return this.baysService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific workshop bay' })
  findOne(@Param('id') id: string) {
    return this.baysService.findOne(id);
  }

  @Patch(':id/rebalance')
  @ApiOperation({ summary: 'Trigger dynamic constraint rebalancing when a bay experiences unexpected delays' })
  rebalance(
    @Param('id') id: string,
    @Body() body: { delayMinutes: number; reason: string },
  ) {
    return this.baysService.rebalanceSchedule(id, body.delayMinutes || 60, body.reason || 'Seized hardware');
  }
}
