const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting AutoOS PostgreSQL database seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.gatePass.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.eVBatteryPassport.deleteMany();
  await prisma.ioTFluidDispenseLog.deleteMany();
  await prisma.jobCardItem.deleteMany();
  await prisma.aIDamageInspection.deleteMany();
  await prisma.jobCard.deleteMany();
  await prisma.workshopBay.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing database records.');

  // 0. Seed Users & Personas with Bcrypt Hashes
  const defaultSaltRounds = 10;
  const usersToSeed = [
    {
      name: 'Vikum Theekshana (System Administrator)',
      email: 'admin@autoos.workshop',
      password: 'Admin@12345',
      role: 'SUPER_ADMIN',
      phone: '+94770000001',
    },
    {
      name: 'Samantha Silva (Operations Director)',
      email: 'director@autoos.workshop',
      password: 'Director@123',
      role: 'DIRECTOR',
      phone: '+94770000002',
    },
    {
      name: 'Nimal Perera (Service Advisor)',
      email: 'advisor@autoos.workshop',
      password: 'Advisor@123',
      role: 'SERVICE_ADVISOR',
      phone: '+94770000003',
    },
    {
      name: 'Kasun Fernando (Master Technician)',
      email: 'technician@autoos.workshop',
      password: 'Tech@123',
      role: 'TECHNICIAN',
      phone: '+94770000004',
    },
    {
      name: 'Dr. Dinesh Jayawardena (HV/EV Diagnostics)',
      email: 'ev-specialist@autoos.workshop',
      password: 'EvExpert@123',
      role: 'EV_SPECIALIST',
      phone: '+94770000005',
    },
    {
      name: 'Sunil Wickramasinghe (Fluid & Inventory)',
      email: 'storekeeper@autoos.workshop',
      password: 'Store@123',
      role: 'STOREKEEPER',
      phone: '+94770000006',
    },
    {
      name: 'Ranjith Bandara (Security Gate Officer)',
      email: 'security@autoos.workshop',
      password: 'Gate@123',
      role: 'SECURITY_GUARD',
      phone: '+94770000007',
    },
  ];

  for (const u of usersToSeed) {
    const passwordHash = await bcrypt.hash(u.password, defaultSaltRounds);
    await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        phone: u.phone,
        isActive: true,
      },
    });
  }
  console.log('✅ Seeded 7 Workshop Staff & Executive User Accounts.');

  // 1. Workshop Bays
  const bay1 = await prisma.workshopBay.create({
    data: {
      bayName: 'Bay 01 - Hydraulic Two-Post Lift',
      bayType: 'TWO_POST',
      isOccupied: true,
      hourlyRate: 3500.00,
    },
  });

  const bay2 = await prisma.workshopBay.create({
    data: {
      bayName: 'Bay 02 - Computerized 3D Alignment Pit',
      bayType: 'ALIGNMENT',
      isOccupied: true,
      hourlyRate: 4500.00,
    },
  });

  const bay3 = await prisma.workshopBay.create({
    data: {
      bayName: 'Bay 03 - High-Voltage EV/Hybrid Isolated Bay',
      bayType: 'EV_ISOLATED',
      isOccupied: false,
      hourlyRate: 5500.00,
    },
  });

  const bay4 = await prisma.workshopBay.create({
    data: {
      bayName: 'Bay 04 - Express Lube & Wash Bay',
      bayType: 'QUICK_LUBE',
      isOccupied: false,
      hourlyRate: 2500.00,
    },
  });

  console.log('✅ Created 4 Workshop Bays.');

  // 2. Customers
  const customer1 = await prisma.customer.create({
    data: {
      firstName: 'Alexander',
      lastName: 'Vance',
      phoneNumber: '+94771234567',
      email: 'alex.vance@apexlogistics.com',
      isCorporateAccount: true,
      creditLimit: 300000.00,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      phoneNumber: '+94719876543',
      email: 'sarah.j@luxurytravel.lk',
      isCorporateAccount: false,
      creditLimit: 50000.00,
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      firstName: 'Roshan',
      lastName: 'Silva',
      phoneNumber: '+94765551234',
      email: 'roshan.silva@techcorp.lk',
      isCorporateAccount: true,
      creditLimit: 200000.00,
    },
  });

  console.log('✅ Created 3 Customer Profiles.');

  // 3. Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      customerId: customer1.id,
      licensePlate: 'WP-CAB-4921',
      vinNumber: 'JTDKN36U401928374',
      make: 'Toyota',
      model: 'Prius 1.8L Hybrid S-Grade',
      modelYear: 2021,
      fuelType: 'HYBRID',
      engineCapacityCc: 1798,
      recommendedOilGrade: '0W-20',
      oilCapacityLiters: 3.8,
      currentOdometer: 64250,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      customerId: customer2.id,
      licensePlate: 'WP-CBB-8812',
      vinNumber: 'WBA5A5C58ED123984',
      make: 'BMW',
      model: '520d M-Sport Executive',
      modelYear: 2022,
      fuelType: 'DIESEL',
      engineCapacityCc: 1995,
      recommendedOilGrade: '5W-30',
      oilCapacityLiters: 5.2,
      currentOdometer: 48120,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      customerId: customer3.id,
      licensePlate: 'WP-CBE-1004',
      vinNumber: 'KMHC85LE6NU987654',
      make: 'Hyundai',
      model: 'Ioniq 5 Electric AWD Long Range',
      modelYear: 2023,
      fuelType: 'EV',
      engineCapacityCc: 0,
      recommendedOilGrade: 'N/A',
      oilCapacityLiters: 0.0,
      currentOdometer: 21340,
    },
  });

  console.log('✅ Created 3 Vehicles (Hybrid, Diesel, EV).');

  // 4. Inventory Catalog & Fluids
  const oil0w20 = await prisma.inventoryItem.create({
    data: {
      partNumber: 'LUB-0W20-MOBIL',
      name: 'Mobil 1 Advanced Fuel Economy 0W-20 (Synthetic)',
      category: 'LUBRICANTS',
      isBulkFluid: true,
      currentStock: 184.2,
      unitOfMeasure: 'LITER',
      reorderLevel: 40.0,
      unitCost: 2800.00,
      unitPrice: 4200.00,
      binLocation: 'BULK-DRUM-01',
    },
  });

  const oil5w30 = await prisma.inventoryItem.create({
    data: {
      partNumber: 'LUB-5W30-CASTROL',
      name: 'Castrol Edge Professional 5W-30 (Full Synthetic)',
      category: 'LUBRICANTS',
      isBulkFluid: true,
      currentStock: 242.0,
      unitOfMeasure: 'LITER',
      reorderLevel: 50.0,
      unitCost: 2600.00,
      unitPrice: 3800.00,
      binLocation: 'BULK-DRUM-02',
    },
  });

  const toyotaFilter = await prisma.inventoryItem.create({
    data: {
      partNumber: 'FLT-OIL-TY01',
      name: 'OEM Toyota Genuine Oil Filter 04152-YZZA6',
      category: 'FILTERS',
      isBulkFluid: false,
      currentStock: 35.0,
      unitOfMeasure: 'UNIT',
      reorderLevel: 10.0,
      unitCost: 1900.00,
      unitPrice: 3200.00,
      binLocation: 'AISLE-03-B2',
    },
  });

  const bmwFilter = await prisma.inventoryItem.create({
    data: {
      partNumber: 'FLT-OIL-BMW02',
      name: 'OEM BMW Mann Oil Filter Kit HU816X',
      category: 'FILTERS',
      isBulkFluid: false,
      currentStock: 18.0,
      unitOfMeasure: 'UNIT',
      reorderLevel: 5.0,
      unitCost: 4500.00,
      unitPrice: 6800.00,
      binLocation: 'AISLE-04-A1',
    },
  });

  const brakePad = await prisma.inventoryItem.create({
    data: {
      partNumber: 'BRK-PAD-BOSCH-F',
      name: 'Bosch QuietCast Premium Ceramic Front Brake Pads',
      category: 'BRAKES',
      isBulkFluid: false,
      currentStock: 12.0,
      unitOfMeasure: 'UNIT',
      reorderLevel: 4.0,
      unitCost: 11000.00,
      unitPrice: 16500.00,
      binLocation: 'AISLE-01-D4',
    },
  });

  const sparkPlug = await prisma.inventoryItem.create({
    data: {
      partNumber: 'SPK-PLG-NGK-IR',
      name: 'NGK Laser Iridium Spark Plug ILKAR7B11',
      category: 'IGNITION',
      isBulkFluid: false,
      currentStock: 48.0,
      unitOfMeasure: 'UNIT',
      reorderLevel: 12.0,
      unitCost: 2900.00,
      unitPrice: 4500.00,
      binLocation: 'AISLE-02-C3',
    },
  });

  console.log('✅ Created Inventory Items & Bulk Fluids.');

  // 5. Job Card 1: In Progress with Full AI Damage & IoT Dispense
  const jobCard1 = await prisma.jobCard.create({
    data: {
      jobNumber: 'JOB-2026-0001',
      vehicleId: vehicle1.id,
      customerId: customer1.id,
      assignedBayId: bay1.id,
      status: 'IN_PROGRESS',
      intakeOdometer: 64250,
      customerNotes: 'Routine 65k service, brake inspection, and high-voltage battery checkup.',
      technicianVoiceNotes: 'Front pads 65% life. Engine oil drained cleanly. Filter replaced. Proceeding with 3.8L 0W-20 bulk dispense.',
      customerApprovedAt: new Date(Date.now() - 3600000 * 2),
      estimatedDeliveryAt: new Date(Date.now() + 3600000 * 3),
    },
  });

  // AI Damage Inspection for Job 1
  await prisma.aIDamageInspection.create({
    data: {
      jobCardId: jobCard1.id,
      anprPlateDetected: 'WP-CAB-4921',
      anprConfidence: 0.9842,
      detectedDamages: [
        {
          type: 'SCRATCH',
          severity: 'MINOR',
          confidence: 0.94,
          meshId: 'door_front_left',
          coords: { x: 142, y: 310 },
          note: 'Clear coat scuff mark near door handle',
        },
        {
          type: 'DENT',
          severity: 'MODERATE',
          confidence: 0.89,
          meshId: 'bumper_rear_right',
          coords: { x: 388, y: 440 },
          note: 'Parking scuff dent 3cm diameter',
        },
      ],
      treadDepthMm: {
        frontLeft: 4.8,
        frontRight: 4.7,
        rearLeft: 3.2,
        rearRight: 3.1,
      },
      snapshotUrls: [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      ],
    },
  });

  // Job Card Items for Job 1
  await prisma.jobCardItem.createMany({
    data: [
      {
        jobCardId: jobCard1.id,
        itemType: 'LABOR',
        serviceCode: 'SVC-LUBE-STD',
        description: 'Comprehensive 40-Point Periodic Lube Service & Safety Inspection',
        quantity: 1.0,
        unitPrice: 5500.00,
        totalAmount: 5500.00,
        isApprovedByCustomer: true,
      },
      {
        jobCardId: jobCard1.id,
        itemType: 'PART',
        inventoryItemId: oil0w20.id,
        description: 'Mobil 1 0W-20 Full Synthetic Engine Oil (3.8L Authorized Dispense)',
        quantity: 3.8,
        unitPrice: 4200.00,
        totalAmount: 15960.00,
        isApprovedByCustomer: true,
      },
      {
        jobCardId: jobCard1.id,
        itemType: 'PART',
        inventoryItemId: toyotaFilter.id,
        description: 'OEM Toyota Genuine Oil Filter Element',
        quantity: 1.0,
        unitPrice: 3200.00,
        totalAmount: 3200.00,
        isApprovedByCustomer: true,
      },
    ],
  });

  // IoT Dispense Log for Job 1 (Zero-Theft Proof)
  await prisma.ioTFluidDispenseLog.create({
    data: {
      jobCardId: jobCard1.id,
      inventoryItemId: oil0w20.id,
      dispenserDeviceId: 'ESP32-DISPENSER-GUN-01',
      authorizedLiters: 3.8,
      dispensedLiters: 3.8,
      pulseCount: 1710,
      kFactor: 450.0,
      status: 'COMPLETED',
    },
  });

  // EV Battery Passport for Job 1
  await prisma.eVBatteryPassport.create({
    data: {
      jobCardId: jobCard1.id,
      vehicleId: vehicle1.id,
      stateOfHealthPct: 92.4,
      stateOfChargePct: 78.0,
      cellVoltageDeltaMv: 14.5,
      packInternalResistanceMohm: 18.2,
      inverterTempCelsius: 38.5,
      diagnosticSummary: 'Nickel-Metal Hydride battery pack in optimal operational condition. All 28 modules balanced within normal thresholds.',
      certificateHash: 'CERT-BATT-PRIUS-924-E3A912',
    },
  });

  // 6. Job Card 2: Queued in Alignment Bay
  const jobCard2 = await prisma.jobCard.create({
    data: {
      jobNumber: 'JOB-2026-0002',
      vehicleId: vehicle2.id,
      customerId: customer2.id,
      assignedBayId: bay2.id,
      status: 'QUEUED',
      intakeOdometer: 48120,
      customerNotes: 'Slight steering pull to the left at highway speeds (80-100 km/h).',
      customerApprovedAt: new Date(Date.now() - 1800000),
      estimatedDeliveryAt: new Date(Date.now() + 3600000 * 4),
    },
  });

  await prisma.aIDamageInspection.create({
    data: {
      jobCardId: jobCard2.id,
      anprPlateDetected: 'WP-CBB-8812',
      anprConfidence: 0.9912,
      detectedDamages: [],
      treadDepthMm: {
        frontLeft: 5.4,
        frontRight: 4.1,
        rearLeft: 6.0,
        rearRight: 6.1,
      },
      snapshotUrls: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
      ],
    },
  });

  await prisma.jobCardItem.create({
    data: {
      jobCardId: jobCard2.id,
      itemType: 'LABOR',
      serviceCode: 'ALIGN-3D-4WHEEL',
      description: 'Computerized 3D 4-Wheel Laser Alignment & Camber/Toe Calibration',
      quantity: 1.0,
      unitPrice: 6500.00,
      totalAmount: 6500.00,
      isApprovedByCustomer: true,
    },
  });

  // 7. Job Card 3: Completed with Invoice & QR Gate Pass
  const jobCard3 = await prisma.jobCard.create({
    data: {
      jobNumber: 'JOB-2026-0003',
      vehicleId: vehicle3.id,
      customerId: customer3.id,
      assignedBayId: bay3.id,
      status: 'COMPLETED',
      intakeOdometer: 21340,
      customerNotes: 'Annual EV High-Voltage Diagnostic & Cabin HEPA Filter Replacement.',
      completedAt: new Date(Date.now() - 1800000),
    },
  });

  await prisma.eVBatteryPassport.create({
    data: {
      jobCardId: jobCard3.id,
      vehicleId: vehicle3.id,
      stateOfHealthPct: 98.6,
      stateOfChargePct: 84.0,
      cellVoltageDeltaMv: 7.2,
      packInternalResistanceMohm: 12.1,
      inverterTempCelsius: 31.0,
      diagnosticSummary: '800V Lithium-ion architecture in pristine health. Thermal management system and preconditioning heaters operating at 100% factory specifications.',
      certificateHash: 'CERT-BATT-IONIQ-986-F81B99',
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-0003',
      jobCardId: jobCard3.id,
      totalLaborAmount: 8500.00,
      totalPartsAmount: 9200.00,
      taxAmount: 2655.00,
      discountAmount: 0.00,
      netTotal: 20355.00,
      paymentStatus: 'PAID',
      paymentMethod: 'CORPORATE_FLEET_CREDIT',
      paidAt: new Date(),
    },
  });

  await prisma.gatePass.create({
    data: {
      gatePassNumber: 'GP-2026-0003',
      invoiceId: invoice3.id,
      vehicleId: vehicle3.id,
      qrTokenHash: 'HMAC-SHA256-AUTOOS-GP-TOKEN-9892013-SECURE',
      expiresAt: new Date(Date.now() + 3600000 * 24),
      isCleared: false,
    },
  });

  console.log('✅ Created Job Cards, Inspections, Invoices & Gate Passes.');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
