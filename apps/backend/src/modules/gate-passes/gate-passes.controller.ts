import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GatePassesService } from './gate-passes.service';

@ApiTags('Security Clearance & QR Gate Passes')
@Controller('gate-passes')
export class GatePassesController {
  constructor(private readonly gatePassesService: GatePassesService) {}

  @Get()
  @ApiOperation({ summary: 'List all issued Gate Passes and security clearance states' })
  findAll() {
    return this.gatePassesService.findAll();
  }

  @Get('verify/:qrToken')
  @ApiOperation({ summary: 'Guard scanner verification endpoint to trigger boom barrier relay' })
  verify(@Param('qrToken') qrToken: string) {
    return this.gatePassesService.verifyQrToken(qrToken);
  }
}
