import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Auth Module
import { AuthModule } from './modules/auth/auth.module';

// Telemetry Gateway
import { TelemetryGateway } from './modules/telemetry/telemetry.gateway';

// Controllers & Services
import { WorkshopBaysController } from './modules/workshop-bays/workshop-bays.controller';
import { WorkshopBaysService } from './modules/workshop-bays/workshop-bays.service';

import { JobCardsController } from './modules/job-cards/job-cards.controller';
import { JobCardsService } from './modules/job-cards/job-cards.service';

import { InspectionsController } from './modules/inspections/inspections.controller';
import { InspectionsService } from './modules/inspections/inspections.service';

import { InventoryController } from './modules/inventory/inventory.controller';
import { InventoryService } from './modules/inventory/inventory.service';

import { IoTDispensingController } from './modules/iot-dispensing/iot-dispensing.controller';
import { IoTDispensingService } from './modules/iot-dispensing/iot-dispensing.service';

import { EVBatteryController } from './modules/ev-battery/ev-battery.controller';
import { EVBatteryService } from './modules/ev-battery/ev-battery.service';

import { BillingController } from './modules/billing/billing.controller';
import { BillingService } from './modules/billing/billing.service';

import { GatePassesController } from './modules/gate-passes/gate-passes.controller';
import { GatePassesService } from './modules/gate-passes/gate-passes.service';

import { CustomersController } from './modules/customers/customers.controller';
import { CustomersService } from './modules/customers/customers.service';

import { VehiclesController } from './modules/vehicles/vehicles.controller';
import { VehiclesService } from './modules/vehicles/vehicles.service';

import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    HealthController,
    WorkshopBaysController,
    JobCardsController,
    InspectionsController,
    InventoryController,
    IoTDispensingController,
    EVBatteryController,
    BillingController,
    GatePassesController,
    CustomersController,
    VehiclesController,
  ],
  providers: [
    PrismaService,
    TelemetryGateway,
    WorkshopBaysService,
    JobCardsService,
    InspectionsService,
    InventoryService,
    IoTDispensingService,
    EVBatteryService,
    BillingService,
    GatePassesService,
    CustomersService,
    VehiclesService,
  ],
})
export class AppModule {}
