import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IoTDispensingService } from './iot-dispensing.service';

@ApiTags('IoT Zero-Theft Fluid Dispensing')
@Controller('iot/dispense')
export class IoTDispensingController {
  constructor(private readonly dispensingService: IoTDispensingService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Query tamper-evident fluid dispensing audit logs' })
  findAllLogs() {
    return this.dispensingService.findAllLogs();
  }

  @Post('authorize')
  @ApiOperation({ summary: 'Unlock oil gun solenoid valve for exact vehicle liters' })
  authorize(
    @Body()
    body: {
      jobCardId: string;
      inventoryItemId: string;
      requestedLiters: number;
      dispenserDeviceId?: string;
    },
  ) {
    return this.dispensingService.authorizeDispense({
      jobCardId: body.jobCardId,
      inventoryItemId: body.inventoryItemId,
      requestedLiters: body.requestedLiters,
      dispenserDeviceId: body.dispenserDeviceId || 'ESP32-DISPENSER-01',
    });
  }

  @Post('complete')
  @ApiOperation({ summary: 'Callback from ESP32 pulse counter locking valve and deducting stock' })
  complete(
    @Body()
    body: {
      logId: string;
      pulseCount: number;
    },
  ) {
    return this.dispensingService.completeDispense(body);
  }
}
