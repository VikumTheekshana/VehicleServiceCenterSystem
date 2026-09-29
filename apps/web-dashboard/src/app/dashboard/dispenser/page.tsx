'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Droplets,
  Cpu,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  Database
} from 'lucide-react';

export default function DispenserPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [fluids, setFluids] = useState<any[]>([]);
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [targetVolume, setTargetVolume] = useState('3.8');
  const [technicianName, setTechnicianName] = useState('Vikum T.');
  const [activeDispense, setActiveDispense] = useState<any>(null);
  const [simulatingFlow, setSimulatingFlow] = useState(false);
  const [currentPulses, setCurrentPulses] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);

  const loadData = async () => {
    try {
      const [logsData, fluidsData, jobsData] = await Promise.all([
        api.getDispenseLogs(),
        api.getFluids(),
        api.getJobCards(),
      ]);
      setLogs(logsData || []);
      setFluids(fluidsData || []);
      setJobCards(jobsData || []);
      if (jobsData && jobsData.length > 0) setSelectedJobId(jobsData[0].id);
    } catch (err) {
      console.error('Failed to load dispenser data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return;

    try {
      const res = await api.requestDispenseUnlock({
        jobCardId: selectedJobId,
        drumId: 'DRUM-01-MOBIL-0W20',
        targetVolumeLiters: parseFloat(targetVolume),
        technicianId: technicianName,
      });

      setActiveDispense(res.log);
      setCurrentPulses(0);
      setCurrentVolume(0);
      await loadData();
    } catch (err: any) {
      alert(`Authorization rejected: ${err.message}`);
    }
  };

  // Simulate ESP32 pulse flow
  const handleStartPumping = () => {
    if (!activeDispense) return;
    setSimulatingFlow(true);
    let pulses = 0;
    const target = parseFloat(targetVolume);
    const targetPulses = Math.round(target * 450); // 450 pulses per liter

    const interval = setInterval(async () => {
      pulses += 45;
      const vol = Math.min(target, +(pulses / 450).toFixed(2));
      setCurrentPulses(pulses);
      setCurrentVolume(vol);

      if (pulses >= targetPulses) {
        clearInterval(interval);
        setSimulatingFlow(false);

        // Record pulse log to backend
        try {
          await api.recordDispensePulses({
            logId: activeDispense.id,
            pulseCount: targetPulses,
            actualVolumeLiters: target,
          });
          alert(`Dispense complete! ESP32 Solenoid auto-locked at ${target}L.`);
          setActiveDispense(null);
          await loadData();
        } catch (err) {
          console.error(err);
        }
      }
    }, 120);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>IoT Zero-Theft Fluid Dispenser</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
              ESP32 SOLENOID INTERLOCK
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero bulk oil shrinkage. Flow meter pulse counters interlocked with active Job Cards; valves auto-lock when volume target is reached.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drum Status & Interlock Authorization */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-400" />
              <span>Bulk Oil Drums (209L)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">HARDWARE ONLINE</span>
          </div>

          {/* Drum Visual Level Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">Drum #01: Mobil 1 0W-20</span>
              <span className="text-amber-400 font-bold">186.2 L / 209 L</span>
            </div>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                style={{ width: '89%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Calibration: 450 pulses/L</span>
              <span>Valve: {activeDispense ? 'UNLOCKED' : 'LOCKED'}</span>
            </div>
          </div>

          {/* Interlock Authorization Request Form */}
          <form onSubmit={handleRequestUnlock} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Target Job Card:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                disabled={activeDispense || simulatingFlow}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              >
                {jobCards.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.jobNumber} ({j.vehicle?.licensePlate} - {j.vehicle?.model})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Target Volume (Liters):</label>
              <input
                type="number"
                step="0.1"
                value={targetVolume}
                onChange={(e) => setTargetVolume(e.target.value)}
                disabled={activeDispense || simulatingFlow}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Authorized Technician:</label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                disabled={activeDispense || simulatingFlow}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={activeDispense || simulatingFlow}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-950/40"
            >
              <Unlock className="w-4 h-4" />
              <span>REQUEST SOLENOID UNLOCK</span>
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Live Flow Monitor & Immutable Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Flow Dispenser Visualizer */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  ESP32 Solenoid & Flow Meter Real-Time Telemetry
                </h3>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  activeDispense
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {activeDispense ? 'VALVE ENERGIZED (12V ON)' : 'VALVE MECHANICALLY LOCKED'}
              </span>
            </div>

            {/* Live Meter Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">DISPENSED VOLUME</div>
                <div className="text-3xl font-black text-amber-400">
                  {currentVolume.toFixed(2)} <span className="text-xs text-slate-400">L</span>
                </div>
                <div className="text-[10px] text-slate-400">Target: {targetVolume} L</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">HALL SENSOR PULSES</div>
                <div className="text-3xl font-black text-cyan-400">
                  {currentPulses.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">@ 450 pulses/L</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">INTERLOCK STATUS</div>
                <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                  {activeDispense ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  <span>{activeDispense ? 'AUTHORIZED' : 'SECURE'}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Job: {activeDispense?.jobCardId ? 'LINKED' : 'UNASSIGNED'}
                </div>
              </div>
            </div>

            {/* Pumping Controls */}
            {activeDispense && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-300">
                    Solenoid Unlocked for {targetVolume}L
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Press below to trigger oil flow stream simulation
                  </div>
                </div>
                <button
                  onClick={handleStartPumping}
                  disabled={simulatingFlow}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-950/50"
                >
                  <Play className={`w-4 h-4 ${simulatingFlow ? 'animate-spin' : ''}`} />
                  <span>{simulatingFlow ? 'PUMPING BULK FLUID...' : 'TRIGGER DISPENSE'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Immutable Dispense Ledger */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Immutable Fluid Ledger (Zero-Theft Audit Trail)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">DRUM</th>
                    <th className="pb-2">TARGET VOL</th>
                    <th className="pb-2">ACTUAL VOL</th>
                    <th className="pb-2">PULSES</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2 text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 text-slate-200">{log.drumId}</td>
                      <td className="py-2.5 text-slate-300">{log.targetVolumeLiters} L</td>
                      <td className="py-2.5 text-amber-400 font-bold">
                        {log.actualVolumeLiters} L
                      </td>
                      <td className="py-2.5 text-cyan-400">{log.pulseCount?.toLocaleString()}</td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-700 text-emerald-400">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
