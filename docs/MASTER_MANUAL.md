# 🚗 AutoOS: Next-Gen Vehicle Service Center Management System
### *Enterprise Workshop Operating System & Deep-Tech Automation Suite*
**Designed & Built for Vikum Theekshana**

---

## 📸 Executive Visual Showcase

````carousel
![AutoOS 3D Cybernetic Brand Emblem](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/autoos_brand_emblem_1790657912604.jpg)
<!-- slide -->
![AutoOS Futuristic Smart Workshop](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/autoos_workshop_hero_1790657983141.jpg)
<!-- slide -->
![Landing Portal & Role Switcher](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/01_landing_portal.png)
<!-- slide -->
![Executive Workshop Command Center](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/02_executive_dashboard.png)
<!-- slide -->
![Dynamic Bay Kanban Constraint Matrix](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/03_bay_kanban_matrix.png)
<!-- slide -->
![Job Cards 7-Stage FSM Engine](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/04_active_job_cards.png)
<!-- slide -->
![Drive-Thru Edge AI Gate Scanner](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/05_ai_gate_scanner.png)
<!-- slide -->
![Ambient Voice-to-Job Assistant](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/06_ambient_voice_assistant.png)
<!-- slide -->
![IoT Zero-Theft Fluid Dispenser](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/07_iot_fluid_dispenser.png)
<!-- slide -->
![EV Battery Health Passport & 96-Cell Heatmap](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/08_ev_battery_passport.png)
<!-- slide -->
![Split-Billing & Instant PDF Invoicing](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/09_split_billing.png)
<!-- slide -->
![Security Cryptographic Gate Pass & Boom Barrier](/C:/Users/Vikum%20Theekshana/.gemini/antigravity-ide/brain/66ab4930-4ce2-4d3f-bde9-8ed95b56fbf4/10_security_gate_pass.png)
````

---

## 🏛️ System Architecture & Ports Summary

| Component | Port | Technology | Purpose |
| :--- | :--- | :--- | :--- |
| **AutoOS Web Dashboard** | `3030` | Next.js 14, React 18, Tailwind CSS | Command Center, Live Radar, Role Switcher |
| **AutoOS Core Engine** | `5050` | NestJS Monolith, Socket.io, PDFKit | REST APIs, FSM State transitions, PDF generation |
| **AutoOS Swagger Docs** | `5050` | OpenAPI 3.0 (`/api/docs`) | Interactive API exploration & testing |
| **PostgreSQL 16 DB** | `5432` | Docker (`autoos-postgres`), Prisma ORM | Relational entities, JSONB damage coordinates |
| **Redis Cache & BullMQ** | `6379` | Docker (`autoos-redis`) | High-speed job queue & pub/sub |
| **Edge Vision Service** | `8080` | FastAPI, YOLOv8, OpenCV Python | High-speed ANPR & 4-angle damage segmentation |
| **ESP32 IoT Node** | `MQTT 1883` | C++ Arduino, PlatformIO | Hall flow-meter pulse counter & solenoid relay |

---

## 👤 Workshop Personnel Accounts & Roles

The system is equipped with an **Executive Role Switcher** on the landing page (`http://localhost:3030`) allowing immediate, zero-friction access into every specialist role:

### 1. 👨‍💼 Service Advisor (Front-Desk Reception)
- **Portal Link:** `http://localhost:3030/dashboard/inspection`
- **Responsibilities:**
  - Automated vehicle intake when customer drives into the gantry.
  - Reviews optical ANPR plate detection and YOLOv8 defect bounding boxes.
  - Sends interactive WhatsApp estimates for single-click customer approval.
  - Creates Work Orders / Job Cards.

### 2. 🔧 Master Technician (Workshop Bay Floor)
- **Portal Link:** `http://localhost:3030/dashboard/voice-assistant`
- **Responsibilities:**
  - Hands-free bone-conduction Bluetooth headset operation (no touching greasy screens).
  - Ambient speech transcription parsing: says observations naturally (e.g. *"Replaced front brake pads and oil filter, requisitioning 4L 0W-20 Mobil synthetic"*).
  - AutoOS LLM intent parser automatically appends labor book time and parts requisitions to the Job Card.

### 3. ⚡ High-Voltage EV Specialist (Battery Diagnostics Lab)
- **Portal Link:** `http://localhost:3030/dashboard/battery-passport`
- **Responsibilities:**
  - Connects OBD-II CAN bus scanner (ISO 15765-4 500kbps).
  - Analyzes 96-cell pack matrix voltage imbalance heat-map ($\Delta V$).
  - Evaluates internal resistance ($m\Omega$) and fast-charging degradation curves.
  - Issues cryptographic SHA-256 tamper-proof **Battery Health Certificates**.

### 4. 🛢️ Fluid & Inventory Storekeeper
- **Portal Link:** `http://localhost:3030/dashboard/dispenser`
- **Responsibilities:**
  - Monitors 209L bulk synthetic oil drum levels.
  - Requests hardware solenoid valve unlock for a specific vehicle's exact required volume (e.g. 3.8L).
  - ESP32 microcontrollers verify active Job Card ID before energizing relay; automatically locks valve the instant the Hall sensor counts target pulses.
  - Audits the immutable zero-theft pulse ledger.

### 5. 📊 Workshop Operations Director (Chief Controller)
- **Portal Link:** `http://localhost:3030/dashboard` and `/dashboard/bays`
- **Responsibilities:**
  - Oversees workshop throughput, bay occupancy rates, and revenue.
  - Dynamic constraint satisfaction scheduling (matches 2-post lifts, 3D alignment pits, and 1000V EV isolated bays).
  - 1-Click Auto-Rebalance algorithm to re-sequence jobs upon delivery delays.

### 6. 🛡️ Security Gate Officer (Exit Barrier)
- **Portal Link:** `http://localhost:3030/dashboard/gate-pass`
- **Responsibilities:**
  - Scans customer's time-bound encrypted QR Gate Pass with tablet camera.
  - Verifies that the invoice is 100% PAID and vehicle is cleared.
  - Triggers automated boom barrier relay actuation (GPIO 26) to allow exit.

---

## 🛠️ Complete Manual Setup & Run Instructions A-Z

### Step 1: Start Docker Infrastructure
```powershell
# Open PowerShell in repository root:
docker run -d --name autoos-postgres -e POSTGRES_USER=autoos_user -e POSTGRES_PASSWORD=autoos_password -e POSTGRES_DB=autoos_db -p 5432:5432 postgres:16-alpine
docker run -d --name autoos-redis -p 6379:6379 redis:7-alpine
```

### Step 2: Synchronize & Seed Database
```powershell
cd "packages/database"
npx prisma db push
node seed.js
```

### Step 3: Start AutoOS Backend Engine (Port 5050)
```powershell
cd "apps/backend"
npm run build
node dist/main.js
# Backend will boot on http://localhost:5050/api
# Swagger docs live at http://localhost:5050/api/docs
```

### Step 4: Start AutoOS Web Dashboard (Port 3030)
```powershell
cd "apps/web-dashboard"
npm run start
# Open your browser at http://localhost:3030
```

### Step 5: (Optional) Start Python Edge Vision Service (Port 8080)
```powershell
cd "services/edge-vision"
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

---

## 🔌 Hardware Wiring & Calibration SOP

### ESP32 Zero-Theft Fluid Dispenser:
- **MCU:** ESP32-WROOM-32
- **Pin 18 (Output):** Connected to IN1 of Optocoupled 12V Relay (Active LOW) switching the 12V DC brass solenoid valve.
- **Pin 19 (Input Pull-up):** Connected to Yellow signal wire of Hall-Effect Turbine Flow Sensor (YF-S201 or heavy-duty oil turbine).
- **Pin 21 (Output):** Status LED (illuminates while fluid is dispensing).
- **Calibration Constant:** $450\text{ pulses / liter}$ for typical SAE 0W-20 / 5W-30 synthetic motor oil at 25°C.

### Exit Boom Barrier:
- **Pin 26 (Output):** Connected to relay controlling barrier gate motor trigger loop (15-second momentary contact).

---

## 🚀 GitHub Push Instructions

The repository has been committed locally on branch `main` (`commit d9947ab`).

To push cleanly to your GitHub profile:
1. Create a repository on GitHub named **`VehicleServiceCenterSystem`** (or your preferred name) under `https://github.com/VikumTheekshana/`.
2. Run this command in PowerShell:
```powershell
cd "C:\Users\Vikum Theekshana\Desktop\All\My\My Projects\VehicleServiceCenterSystem"
git remote add origin https://github.com/VikumTheekshana/VehicleServiceCenterSystem.git
git branch -M main
git push -u origin main
```

