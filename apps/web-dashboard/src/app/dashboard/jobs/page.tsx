'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import {
  FileText,
  Clock,
  CheckCircle,
  Play,
  Check,
  Send,
  Wrench,
  User,
  Car,
  DollarSign,
  ChevronRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';

const FSM_STEPS = [
  'INTAKE',
  'INSPECTION',
  'CUSTOMER_APPROVAL',
  'IN_PROGRESS',
  'QUALITY_CHECK',
  'READY_FOR_DELIVERY',
  'CLOSED',
];

export default function JobsPage() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobCards();
      setJobCards(data || []);
      if (!selectedJob && data && data.length > 0) {
        setSelectedJob(data[0]);
      } else if (selectedJob) {
        const found = data.find((j: any) => j.id === selectedJob.id);
        if (found) setSelectedJob(found);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const socket = getSocket();
    socket.on('workshop_event', () => loadJobs());
    return () => {
      socket.off('workshop_event');
    };
  }, []);

  const handleAdvanceStatus = async (newStatus: string) => {
    if (!selectedJob) return;
    try {
      setUpdating(true);
      await api.updateJobCardStatus(selectedJob.id, newStatus);
      await loadJobs();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Job Cards & Service FSM Engine</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              7-STAGE WORKFLOW
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Finite State Machine tracking every vehicle from drive-thru intake to cryptographic exit gate-pass.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Cards List */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
              Active Job Cards ({jobCards.length})
            </span>
          </div>

          <div className="space-y-2">
            {jobCards.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-xs font-bold text-cyan-400">{job.jobNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400">
                      {job.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-200">
                    {job.vehicle?.make} {job.vehicle?.model}
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>{job.vehicle?.licensePlate}</span>
                    <span className="text-slate-400">{job.customer?.fullName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Job Details & FSM Stepper */}
        {selectedJob && (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-white font-mono">
                    {selectedJob.jobNumber}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                    Current: {selectedJob.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-mono">
                  <span>Customer: {selectedJob.customer?.fullName}</span>
                  <span>&bull;</span>
                  <span>Vehicle: {selectedJob.vehicle?.licensePlate} ({selectedJob.vehicle?.make} {selectedJob.vehicle?.model})</span>
                </div>
              </div>

              {/* Advance Button */}
              {selectedJob.status !== 'CLOSED' && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const currentIndex = FSM_STEPS.indexOf(selectedJob.status);
                    const nextStatus = FSM_STEPS[currentIndex + 1];
                    if (!nextStatus) return null;
                    return (
                      <button
                        onClick={() => handleAdvanceStatus(nextStatus)}
                        disabled={updating}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/40"
                      >
                        <Check className="w-4 h-4" />
                        <span>TRANSITION TO {nextStatus}</span>
                      </button>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* FSM Stepper */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                Finite State Machine Progress:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {FSM_STEPS.map((step, idx) => {
                  const currentIdx = FSM_STEPS.indexOf(selectedJob.status);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <div
                      key={step}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/20 shadow-md'
                          : isDone
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] font-mono mb-1 font-bold">
                        STAGE {idx + 1}
                      </div>
                      <div className="text-[11px] font-bold truncate">
                        {step.replace(/_/g, ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Voice Notes Section */}
            {selectedJob.technicianVoiceNotes && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Ambient Voice Assistant Transcription (Whisper STT):</span>
                </div>
                <p className="text-xs text-slate-300 italic font-mono leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-purple-900/40">
                  "{selectedJob.technicianVoiceNotes}"
                </p>
              </div>
            )}

            {/* Job Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  Labor Matrix Book Time & Parts Requisition
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-mono text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="pb-2">ITEM DESCRIPTION</th>
                      <th className="pb-2">TYPE</th>
                      <th className="pb-2 text-right">QTY / HOURS</th>
                      <th className="pb-2 text-right">RATE (LKR)</th>
                      <th className="pb-2 text-right">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {selectedJob.items?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 text-slate-200">{item.description}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              item.itemType === 'LABOR'
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {item.itemType}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-slate-300">{item.quantity}</td>
                        <td className="py-2.5 text-right text-slate-400">
                          {item.unitPrice.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right text-cyan-400 font-bold">
                          {item.subtotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer WhatsApp Notification Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    WhatsApp Interactive Estimate Dispatch
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Single-click interactive estimate approval via secure token
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert(`WhatsApp notification sent to ${selectedJob.customer?.phoneNumber || 'customer'}`)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-bold transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND ESTIMATE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
