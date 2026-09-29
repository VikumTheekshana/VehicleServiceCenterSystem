import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EVBatteryService } from './ev-battery.service';

@ApiTags('EV & Hybrid Battery Passports')
@Controller('ev-battery')
export class EVBatteryController {
  constructor(private readonly batteryService: EVBatteryService) {}

  @Get()
  @ApiOperation({ summary: 'List all EV & Hybrid battery passports' })
  findAll() {
    return this.batteryService.findAll();
  }

  @Get('passport/:jobCardId')
  @ApiOperation({ summary: 'Get high-voltage battery diagnostic telemetry and health metrics' })
  findByJobId(@Param('jobCardId') jobCardId: string) {
    return this.batteryService.findByJobId(jobCardId);
  }

  @Post('passport')
  @ApiOperation({ summary: 'Ingest OBD-II battery parameters and issue cryptographic certificate' })
  createOrUpdate(
    @Body()
    body: {
      jobCardId: string;
      vehicleId: string;
      stateOfHealthPct: number;
      stateOfChargePct: number;
      cellVoltageDeltaMv: number;
      packInternalResistanceMohm?: number;
      inverterTempCelsius?: number;
      diagnosticSummary?: string;
    },
  ) {
    return this.batteryService.createOrUpdate(body);
  }

  @Get('verify/:hash')
  @ApiOperation({ summary: 'Public cryptographic verification of Battery Health Certificate' })
  verifyCertificate(@Param('hash') hash: string) {
    return this.batteryService.verifyCertificate(hash);
  }
}
