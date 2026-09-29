'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import {
  Wrench,
  Layers,
  RotateCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRightLeft,
  User,
  Gauge
} from 'lucide-react';

export default function BaysKanbanPage() {
  const [bays, setBays] = useState<any[]>([]);
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rebalancing, setRebalancing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [targetBay, setTargetBay] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [baysData, jobsData] = await Promise.all([
        api.getBays(),
        api.getJobCards(),
      ]);
      setBays(baysData || []);
      setJobCards(jobsData || []);
    } catch (err) {
      console.error('Failed to load bay data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const socket = getSocket();
    socket.on('workshop_event', () => loadData());
    return () => {
      socket.off('workshop_event');
    };
  }, []);

  const handleRebalance = async () => {
    try {
      setRebalancing(true);
      const res = await api.rebalanceBays();
      setMessage(res.message || 'Constraint solver rebalanced all workshop bays.');
      await loadData();
    } catch (err) {
      console.error('Rebalance error:', err);
    } finally {
      setRebalancing(false);
    }
  };

  const handleManualReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !targetBay) return;
    try {
      await api.assignBay(selectedJob, targetBay);
      setMessage(`Job successfully reassigned to target bay.`);
      setSelectedJob('');
      setTargetBay('');
      await loadData();
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Dynamic Bay Kanban Matrix</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              CONSTRAINT SOLVER ACTIVE
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bay Capability Matching (Lift Rating, 3D Camera Pit, 1000V Dielectric Isolation) with real-time technician skill allocation.
          </p>
        </div>

        <button
          onClick={handleRebalance}
          disabled={rebalancing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-950/50"
        >
          <RotateCw className={`w-4 h-4 ${rebalancing ? 'animate-spin' : ''}`} />
          <span>{rebalancing ? 'SOLVING CSP EQUATIONS...' : 'AUTO-SOLVE WORKSHOP LOAD'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Manual Allocation Drawer */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span>Manual Bay Dispatch Overrule:</span>
        </div>
        <form onSubmit={handleManualReassign} className="flex flex-wrap items-center gap-3">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500 outline-none"
          >
            <option value="">-- Select Active Job --</option>
            {jobCards.map((j) => (
              <option key={j.id} value={j.id}>
                {j.jobNumber} ({j.vehicle?.licensePlate || 'No Plate'} - {j.status})
              </option>
            ))}
          </select>

          <select
            value={targetBay}
            onChange={(e) => setTargetBay(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cyan-500 outline-none"
          >
            <option value="">-- Target Bay --</option>
            {bays.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bayName} ({b.isOccupied ? 'Occupied' : 'Vacant'})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!selectedJob || !targetBay}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-cyan-400 border border-slate-700 transition"
          >
            DISPATCH JOB
          </button>
        </form>
      </div>

      {/* Bay Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {bays.map((bay) => {
          const activeJobs = bay.jobCards || [];
          return (
            <div
              key={bay.id}
              className={`flex flex-col rounded-2xl border backdrop-blur-md overflow-hidden ${
                bay.isOccupied
                  ? 'bg-slate-900/80 border-cyan-500/40 shadow-xl shadow-cyan-950/30'
                  : 'bg-slate-950/40 border-slate-800/80'
              }`}
            >
              {/* Bay Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{bay.bayName}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Type: <span className="text-cyan-400">{bay.bayType}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    bay.isOccupied
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}
                >
                  {bay.isOccupied ? 'BUSY' : 'READY'}
                </span>
              </div>

              {/* Bay Details Bar */}
              <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  Rs. {bay.hourlyRate}/hr
                </span>
                <span>Active Slots: {activeJobs.length}</span>
              </div>

              {/* Bay Body / Cards */}
              <div className="p-4 flex-1 space-y-3 min-h-[220px]">
                {activeJobs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400 font-mono">
                    <Wrench className="w-8 h-8 text-slate-700 mb-2" />
                    <span>Bay Vacant</span>
                    <span className="text-[10px] text-slate-400 mt-1">Constraint solver ready</span>
                  </div>
                ) : (
                  activeJobs.map((job: any) => (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-cyan-500/50 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {job.jobNumber}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">
                          {job.status}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-200">
                        {job.vehicle?.make} {job.vehicle?.model}
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Plate: {job.vehicle?.licensePlate}</span>
                        <span>Odo: {job.intakeOdometer?.toLocaleString()} km</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 line-clamp-2 italic">
                        "{job.customerNotes || 'Routine comprehensive multi-point service'}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
