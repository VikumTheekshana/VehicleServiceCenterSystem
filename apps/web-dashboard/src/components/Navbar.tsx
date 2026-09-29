'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { getSocket } from '@/lib/socket';
import { 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Bell, 
  UserCircle 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);

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

    return () => {
      clearInterval(timer);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

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

          {/* Active Operator */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-amber-500 p-[1px]">
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-300 font-bold text-xs">
                OP
              </div>
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200">Vikum T.</span>
              <span className="text-[10px] text-cyan-400 font-mono">CHIEF CONTROLLER</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
