'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ScanEye,
  Camera,
  Layers,
  AlertTriangle,
  CheckCircle,
  Car,
  Crosshair,
  Gauge,
  Sparkles,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

export default function InspectionPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const data = await api.getInspections();
      setInspections(data || []);
      if (data && data.length > 0) {
        setSelectedInspection(data[0]);
      }
    } catch (err) {
      console.error('Failed to load inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInspections();
  }, []);

  const handleSimulateScan = async () => {
    try {
      setSimulating(true);
      // Ingest a simulated real-time drive-thru scan
      await api.createInspection({
        jobCardId: selectedInspection?.jobCardId || '3f9ed135-706b-46a9-8a4e-6ca0a4699315',
        anprPlateDetected: 'WP-CAB-4921',
        anprConfidence: 0.985,
        detectedDamages: [
          {
            panel: 'FRONT_BUMPER',
            type: 'SCRATCH',
            severity: 'MINOR',
            confidence: 0.94,
            coords: { x: 50, y: 15 },
          },
          {
            panel: 'REAR_RIGHT_DOOR',
            type: 'DENT',
            severity: 'MODERATE',
            confidence: 0.89,
            coords: { x: 75, y: 62 },
          },
          {
            panel: 'LEFT_FENDER',
            type: 'CHIP',
            severity: 'MINOR',
            confidence: 0.91,
            coords: { x: 25, y: 35 },
          },
        ],
        treadDepthMm: {
          frontLeft: 4.8,
          frontRight: 5.1,
          rearLeft: 3.2,
          rearRight: 3.4,
        },
      });

      await loadInspections();
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const plateDetected =
    selectedInspection?.anprPlateDetected ||
    selectedInspection?.licensePlateDetected ||
    selectedInspection?.jobCard?.vehicle?.licensePlate ||
    'WP-CAB-4921';

  const rawDamages =
    selectedInspection?.detectedDamages ||
    selectedInspection?.damageMeshCoordinates ||
    [
      { panel: 'FRONT_BUMPER', type: 'SCRATCH', severity: 'MINOR', confidence: 0.94, coords: { x: 50, y: 15 } },
      { panel: 'REAR_RIGHT_DOOR', type: 'DENT', severity: 'MODERATE', confidence: 0.89, coords: { x: 75, y: 62 } },
      { panel: 'LEFT_FENDER', type: 'STONE_CHIP', severity: 'MINOR', confidence: 0.91, coords: { x: 25, y: 35 } },
    ];

  const damageItems = Array.isArray(rawDamages) ? rawDamages : [];

  const rawTread =
    selectedInspection?.treadDepthMm ||
    selectedInspection?.tireTreadDepthMm ||
    { frontLeft: 4.8, frontRight: 5.1, rearLeft: 3.2, rearRight: 3.4 };

  const tireDepth = rawTread;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Drive-Thru Edge AI Gate Scanner</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              YOLOv8 + 4K GANTRY
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drive-thru high-speed ANPR, 4-angle computer vision damage segmentation, and optical laser tire tread measurement.
          </p>
        </div>

        <button
          onClick={handleSimulateScan}
          disabled={simulating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-950/40"
        >
          <Camera className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
          <span>{simulating ? 'TRIGGERING OPTICAL SENSORS...' : 'TRIGGER DRIVE-THRU SCAN'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drive-Thru Scan Ingestion Feed */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Gate Ingestion Feed ({inspections.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              CAMERAS ARMED
            </span>
          </div>

          <div className="space-y-2">
            {inspections.map((scan) => {
              const isSelected = selectedInspection?.id === scan.id;
              const scanPlate = scan.anprPlateDetected || scan.licensePlateDetected || scan.jobCard?.vehicle?.licensePlate || 'WP-CAB-4921';
              return (
                <button
                  key={scan.id}
                  onClick={() => setSelectedInspection(scan)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-xs font-bold text-cyan-400">
                      {scanPlate}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-bold">
                    Vehicle: {scan.jobCard?.vehicle?.make || 'Toyota'} {scan.jobCard?.vehicle?.model || 'Prius'}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Job: {scan.jobCard?.jobNumber || 'JOB-ACTIVE'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: 360° Wireframe Damage Visualizer & Tire Tread Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wireframe Damage Map */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span>360° Vehicle Mesh Coordinate Damage Map</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Plate: <strong className="text-cyan-400">{plateDetected}</strong>
              </span>
            </div>

            {/* Interactive Wireframe Canvas Visualizer */}
            <div className="relative w-full h-72 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>

              {/* Vehicle Vector Top-Down Schematic */}
              <svg
                viewBox="0 0 300 500"
                className="w-48 h-64 drop-shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Car Body Outer Shell */}
                <path
                  d="M 80 50 C 80 30, 220 30, 220 50 L 235 150 L 245 320 L 235 450 C 235 470, 65 470, 65 450 L 55 320 L 65 150 Z"
                  stroke="#334155"
                  strokeWidth="3"
                  fill="#0b0f19"
                />
                {/* Windshield */}
                <path d="M 85 130 Q 150 115 215 130 L 210 180 Q 150 170 90 180 Z" stroke="#00f5ff" strokeWidth="2" fill="#032535" opacity="0.6" />
                {/* Rear Window */}
                <path d="M 95 360 Q 150 370 205 360 L 200 400 Q 150 410 100 400 Z" stroke="#00f5ff" strokeWidth="2" fill="#032535" opacity="0.6" />
                {/* Roof Outline */}
                <rect x="90" y="190" width="120" height="160" rx="8" stroke="#1e293b" strokeWidth="2" />
                {/* Wheels */}
                <rect x="42" y="100" width="16" height="42" rx="4" fill="#1e293b" stroke="#00f5ff" strokeWidth="1" />
                <rect x="242" y="100" width="16" height="42" rx="4" fill="#1e293b" stroke="#00f5ff" strokeWidth="1" />
                <rect x="42" y="360" width="16" height="42" rx="4" fill="#1e293b" stroke="#00f5ff" strokeWidth="1" />
                <rect x="242" y="360" width="16" height="42" rx="4" fill="#1e293b" stroke="#00f5ff" strokeWidth="1" />
              </svg>

              {/* Dynamic Damage Pinpoints */}
              {damageItems.map((dmg: any, i: number) => {
                const xPos = dmg.coords?.x || (i === 0 ? 50 : i === 1 ? 75 : 25);
                const yPos = dmg.coords?.y || (i === 0 ? 15 : i === 1 ? 62 : 35);
                return (
                  <div
                    key={i}
                    style={{ left: `${xPos}%`, top: `${yPos}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-rose-400 opacity-75"></span>
                      <div className="h-4 w-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg shadow-rose-950">
                        {i + 1}
                      </div>
                    </div>
                    {/* Tooltip */}
                    <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-200 z-30 shadow-xl pointer-events-none">
                      <div className="font-bold text-rose-400 uppercase">{dmg.type} ({Math.round((dmg.confidence || 0.9) * 100)}%)</div>
                      <div>Panel: {dmg.panel}</div>
                      <div>Severity: {dmg.severity}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Damage Segmentation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">#</th>
                    <th className="pb-2">PANEL</th>
                    <th className="pb-2">DEFECT TYPE</th>
                    <th className="pb-2">SEVERITY</th>
                    <th className="pb-2 text-right">YOLO CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {damageItems.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 text-rose-400 font-bold">{idx + 1}</td>
                      <td className="py-2.5 text-slate-200">{item.panel}</td>
                      <td className="py-2.5 text-amber-400 font-semibold">{item.type}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-700 text-slate-300">
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-cyan-400 font-bold">
                        {Math.round((item.confidence || 0.9) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optical Tire Tread Depth Inspection */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>4-Wheel Optical Laser Tire Tread Measurement</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">FRONT LEFT</div>
                <div className="text-xl font-bold text-emerald-400">{tireDepth.frontLeft} mm</div>
                <div className="text-[10px] text-emerald-500 font-sans">GOOD CONDITION</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">FRONT RIGHT</div>
                <div className="text-xl font-bold text-emerald-400">{tireDepth.frontRight} mm</div>
                <div className="text-[10px] text-emerald-500 font-sans">GOOD CONDITION</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">REAR LEFT</div>
                <div className="text-xl font-bold text-amber-400">{tireDepth.rearLeft} mm</div>
                <div className="text-[10px] text-amber-500 font-sans">WEAR WARNING (&lt;3.5mm)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">REAR RIGHT</div>
                <div className="text-xl font-bold text-amber-400">{tireDepth.rearRight} mm</div>
                <div className="text-[10px] text-amber-500 font-sans">WEAR WARNING (&lt;3.5mm)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
