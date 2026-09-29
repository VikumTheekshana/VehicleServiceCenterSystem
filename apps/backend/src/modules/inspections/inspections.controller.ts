import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';

@ApiTags('Edge AI Damage & Tread Inspections')
@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all recent AI damage inspections' })
  findAll() {
    return this.inspectionsService.findAll();
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Get AI damage coordinates and 4-wheel tire tread depth' })
  findByJobId(@Param('jobId') jobId: string) {
    return this.inspectionsService.findByJobId(jobId);
  }

  @Post()
  @ApiOperation({ summary: 'Ingest Edge AI Gate-Scanner vision results' })
  createOrUpdate(
    @Body()
    body: {
      jobCardId: string;
      anprPlateDetected: string;
      anprConfidence: number;
      detectedDamages: any[];
      treadDepthMm: Record<string, number>;
      snapshotUrls?: string[];
    },
  ) {
    return this.inspectionsService.createOrUpdate(body);
  }
}
