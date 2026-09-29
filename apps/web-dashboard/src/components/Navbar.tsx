'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { getSocket } from '@/lib/socket';
import { useAuth, logoutUser } from '@/lib/auth';
import { 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Clock, 
  LogOut,
  User,
  ChevronDown,
  Shield,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    const socket = getSocket();
    setConnected(socket.connected);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'SUPER ADMIN', color: 'text-red-400 bg-red-950/60 border-red-800' };
      case 'DIRECTOR':
        return { label: 'DIRECTOR', color: 'text-sky-400 bg-sky-950/60 border-sky-800' };
      case 'SERVICE_ADVISOR':
        return { label: 'ADVISOR', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
      case 'TECHNICIAN':
        return { label: 'MASTER TECH', color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
      case 'EV_SPECIALIST':
        return { label: 'EV SPECIALIST', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 'STOREKEEPER':
        return { label: 'STOREKEEPER', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
      case 'SECURITY_GUARD':
        return { label: 'SECURITY', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
      default:
        return { label: 'STAFF', color: 'text-slate-400 bg-slate-900 border-slate-700' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="transition hover:opacity-90">
            <Logo size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            BAY OPTIMIZER ENGINE v2.6.4
          </div>
        </div>

        {/* Right Tools & Status */}
        <div className="flex items-center gap-4">
          {/* Realtime Clock */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{time || '--:--:-- --'}</span>
          </div>

          {/* WebSocket Pulse */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border ${
              connected
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
            }`}
          >
            {connected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">RADAR LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">OFFLINE</span>
              </>
            )}
          </div>

          {/* Quick Gate Pass Security Check */}
          <Link
            href="/dashboard/gate-pass"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">GATE BARRIER</span>
          </Link>

          {/* User Profile / Auth Action */}
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition group cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-amber-500 p-[1px]">
                  <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-300 font-bold text-xs font-mono">
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition truncate max-w-[130px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wider">
                    {roleInfo.label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">{user.email}</p>
                    <div className="mt-2">
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
                    >
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Admin & Governance Console</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Workshop Command Center</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-800/80 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out (Session End)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs uppercase tracking-wider transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
