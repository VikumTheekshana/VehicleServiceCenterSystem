# 🚗 AutoOS: Next-Gen Vehicle Service Center Management System
### Deep-Tech Smart Workshop Operating System Powered by Edge AI, IoT & Computer Vision

[![Architecture: Modular Monolith](https://img.shields.io/badge/Architecture-Modular%20Monolith-blueviolet.svg?style=for-the-badge)](PROJECT_CONTEXT.md)
[![Backend: NestJS](https://img.shields.io/badge/Backend-NestJS%2010.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Frontend: Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![IoT: MQTT](https://img.shields.io/badge/IoT-MQTT%20%2F%20ESP32-660066?style=for-the-badge&logo=mqtt&logoColor=white)](https://mqtt.org/)
[![Edge AI: YOLOv8](https://img.shields.io/badge/Edge%20AI-YOLOv8%20%2B%20FastALPR-00FFFF?style=for-the-badge&logo=opencv&logoColor=black)](https://ultralytics.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📖 About AutoOS

**AutoOS** is an autonomous, enterprise-grade operating system designed for modern vehicle service centers, automotive workshops, and fleet maintenance garages. It bridges physical garage realities with modern digital systems to solve the industry's most expensive operational failures:

- **Drive-thru Edge AI Gate Scanner:** Captures vehicle license plates (ANPR) and automatically maps body scratches, dents, and cracks onto 3D wireframe coordinates using YOLOv8 before the driver steps out.
- **Ambient Voice-to-Job Assistant:** Hands-free mechanics operating via bone-conduction headsets create job line items and requisition parts without touching oily screens.
- **Dynamic Constraint-Based Bay Scheduling:** Graph-based scheduling solver that auto-rebalances floor bays, technician skills, and parts availability when delays occur.
- **IoT Zero-Theft Bulk Fluid Dispensing:** ESP32-interlocked oil guns with digital pulse meters that unlock only for the exact vehicle oil volume (e.g., 3.8L) against active Job Cards.
- **EV & Hybrid Battery Passport:** Ingests OBD-II high-voltage battery parameters (State of Health %, cell voltage delta $\Delta V$, internal resistance) and generates certified Battery Passports.
- **Cryptographic QR Gate Pass:** Time-bound, HMAC-signed security clearance tokens that unlock exit boom barriers only upon verified payment settlement.

---

## 📂 Monorepo Structure

```
VehicleServiceCenterSystem/
├── apps/
│   ├── backend/                     # NestJS 10 Modular Core (REST, WebSockets, State Machine)
│   └── web-dashboard/               # Next.js 14 App Router (Executive Command Center & Bay Kanban)
├── services/
│   └── edge-vision/                 # Python FastAPI Service (ANPR & YOLOv8 Damage Segmentation)
├── packages/
│   ├── database/                    # PostgreSQL Schema, Prisma ORM & Master Data Seeders
│   └── shared-types/                # Shared TypeScript DTOs, Enums & Interfaces
├── hardware/
│   └── esp32-fluid-dispenser/       # ESP32 IoT Firmware (MQTT Client & Pulse Flow Interlock)
├── docs/                            # Hardware Calibration SOPs, Wiring & Topology Diagrams
├── PROJECT_CONTEXT.md               # Complete System Architectural Blueprint & Roadmap
├── package.json                     # Monorepo Workspace Configuration
└── LICENSE                          # MIT License
```

---

## 🚀 Getting Started

Read the full architectural blueprint and domain logic in [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md).

---

## 👤 Author

**Vikum Theekshana Dahanayake**
- 🌐 **GitHub**: [@VikumTheekshana](https://github.com/VikumTheekshana)
- 📧 **Email**: [vikumdahanayake5959@gmail.com](mailto:vikumdahanayake5959@gmail.com)
