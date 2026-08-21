import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accentTheme } = useMusic();
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('09:41');

  // Real-time clock for mobile status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center p-0 md:p-4 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden font-sans">
      {/* Background ambient lighting effects */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: accentTheme.color }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: '#6366F1' }}
      />

      {/* Desktop Mode Switcher Floating Badge */}
      <div className="hidden md:flex items-center gap-2 mb-3 z-50 bg-[#12151f]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
        <span className="text-xs text-zinc-400 font-medium mr-1">Chế độ xem:</span>
        <button
          onClick={() => setIsFrameMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isFrameMode
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mô phỏng Điện thoại
        </button>
        <button
          onClick={() => setIsFrameMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            !isFrameMode
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Full Responsive
        </button>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full transition-all duration-500 relative ${
          isFrameMode
            ? 'max-w-[420px] h-[100dvh] md:h-[870px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-[#1E2230] md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col bg-[#07080c]'
            : 'max-w-md h-[100dvh] overflow-hidden flex flex-col bg-[#07080c] md:border-x md:border-white/10 md:shadow-2xl'
        }`}
      >
        {/* Phone Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between z-30 bg-transparent text-zinc-300 text-xs font-semibold select-none">
          <span>{currentTimeStr}</span>

          {/* Dynamic Island in Frame Mode */}
          {isFrameMode && (
            <div className="hidden md:flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-black border border-white/10 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar">
          {children}
        </div>

        {/* Phone Home Bar Indicator */}
        <div className="h-4 pb-1.5 flex items-center justify-center z-40 bg-transparent pointer-events-none">
          <div className="w-32 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
};
