'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ShieldAlert,
  Users,
  Settings,
  Cpu,
  Layers,
  Wrench,
  CheckCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Activity,
  Plus,
  Save,
  RotateCw,
  Sliders,
  Database
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  hourlyCost: number;
  status: 'ACTIVE' | 'ON_DUTY' | 'LEAVE';
  assignedBay: string;
}

interface IoTDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  status: 'ONLINE' | 'STANDBY' | 'WARNING';
  firmware: string;
  lastPing: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STAFF' | 'BAYS' | 'DEVICES' | 'AUDIT'>('OVERVIEW');
  const [bays, setBays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Seeded Admin Staff Data
  const [staff, setStaff] = useState<Employee[]>([
    {
      id: 'EMP-01',
      name: 'Vikum Theekshana',
      role: 'Chief Operations Controller & Super Admin',
      skills: ['Full Systems Command', 'CSP Solver Engine', 'Security Lead'],
      hourlyCost: 6500,
      status: 'ON_DUTY',
      assignedBay: 'All Bays Command',
    },
    {
      id: 'EMP-02',
      name: 'Kasun Wickramasinghe',
      role: 'Master Diagnostic Technician',
      skills: ['Engine Overhaul', 'Hybrid Transaxle', 'ASE L1 Certified'],
      hourlyCost: 4000,
      status: 'ON_DUTY',
      assignedBay: 'Bay 01 - Two-Post Lift',
    },
    {
      id: 'EMP-03',
      name: 'Dr. Nuwan Perera',
      role: 'High-Voltage EV Systems Engineer',
      skills: ['1000V Dielectric Certified', 'Lithium BMS Specialist', 'CAN Telemetry'],
      hourlyCost: 5500,
      status: 'ON_DUTY',
      assignedBay: 'Bay 03 - EV Isolated',
    },
    {
      id: 'EMP-04',
      name: 'Dinesh Jayasuriya',
      role: 'Suspension & 3D Alignment Lead',
      skills: ['Hunter 3D Alignment', 'Camber/Toe Calibration', 'Air Suspension'],
      hourlyCost: 3500,
      status: 'ACTIVE',
      assignedBay: 'Bay 02 - Alignment Pit',
    },
    {
      id: 'EMP-05',
      name: 'Sunil Fernando',
      role: 'Senior Gate Security Officer',
      skills: ['Cryptographic QR Auth', 'Boom Barrier Control', 'Perimeter Safety'],
      hourlyCost: 2200,
      status: 'ON_DUTY',
      assignedBay: 'Gate 01 Checkpoint',
    },
  ]);

  // Workshop IoT Hardware Fleet
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'DEV-ESP32-01',
      name: 'ESP32 Bulk Oil Dispenser Drum #01',
      type: 'Pulse Flow Solenoid Node',
      ip: '192.168.1.150 (MQTT: autoos/drum/01)',
      status: 'ONLINE',
      firmware: 'v2.4.1-AutoOS',
      lastPing: '2s ago',
    },
    {
      id: 'DEV-CAM-01',
      name: 'Gantry High-Speed ANPR Camera (Gate 01)',
      type: '4K Optical Scanner',
      ip: '192.168.1.101 (RTSP Stream)',
      status: 'ONLINE',
      firmware: 'YOLOv8-Edge-v1.8',
      lastPing: '1s ago',
    },
    {
      id: 'DEV-CAM-02',
      name: 'Multi-Angle Damage Cam (Gate 01 Left)',
      type: 'Optical Segmentation Cam',
      ip: '192.168.1.102 (RTSP Stream)',
      status: 'ONLINE',
      firmware: 'YOLOv8-Edge-v1.8',
      lastPing: '1s ago',
    },
    {
      id: 'DEV-RELAY-01',
      name: 'Boom Barrier Actuator Relay',
      type: 'Optocoupled GPIO 26 Relay',
      ip: '192.168.1.160',
      status: 'STANDBY',
      firmware: 'Firmware-Relay-v1.0',
      lastPing: '5s ago',
    },
    {
      id: 'DEV-OBD2-01',
      name: 'ISO 15765-4 High-Speed CAN Bus Logger',
      type: 'Bluetooth OBD-II Telemetry Scanner',
      ip: 'BT: 00:1B:44:11:3A:B7',
      status: 'ONLINE',
      firmware: 'OBD-CAN-v3.0',
      lastPing: '3s ago',
    },
  ]);

  useEffect(() => {
    api.getBays().then((data) => {
      setBays(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>System Administration & Workshop Governance</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-red-950/80 text-rose-400 border border-rose-800">
              SUPER ADMIN CONSOLE
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personnel skill matrix, workshop bay hourly tariffs, IoT hardware telemetry nodes, and cryptographic security audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('All system configuration parameters saved & synchronized across microservices.')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-950/40"
          >
            <Save className="w-4 h-4" />
            <span>SAVE WORKSHOP CONFIG</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'OVERVIEW', label: 'Admin Overview', icon: Activity },
          { key: 'STAFF', label: 'Staff & Technicians (5)', icon: Users },
          { key: 'BAYS', label: 'Bay Tariffs & Constraints (4)', icon: Wrench },
          { key: 'DEVICES', label: 'Hardware & IoT Nodes (5)', icon: Cpu },
          { key: 'AUDIT', label: 'Audit Trail & Compliance', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-950/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">ACTIVE WORKSHOP PERSONNEL</div>
              <div className="text-3xl font-black text-rose-400">5 Operators</div>
              <div className="text-[10px] text-emerald-400">100% On-Duty Shift Coverage</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">REGISTERED IOT HARDWARE NODES</div>
              <div className="text-3xl font-black text-cyan-400">5 Devices</div>
              <div className="text-[10px] text-cyan-400">All Nodes Responding &lt;5ms</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">ACTIVE WORKSHOP BAYS</div>
              <div className="text-3xl font-black text-amber-400">4 Bays</div>
              <div className="text-[10px] text-amber-400">Hydraulic, 3D, EV, Wash</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">GOVERNANCE & AUDIT TRAIL</div>
              <div className="text-3xl font-black text-emerald-400">ISO 27001</div>
              <div className="text-[10px] text-emerald-400">Immutable PostgreSQL Ledger</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Admin Actions */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
                <Settings className="w-4 h-4 text-rose-400" />
                <span>Global Workshop Configuration</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">Standard Value-Added Tax (VAT)</div>
                    <div className="text-[10px] text-slate-400">Inland Revenue Department statutory rate</div>
                  </div>
                  <span className="text-cyan-400 font-bold px-2 py-1 rounded bg-cyan-950 border border-cyan-800">
                    15.0%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">Social Security Contribution Levy (SSCL)</div>
                    <div className="text-[10px] text-slate-400">Sri Lanka statutory service tax</div>
                  </div>
                  <span className="text-cyan-400 font-bold px-2 py-1 rounded bg-cyan-950 border border-cyan-800">
                    2.5%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">Flow Meter Pulse Calibration Factor</div>
                    <div className="text-[10px] text-slate-400">SAE 0W-20 / 5W-30 synthetic motor oil</div>
                  </div>
                  <span className="text-amber-400 font-bold px-2 py-1 rounded bg-amber-950 border border-amber-800">
                    450 pulses / L
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">Boom Barrier Auto-Lower Timeout</div>
                    <div className="text-[10px] text-slate-400">Security clearance safety timer</div>
                  </div>
                  <span className="text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-950 border border-emerald-800">
                    15 Seconds
                  </span>
                </div>
              </div>
            </div>

            {/* Microservices Health Status */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Microservice Node Architecture</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">NestJS Monolith API Engine</div>
                    <div className="text-[10px] text-slate-400">Port 5050 &bull; WebSocket Radar Enabled</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                    RUNNING
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">Next.js 14 Web Command Center</div>
                    <div className="text-[10px] text-slate-400">Port 3030 &bull; App Router &bull; Tailwind</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                    RUNNING
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">PostgreSQL 16 Enterprise DB</div>
                    <div className="text-[10px] text-slate-400">Container: autoos-postgres:5432</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                    CONNECTED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">FastAPI YOLOv8 Edge Vision</div>
                    <div className="text-[10px] text-slate-400">Port 8080 &bull; 4K Optical Gantry Ingestion</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800">
                    STANDBY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAFF & TECHNICIANS */}
      {activeTab === 'STAFF' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Workshop Personnel & Technician Skill Matrices</span>
            </h3>
            <button
              onClick={() => alert('New technician onboarding modal')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ONBOARD TECHNICIAN</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-2">EMP ID</th>
                  <th className="pb-2">PERSONNEL</th>
                  <th className="pb-2">ORGANIZATIONAL ROLE</th>
                  <th className="pb-2">VERIFIED CERTIFICATIONS</th>
                  <th className="pb-2">STATION</th>
                  <th className="pb-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {staff.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/30">
                    <td className="py-3 text-cyan-400 font-bold">{emp.id}</td>
                    <td className="py-3 font-sans font-bold text-slate-100">{emp.name}</td>
                    <td className="py-3 text-slate-300">{emp.role}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.map((s, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-700 text-cyan-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{emp.assignedBay}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WORKSHOP BAYS */}
      {activeTab === 'BAYS' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Workshop Bay Capability & Labor Tariff Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {bays.map((bay) => (
              <div key={bay.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{bay.bayName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {bay.bayType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>Hourly Billing Rate:</div>
                  <div className="text-right text-amber-400 font-bold">Rs. {bay.hourlyRate} / hour</div>
                  <div>Current Occupancy:</div>
                  <div className="text-right text-emerald-400">{bay.isOccupied ? 'Occupied' : 'Vacant'}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Constraint Matching: ACTIVE</span>
                  <button
                    onClick={() => alert(`Adjust tariff for ${bay.bayName}`)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Adjust Rate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: IOT HARDWARE NODES */}
      {activeTab === 'DEVICES' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Active IoT Hardware Nodes & Gantry Sensor Fleet</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-2">DEVICE ID</th>
                  <th className="pb-2">DEVICE NAME</th>
                  <th className="pb-2">HARDWARE TYPE</th>
                  <th className="pb-2">NETWORK INTERFACE</th>
                  <th className="pb-2">FIRMWARE</th>
                  <th className="pb-2 text-right">TELEMETRY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {devices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-800/30">
                    <td className="py-3 text-purple-400 font-bold">{dev.id}</td>
                    <td className="py-3 font-sans font-bold text-slate-100">{dev.name}</td>
                    <td className="py-3 text-slate-300">{dev.type}</td>
                    <td className="py-3 text-cyan-300">{dev.ip}</td>
                    <td className="py-3 text-slate-400">{dev.firmware}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {dev.status} ({dev.lastPing})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Immutable Cryptographic Workshop Audit Trail</span>
          </h3>

          <div className="space-y-2 font-mono text-xs">
            {[
              {
                time: '13:20:15',
                action: 'GATE_PASS_AUTHENTICATED',
                operator: 'Officer Sunil Fernando',
                details: 'Cleared boom barrier for Hyundai Ioniq 5 (WP-CBE-1004) under Pass GP-2026-0001.',
              },
              {
                time: '13:18:40',
                action: 'INVOICE_SETTLED_PAID',
                operator: 'Vikum Theekshana',
                details: 'Processed payment of LKR 20,355 via Corporate Fleet Credit for INV-2026-0003.',
              },
              {
                time: '13:10:22',
                action: 'BATTERY_PASSPORT_SEALED',
                operator: 'Dr. Nuwan Perera',
                details: 'Cryptographic SHA-256 seal issued: CERT-BATT-IONIQ-986-F81B99.',
              },
              {
                time: '12:55:04',
                action: 'ESP32_SOLENOID_LOCKED',
                operator: 'Hardware Node #01',
                details: 'Hall flow sensor reached 1,710 pulses (3.80L target). Valve de-energized.',
              },
              {
                time: '12:45:10',
                action: 'BAY_CONSTRAINT_REBALANCE',
                operator: 'AutoOS CSP Solver Engine',
                details: 'Re-sequenced 4 bays. Zero bottlenecks detected across 3 active vehicles.',
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{log.action}</span>
                    <span className="text-[10px] text-slate-400">&bull; By {log.operator}</span>
                  </div>
                  <div className="text-slate-300 font-sans text-xs">{log.details}</div>
                </div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
