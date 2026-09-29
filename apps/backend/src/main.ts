import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger OpenAPI 3.0 Documentation
  const config = new DocumentBuilder()
    .setTitle('AutoOS - Enterprise Vehicle Service Center Management Core')
    .setDescription(
      'Deep-Tech Smart Workshop Operating System APIs: Edge AI Gate-Scanner, Hands-Free Voice-to-Job, Dynamic Constraint Bay Scheduler, IoT Zero-Theft Fluid Dispensing, EV Battery Passport, and Cryptographic QR Gate Pass.',
    )
    .setVersion('1.0.0')
    .addTag('Workshop Bays & Scheduling')
    .addTag('WorkOrders & Job Cards')
    .addTag('Edge AI Damage & Tread Inspections')
    .addTag('Parts & Inventory WMS')
    .addTag('IoT Zero-Theft Fluid Dispensing')
    .addTag('EV & Hybrid Battery Passports')
    .addTag('Billing & Invoicing')
    .addTag('Security Clearance & QR Gate Passes')
    .addTag('Customer & Fleet Accounts')
    .addTag('Vehicle Master Registry')
    .addTag('System Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5050;
  await app.listen(port);

  console.log('================================================================');
  console.log(`🚗 [AutoOS Core Engine] Running on: http://localhost:${port}/api`);
  console.log(`📑 [AutoOS Swagger Docs] Live at:   http://localhost:${port}/api/docs`);
  console.log(`📡 [AutoOS WebSocket Radar] Port:   ${port}`);
  console.log('================================================================');
}

bootstrap();
