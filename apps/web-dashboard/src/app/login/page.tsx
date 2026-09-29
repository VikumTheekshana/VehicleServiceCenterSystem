'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { loginUser } from '@/lib/auth';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  Cpu,
  ChevronRight,
} from 'lucide-react';

const demoPersonas = [
  {
    role: 'SUPER_ADMIN',
    title: 'SuperAdmin',
    name: 'Vikum Theekshana',
    email: 'admin@autoos.workshop',
    pass: 'Admin@12345',
    color: 'border-red-500/40 text-red-400 bg-red-950/30 hover:border-red-400',
  },
  {
    role: 'DIRECTOR',
    title: 'Operations Director',
    name: 'Samantha Silva',
    email: 'director@autoos.workshop',
    pass: 'Director@123',
    color: 'border-sky-500/40 text-sky-400 bg-sky-950/30 hover:border-sky-400',
  },
  {
    role: 'SERVICE_ADVISOR',
    title: 'Service Advisor',
    name: 'Nimal Perera',
    email: 'advisor@autoos.workshop',
    pass: 'Advisor@123',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30 hover:border-cyan-400',
  },
  {
    role: 'TECHNICIAN',
    title: 'Master Tech',
    name: 'Kasun Fernando',
    email: 'technician@autoos.workshop',
    pass: 'Tech@123',
    color: 'border-purple-500/40 text-purple-400 bg-purple-950/30 hover:border-purple-400',
  },
  {
    role: 'EV_SPECIALIST',
    title: 'EV Specialist',
    name: 'Dr. Dinesh Jayawardena',
    email: 'ev-specialist@autoos.workshop',
    pass: 'EvExpert@123',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30 hover:border-emerald-400',
  },
  {
    role: 'STOREKEEPER',
    title: 'Storekeeper',
    name: 'Sunil Wickramasinghe',
    email: 'storekeeper@autoos.workshop',
    pass: 'Store@123',
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/30 hover:border-amber-400',
  },
  {
    role: 'SECURITY_GUARD',
    title: 'Security Gate',
    name: 'Ranjith Bandara',
    email: 'security@autoos.workshop',
    pass: 'Gate@123',
    color: 'border-rose-500/40 text-rose-400 bg-rose-950/30 hover:border-rose-400',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@autoos.workshop');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setSuccess(`Authenticated as ${data.user.name} (${data.user.role})`);
      
      setTimeout(() => {
        if (data.user.role === 'SUPER_ADMIN') {
          router.push('/dashboard/admin');
        } else if (data.user.role === 'SERVICE_ADVISOR') {
          router.push('/dashboard/inspection');
        } else if (data.user.role === 'TECHNICIAN') {
          router.push('/dashboard/voice-assistant');
        } else if (data.user.role === 'EV_SPECIALIST') {
          router.push('/dashboard/battery-passport');
        } else if (data.user.role === 'STOREKEEPER') {
          router.push('/dashboard/dispenser');
        } else if (data.user.role === 'SECURITY_GUARD') {
          router.push('/dashboard/gate-pass');
        } else {
          router.push('/dashboard');
        }
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleQuickSelect = (p: typeof demoPersonas[0]) => {
    setEmail(p.email);
    setPassword(p.pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-grid-pattern">
      {/* Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[300px] bg-gradient-to-t from-amber-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <Link href="/" className="transition hover:opacity-90">
          <Logo size="lg" />
        </Link>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>ZERO-TRUST WORKSHOP IDENTITY & ACCESS</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/90 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 relative z-10">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Workshop Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter your certified credentials or pick a demo persona below
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@autoos.workshop"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 transition font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                Access Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                VERIFYING CERTIFICATE...
              </span>
            ) : (
              <>
                <span>SIGN IN TO AUTOOS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Persona Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              1-Click Demo Auto-Fill
            </span>
            <span className="text-[10px] text-slate-500">Pick any role</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {demoPersonas.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleQuickSelect(p)}
                className={`flex flex-col text-left p-2 rounded-lg border text-xs transition ${p.color}`}
              >
                <span className="font-bold text-[11px] leading-tight truncate">{p.title}</span>
                <span className="text-[10px] opacity-75 font-mono truncate">{p.email.split('@')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
          <p className="text-xs text-slate-400">
            Need an authorized staff account?{' '}
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4"
            >
              Register New Member
            </Link>
          </p>
        </div>
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition flex items-center gap-1.5 font-mono"
      >
        <span>← BACK TO PUBLIC SHOWCASE</span>
      </Link>
    </div>
  );
}
