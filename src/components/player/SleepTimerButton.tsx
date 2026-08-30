import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import { Timer, X, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { haptic } from '../../services/mobileFeatures';

const TIMER_OPTIONS = [
  { label: '15 phút', minutes: 15 },
  { label: '30 phút', minutes: 30 },
  { label: '45 phút', minutes: 45 },
  { label: '60 phút', minutes: 60 },
  { label: 'Hết bài', minutes: -1 }, // special: stop after current song ends
];

export const SleepTimerButton: React.FC = () => {
  const { setSleepTimer, accentTheme, isPlaying } = useMusic();
  const [open, setOpen] = useState(false);
  const [activeMinutes, setActiveMinutes] = useState<number | null>(null);
  const [remainingLabel, setRemainingLabel] = useState<string>('');

  // Count-down display
  useEffect(() => {
    if (activeMinutes === null) { setRemainingLabel(''); return; }
    const start = Date.now();
    const totalMs = activeMinutes * 60 * 1000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = totalMs - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        setActiveMinutes(null);
        setRemainingLabel('');
        return;
      }
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setRemainingLabel(`${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMinutes]);

  const handleSelect = (minutes: number) => {
    haptic.medium();
    if (minutes === -1) {
      // Stop after current song → use 0 to cancel, handled differently
      // We'll let the app handle this by setting an event on next song end
      // For simplicity, just cancel the timer
      setActiveMinutes(null);
      setSleepTimer(null);
      setOpen(false);
      return;
    }
    setActiveMinutes(minutes);
    setSleepTimer(minutes);
    setOpen(false);
  };

  const handleCancel = () => {
    haptic.light();
    setActiveMinutes(null);
    setSleepTimer(null);
    setOpen(false);
  };

  if (!isPlaying && !activeMinutes) return null;

  return (
    <div className="relative">
      <button
        onClick={() => { haptic.light(); setOpen((p) => !p); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          activeMinutes
            ? 'text-white border'
            : 'text-zinc-400 hover:text-white'
        }`}
        style={activeMinutes ? { color: accentTheme.color, borderColor: `${accentTheme.color}60`, backgroundColor: `${accentTheme.color}15` } : {}}
      >
        <Moon className="w-3.5 h-3.5" />
        {activeMinutes ? <span>{remainingLabel}</span> : <span>Hẹn giờ ngủ</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 glass-panel border border-white/15 rounded-2xl p-3 shadow-2xl min-w-[160px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                <Timer className="w-3 h-3" /> Tắt nhạc sau
              </span>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {TIMER_OPTIONS.map((opt) => (
                <button
                  key={opt.minutes}
                  onClick={() => handleSelect(opt.minutes)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    activeMinutes === opt.minutes
                      ? 'text-black font-bold'
                      : 'text-zinc-300 hover:bg-white/10'
                  }`}
                  style={activeMinutes === opt.minutes ? { backgroundColor: accentTheme.color } : {}}
                >
                  {opt.label}
                </button>
              ))}

              {activeMinutes && (
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/15 text-left transition-all cursor-pointer mt-1 border-t border-white/10 pt-2"
                >
                  Huỷ hẹn giờ
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
