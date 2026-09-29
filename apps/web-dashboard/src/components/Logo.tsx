import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 'w-16 h-16', text: 'text-4xl', sub: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-6xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* 3D Cybernetic Illuminated Vector Emblem */}
      <div className={`relative flex items-center justify-center ${currentSize.icon}`}>
        <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-md animate-pulse"></div>
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-[0_0_12px_rgba(0,245,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="60%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="logoAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Outer Hex Ring */}
          <polygon
            points="50,4 90,26 90,74 50,96 10,74 10,26"
            stroke="url(#logoCyanGrad)"
            strokeWidth="3.5"
            fill="#090d16"
            className="transition-all duration-300"
          />

          {/* Inner Precision Gear Teeth */}
          <circle cx="50" cy="50" r="32" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Sleek Aerodynamic Car Silhouette */}
          <path
            d="M 24 58 
               C 27 52, 33 46, 42 43 
               C 49 40, 58 40, 68 45 
               C 74 48, 77 54, 79 58 
               C 78 62, 74 65, 70 65 
               C 66 65, 64 61, 60 61 
               C 56 61, 54 65, 48 65 
               C 42 65, 40 61, 36 61 
               C 32 61, 30 65, 26 65 
               Z"
            fill="url(#logoCyanGrad)"
          />

          {/* Glowing Wheels */}
          <circle cx="34" cy="62" r="5" fill="#0f172a" stroke="#00f5ff" strokeWidth="2" />
          <circle cx="68" cy="62" r="5" fill="#0f172a" stroke="#00f5ff" strokeWidth="2" />

          {/* Horizontal Edge Laser Scan Beam */}
          <line
            x1="14"
            y1="50"
            x2="86"
            y2="50"
            stroke="url(#logoAmberGrad)"
            strokeWidth="1.8"
            strokeDasharray="2 2"
          />

          {/* Laser Core Node */}
          <circle cx="50" cy="50" r="3" fill="#f59e0b" className="animate-ping" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-black tracking-wider flex items-center gap-1 text-white ${currentSize.text}`}>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-white bg-clip-text text-transparent">
              AUTO
            </span>
            <span className="text-amber-400 font-extrabold drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
              OS
            </span>
          </div>
          <span className={`font-mono uppercase tracking-[0.22em] text-slate-400 font-semibold ${currentSize.sub}`}>
            Next-Gen Workshop Core
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
