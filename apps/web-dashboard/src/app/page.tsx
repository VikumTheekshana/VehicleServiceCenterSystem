'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { api } from '@/lib/api';
import { useAuth, logoutUser } from '@/lib/auth';
import {
  Wrench,
  ScanEye,
  Mic,
  Droplets,
  BatteryCharging,
  CreditCard,
  QrCode,
  ShieldCheck,
  Activity,
  ArrowRight,
  Server,
  Database,
  Cpu,
  Layers,
  Sparkles,
  LogIn,
  UserPlus,
  Shield,
  User,
  LogOut,
} from 'lucide-react';

const roles = [
  {
    title: 'System Administrator',
    badge: 'GOVERNANCE',
    desc: 'Bay tariffs ($/hr), technician staff management, hardware IoT node health, and ISO 27001 forensic audit trails.',
    href: '/dashboard/admin',
    icon: ShieldCheck,
    color: 'from-red-500/20 to-rose-500/10 border-red-500/40 text-red-400',
  },
  {
    title: 'Operations Director',
    badge: 'COMMAND CENTER',
    desc: 'Constraint-based bay solver, live Kanban rebalance, split billing, and technician utilization.',
    href: '/dashboard',
    icon: Activity,
    color: 'from-sky-500/20 to-cyan-500/10 border-sky-500/40 text-sky-400',
  },
  {
    title: 'Service Advisor',
    badge: 'FRONT DESK',
    desc: 'Digital intake, ANPR scanner ingestion, wireframe damage mapping, and WhatsApp estimates.',
    href: '/dashboard/inspection',
    icon: ScanEye,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
  },
  {
    title: 'Master Technician',
    badge: 'WORKSHOP BAY',
    desc: 'Hands-free ambient Voice-to-Job assistant, live labor book time, and parts requisitions.',
    href: '/dashboard/voice-assistant',
    icon: Mic,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400',
  },
  {
    title: 'HV / EV Specialist',
    badge: 'BATTERY LAB',
    desc: 'OBD-II CAN telemetry, 96-cell delta V heat-map, and cryptographic SHA-256 battery passports.',
    href: '/dashboard/battery-passport',
    icon: BatteryCharging,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
  },
  {
    title: 'Fluid & Inventory Mgr',
    badge: 'STORES & IOT',
    desc: 'Zero-theft ESP32 bulk fluid dispensing, flow-meter pulse ledger, and stock replenishment.',
    href: '/dashboard/dispenser',
    icon: Droplets,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
  },
  {
    title: 'Security Gate Officer',
    badge: 'GATE EXIT',
    desc: 'Cryptographic QR Gate Pass scanner, invoice settlement verification, and boom barrier trigger.',
    href: '/dashboard/gate-pass',
    icon: QrCode,
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-400',
  },
];

export default function LandingPortal() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    api
      .getHealth()
      .then((data) => {
        setHealthStatus(data);
        setLoadingHealth(false);
      })
      .catch((err) => {
        console.error('Backend health ping failed:', err);
        setLoadingHealth(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col bg-grid-pattern relative overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[600px] h-[300px] bg-gradient-to-t from-amber-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="lg" />

          {/* Engine Status & Auth Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  healthStatus?.status === 'HEALTHY'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300">
                {loadingHealth
                  ? 'CONNECTING TO ENGINE...'
                  : healthStatus?.status === 'HEALTHY'
                  ? 'ENGINE ONLINE (PORT 5050)'
                  : 'OFFLINE MODE'}
              </span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 transition"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/30 border border-rose-800/60 hover:bg-rose-900/40 text-rose-400 text-xs font-mono transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">LOGOUT</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SIGN IN</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>REGISTER</span>
                </Link>
              </div>
            )}

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02]"
            >
              <span>ENTER WORKSHOP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AUTONOMOUS WORKSHOP OPERATING SYSTEM (AutoOS)</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl text-white">
          The Next-Generation{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
            Automotive Service
          </span>{' '}
          Operating System
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
          Unifying Drive-Thru AI Gate Scanners, Ambient Voice-to-Job assistants, Constraint Satisfaction Bay Scheduling, IoT Zero-Theft Fluid Dispensing, and EV Battery Health Passports into a single real-time command mesh.
        </p>

        {/* Auth CTA Banner */}
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 transition transform hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHENTICATE & SIGN IN (7 ROLES)</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm tracking-wide transition"
          >
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>REGISTER NEW STAFF</span>
          </Link>
        </div>

        {/* Live Hardware & Core Stack Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400">
          <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            NestJS Monolith
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            PostgreSQL 16 JSONB
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            ESP32 Pulse Microcontrollers
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-1.5">
            <ScanEye className="w-3.5 h-3.5 text-purple-400" />
            YOLOv8 Edge Vision
          </span>
        </div>

        {/* Persona Switcher Section */}
        <div className="w-full mt-16 text-left">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Executive Operational Consoles
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select any operational role below to enter that specialist console directly:
              </p>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              7 ROLES CONFIGURED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.title}
                  href={r.href}
                  className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br ${r.color} bg-slate-900/60 border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-950/50`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/50 transition">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-950 text-slate-300">
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                    <span>LAUNCH CONSOLE</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">AutoOS Engine</span>
            <span>&bull;</span>
            <span>Built by Vikum Theekshana</span>
          </div>
          <div>
            <span>PostgreSQL 16 &bull; NestJS &bull; Next.js 14 &bull; Socket.io &bull; ESP32 Hardware Bus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
