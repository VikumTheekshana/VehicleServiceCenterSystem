'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  FileText,
  ScanEye,
  Mic,
  Droplets,
  BatteryCharging,
  CreditCard,
  QrCode,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

const navItems = [
  {
    name: 'Executive Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: 'LIVE',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
  },
  {
    name: 'Bay Kanban Matrix',
    href: '/dashboard/bays',
    icon: Wrench,
    badge: '4 BAYS',
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  },
  {
    name: 'Active Job Cards',
    href: '/dashboard/jobs',
    icon: FileText,
    badge: 'FSM',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
  },
  {
    name: 'AI Gate Scanner',
    href: '/dashboard/inspection',
    icon: ScanEye,
    badge: 'YOLOv8',
    badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-800',
  },
  {
    name: 'Ambient Voice-to-Job',
    href: '/dashboard/voice-assistant',
    icon: Mic,
    badge: 'AI STT',
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-800',
  },
  {
    name: 'IoT Fluid Dispenser',
    href: '/dashboard/dispenser',
    icon: Droplets,
    badge: 'ESP32',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
  },
  {
    name: 'EV Battery Passport',
    href: '/dashboard/battery-passport',
    icon: BatteryCharging,
    badge: 'SHA-256',
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  },
  {
    name: 'Billing & Split Invoicing',
    href: '/dashboard/billing',
    icon: CreditCard,
    badge: 'PDF',
    badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-800',
  },
  {
    name: 'Security QR Gate Pass',
    href: '/dashboard/gate-pass',
    icon: QrCode,
    badge: 'EXIT',
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/60 min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="mb-4 px-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Workshop Operations
        </span>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Hardware Calibration & ESP32 Node Status */}
      <div className="mt-auto pt-4 border-t border-slate-800/60">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">ESP32 Oil Node #1</span>
            <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ARMED
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">YOLOv8 Gate Cam</span>
            <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              READY
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">OBD-II CAN Bus</span>
            <span className="text-cyan-400 font-mono text-[10px]">STANDBY</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
