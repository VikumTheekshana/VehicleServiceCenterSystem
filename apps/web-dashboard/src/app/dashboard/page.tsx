'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import {
  Wrench,
  Activity,
  Layers,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  RotateCw,
  Cpu,
  Car,
  Droplets,
  BatteryCharging
} from 'lucide-react';

export default function DashboardPage() {
  const [bays, setBays] = useState<any[]>([]);
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rebalancing, setRebalancing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [baysData, jobsData, invoicesData] = await Promise.all([
        api.getBays(),
        api.getJobCards(),
        api.getInvoices(),
      ]);
      setBays(baysData || []);
      setJobCards(jobsData || []);
      setInvoices(invoicesData || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const socket = getSocket();
    socket.on('workshop_event', (event: any) => {
      console.log('Realtime workshop event received:', event);
      loadData();
    });

    return () => {
      socket.off('workshop_event');
    };
  }, []);

  const handleRebalance = async () => {
    try {
      setRebalancing(true);
      await api.rebalanceBays();
      await loadData();
    } catch (err) {
      console.error('Rebalance error:', err);
    } finally {
      setRebalancing(false);
    }
  };

  // Compute metrics
  const occupiedBaysCount = bays.filter((b) => b.isOccupied).length;
  const occupancyPct = bays.length > 0 ? Math.round((occupiedBaysCount / bays.length) * 100) : 0;
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const activeJobsCount = jobCards.filter((j) => j.status !== 'CLOSED').length;

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Executive Workshop Command</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              REAL-TIME
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic constraint satisfaction scheduling, ambient voice processing, and IoT fluid dispensing telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRebalance}
            disabled={rebalancing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${rebalancing ? 'animate-spin' : ''}`} />
            <span>{rebalancing ? 'SOLVING CONSTRAINTS...' : 'AUTO-REBALANCE BAYS'}</span>
          </button>
          <Link
            href="/dashboard/inspection"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
          >
            <Car className="w-3.5 h-3.5" />
            <span>AI GATE INTAKE</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Bay Utilization</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{occupancyPct}%</span>
            <span className="text-xs font-mono text-slate-400">({occupiedBaysCount}/{bays.length} active)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Active Job Cards</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeJobsCount}</span>
            <span className="text-xs font-mono text-amber-400">in workshop FSM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Zero bottlenecks detected</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Day Invoiced Rev</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              Rs. {totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            Parts + Labor Split Settled
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">IoT Dispenser Pulse</span>
            <Droplets className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">3.8 L</span>
            <span className="text-xs font-mono text-purple-400">1,710 pulses</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Drum #01: 0W-20 Synthetics</p>
        </div>
      </div>

      {/* Workshop Bay Kanban Matrix Preview */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Live Workshop Bay Allocation</h2>
          </div>
          <Link
            href="/dashboard/bays"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>FULL BAY KANBAN</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bays.map((bay) => {
            const activeJob = bay.jobCards?.[0];
            return (
              <div
                key={bay.id}
                className={`p-4 rounded-xl border transition-all ${
                  bay.isOccupied
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-950/40 border-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {bay.bayName}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      bay.isOccupied
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {bay.isOccupied ? 'OCCUPIED' : 'VACANT'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono mb-2">
                  Rate: Rs. {bay.hourlyRate}/hr &bull; {bay.bayType}
                </div>

                {activeJob ? (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-cyan-400 font-bold">{activeJob.jobNumber}</span>
                      <span className="text-[10px] text-amber-400">{activeJob.status}</span>
                    </div>
                    <div className="text-slate-300 font-semibold truncate">
                      {activeJob.vehicle?.make} {activeJob.vehicle?.model} ({activeJob.vehicle?.licensePlate})
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Client: {activeJob.customer?.fullName}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-slate-950/30 border border-dashed border-slate-800 text-center text-xs text-slate-400 font-mono">
                    Ready for dynamic allocation
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Recent Job Cards & System Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Job Cards Table */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>Active Job Cards (FSM Flow)</span>
            </h2>
            <Link
              href="/dashboard/jobs"
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>MANAGE ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-2">JOB #</th>
                  <th className="pb-2">VEHICLE</th>
                  <th className="pb-2">CUSTOMER</th>
                  <th className="pb-2">STATUS</th>
                  <th className="pb-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {jobCards.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 text-cyan-400 font-bold">{job.jobNumber}</td>
                    <td className="py-3 text-slate-200">
                      {job.vehicle?.licensePlate || 'N/A'} - {job.vehicle?.model}
                    </td>
                    <td className="py-3 text-slate-300">{job.customer?.fullName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-amber-400">
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/dashboard/jobs"
                        className="text-cyan-400 hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Hardware Bus Status */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 backdrop-blur-md space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <span>Workshop Hardware Bus</span>
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">Drive-thru Gate ANPR</div>
                <div className="text-[10px] text-slate-400">RTSP: 192.168.1.101</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">ESP32 Fluid Dispenser</div>
                <div className="text-[10px] text-slate-400">MQTT: autoos/drum/01</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ONLINE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">OBD-II CAN Logger</div>
                <div className="text-[10px] text-slate-400">ISO 15765-4 500kbps</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                READY
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">Boom Barrier Relay</div>
                <div className="text-[10px] text-slate-400">GPIO 26 / Optocoupled</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                LOCKED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
