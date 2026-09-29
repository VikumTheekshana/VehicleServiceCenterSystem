import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { FuelType } from '@prisma/client';

@ApiTags('Vehicle Master Registry')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List all vehicles with owner metadata and service histories' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('by-plate/:plate')
  @ApiOperation({ summary: 'ANPR Gate-In lookup endpoint by License Plate' })
  findByPlate(@Param('plate') plate: string) {
    return this.vehiclesService.findByPlate(plate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single vehicle profile, battery passports, and history vault' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new vehicle with technical fluid and engine specs' })
  create(
    @Body()
    body: {
      customerId: string;
      licensePlate: string;
      vinNumber?: string;
      make: string;
      model: string;
      modelYear?: number;
      fuelType: FuelType;
      engineCapacityCc?: number;
      recommendedOilGrade?: string;
      oilCapacityLiters?: number;
      currentOdometer: number;
    },
  ) {
    return this.vehiclesService.create(body);
  }
}
