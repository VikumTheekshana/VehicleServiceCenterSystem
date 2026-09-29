import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JobCardsService } from './job-cards.service';
import { JobStatus, ItemType } from '@prisma/client';

@ApiTags('WorkOrders & Job Cards')
@Controller('job-cards')
export class JobCardsController {
  constructor(private readonly jobCardsService: JobCardsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all work order job cards with active filters' })
  @ApiQuery({ name: 'status', required: false, enum: JobStatus })
  @ApiQuery({ name: 'bayId', required: false })
  findAll(@Query('status') status?: JobStatus, @Query('bayId') bayId?: string) {
    return this.jobCardsService.findAll(status, bayId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complete 360-degree details of a job card' })
  findOne(@Param('id') id: string) {
    return this.jobCardsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Intake a vehicle and create a new Job Card' })
  create(
    @Body()
    body: {
      vehicleId: string;
      customerId: string;
      intakeOdometer: number;
      assignedBayId?: string;
      customerNotes?: string;
    },
  ) {
    return this.jobCardsService.create(body);
  }

  @Patch(':id/transition')
  @ApiOperation({ summary: 'Transition Job Card state through the Finite State Machine' })
  transition(
    @Param('id') id: string,
    @Body() body: { status: JobStatus; voiceNotes?: string },
  ) {
    return this.jobCardsService.transitionStatus(id, body.status, body.voiceNotes);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Append a labor charge or parts requisition item' })
  addItem(
    @Param('id') id: string,
    @Body()
    body: {
      itemType: ItemType;
      inventoryItemId?: string;
      serviceCode?: string;
      description: string;
      quantity: number;
      unitPrice: number;
    },
  ) {
    return this.jobCardsService.addItem(id, body);
  }

  @Post(':id/voice-intake')
  @ApiOperation({ summary: 'Ambient Voice-to-Job mechanics audio transcript ingestion' })
  voiceIntake(
    @Param('id') id: string,
    @Body() body: { transcript: string },
  ) {
    return this.jobCardsService.processVoiceIntake(id, body.transcript);
  }
}
