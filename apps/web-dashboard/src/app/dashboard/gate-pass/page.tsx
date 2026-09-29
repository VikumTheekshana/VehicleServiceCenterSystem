'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  QrCode,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function GatePassPage() {
  const [gatePasses, setGatePasses] = useState<any[]>([]);
  const [selectedPass, setSelectedPass] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [officerName, setOfficerName] = useState('Officer Fernando');
  const [verifying, setVerifying] = useState(false);
  const [barrierOpen, setBarrierOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const loadPasses = async () => {
    try {
      setLoading(true);
      const data = await api.getGatePasses();
      setGatePasses(data || []);
      if (data && data.length > 0) setSelectedPass(data[0]);
    } catch (err) {
      console.error('Failed to load gate passes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasses();
  }, []);

  const handleVerifyAndRelease = async () => {
    if (!selectedPass) return;
    try {
      setVerifying(true);
      const res = await api.verifyGatePass(selectedPass.qrPayload, officerName);
      setVerificationResult(res);

      if (res.valid) {
        // Trigger barrier release
        await api.releaseBoomBarrier(selectedPass.id);
        setBarrierOpen(true);

        // Confetti effect
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Auto lower barrier after 8 seconds
        setTimeout(() => {
          setBarrierOpen(false);
        }, 8000);

        await loadPasses();
      }
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Security Gate Pass & Boom Barrier</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
              CRYPTOGRAPHIC EXIT TERMINAL
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Time-bound encrypted QR codes verified at workshop gate before automated boom barrier relay actuation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Issued Gate Passes */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-md space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold px-2 block">
            Exit Passes Issued ({gatePasses.length})
          </span>

          <div className="space-y-2">
            {gatePasses.map((pass) => {
              const isSelected = selectedPass?.id === pass.id;
              return (
                <button
                  key={pass.id}
                  onClick={() => {
                    setSelectedPass(pass);
                    setVerificationResult(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-rose-500 shadow-md shadow-rose-950/40'
                      : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-xs font-bold text-rose-400">
                      {pass.passNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        pass.status === 'RELEASED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {pass.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-bold">
                    Vehicle: {pass.vehicle?.licensePlate || 'Plate Linked'}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Expires: {new Date(pass.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Cryptographic QR & Guard Action Terminal */}
        {selectedPass && (
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-md space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3 font-mono">
                    <h2 className="text-2xl font-black text-white">
                      {selectedPass.passNumber}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
                      {selectedPass.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Vehicle: {selectedPass.vehicle?.make} {selectedPass.vehicle?.model} ({selectedPass.vehicle?.licensePlate})
                  </div>
                </div>

                {/* Boom Barrier State Badge */}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-xs font-bold ${
                    barrierOpen
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-amber-400'
                  }`}
                >
                  {barrierOpen ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                  <span>{barrierOpen ? 'BOOM BARRIER RAISED' : 'BOOM BARRIER LOCKED'}</span>
                </div>
              </div>

              {/* QR Code Presentation */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-slate-950 border border-slate-800">
                <div className="p-3 bg-white rounded-xl shadow-lg shadow-cyan-950/30">
                  <QRCodeSVG
                    value={selectedPass.qrPayload}
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Cryptographic Exit Payload:
                    </span>
                    <span className="text-[11px] text-cyan-300 break-all">
                      {selectedPass.qrPayload}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">EXPIRES AT:</span>
                      <span className="text-amber-400 font-bold">
                        {new Date(selectedPass.expiresAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">SECURITY CHECK:</span>
                      <span className="text-emerald-400 font-bold">INVOICE PAID IN FULL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Guard Verification Action */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span>Guard Station Scan Verification Terminal</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">GPIO RELAY PIN 26</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    placeholder="Officer Name"
                    className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 outline-none"
                  />

                  <button
                    onClick={handleVerifyAndRelease}
                    disabled={verifying || barrierOpen}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-950/40"
                  >
                    <CheckCircle className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
                    <span>{verifying ? 'VERIFYING SIGNATURE...' : 'AUTHENTICATE & RAISE BARRIER'}</span>
                  </button>
                </div>
              </div>

              {/* Verification Outcome */}
              {verificationResult && (
                <div
                  className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
                    verificationResult.valid
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500 text-rose-300'
                  }`}
                >
                  <div className="font-bold">
                    {verificationResult.valid ? '✅ GATE PASS AUTHENTICATED' : '❌ VERIFICATION REJECTED'}
                  </div>
                  <div>{verificationResult.message}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
