import React from 'react';
import { Mic2, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 shadow-sm"></div>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-slate-900/80 p-2.5 rounded-xl border border-white/10 shadow-lg shadow-black/20">
                <Mic2 size={24} className="text-white" stroke="url(#gradient-stroke)" strokeWidth={2.5} />
                <svg width="0" height="0">
                  <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="#a78bfa" offset="0%" />
                    <stop stopColor="#e879f9" offset="100%" />
                  </linearGradient>
                </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Vocalize<span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">AI</span>
            </h1>
            <div className="flex items-center gap-1.5">
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Online</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-sm backdrop-blur-sm hover:bg-white/10 transition-colors">
          <Zap size={14} className="text-amber-400 fill-amber-400/20" />
          <span>Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;