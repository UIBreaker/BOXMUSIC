import React, { useState } from 'react';
import { Bell, Palette, Sparkles, Check } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { ACCENT_THEMES } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { accentTheme, setAccentTheme } = useMusic();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Chào buổi sáng ☀️';
    if (hour < 14) return 'Chào buổi trưa 🌤️';
    if (hour < 18) return 'Chào buổi chiều 🌅';
    return 'Chào buổi tối 🌙';
  };

  return (
    <header className="pt-2 pb-3 px-4 flex items-center justify-between sticky top-0 z-30 bg-[#07080c]/80 backdrop-blur-xl border-b border-white/5">
      {/* User Greeting & Avatar */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer">
          <div
            className="w-10 h-10 rounded-full overflow-hidden p-0.5 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${accentTheme.color}, #6366F1)`,
              boxShadow: `0 0 12px ${accentTheme.glow}`
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#07080c]"
            style={{ backgroundColor: accentTheme.color }}
          />
        </div>

        <div>
          <span className="text-xs font-medium text-zinc-400 block tracking-wide">
            {getGreeting()}
          </span>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            BOXMUSIC
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${accentTheme.color}25`,
                color: accentTheme.color,
                border: `1px solid ${accentTheme.color}50`
              }}
            >
              VIP
            </span>
          </h1>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Palette Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            title="Đổi màu chủ đề (Theme Accent)"
          >
            <Palette className="w-4 h-4" style={{ color: accentTheme.color }} />
          </button>

          {/* Theme Picker Dropdown */}
          <AnimatePresence>
            {showThemePicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemePicker(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute right-0 top-11 z-50 p-3 rounded-2xl glass-panel shadow-2xl border border-white/15 w-52"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="text-xs font-semibold text-zinc-300">Điểm nhấn màu sắc</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="space-y-1.5">
                    {ACCENT_THEMES.map((theme) => {
                      const isSelected = accentTheme.id === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setAccentTheme(theme);
                            setShowThemePicker(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            isSelected ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{ backgroundColor: theme.color }}
                            />
                            <span>{theme.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all cursor-pointer relative"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: accentTheme.color }}
            />
          </button>

          <AnimatePresence>
            {showNotification && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotification(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute right-0 top-11 z-50 p-3 rounded-2xl glass-panel shadow-2xl border border-white/15 w-64 text-left"
                >
                  <h4 className="text-xs font-bold text-white mb-2">Thông báo mới</h4>
                  <div className="p-2 rounded-xl bg-white/5 text-xs text-zinc-300 mb-1.5">
                    <p className="font-semibold text-white">✨ Daily Mix mới</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Mix Hàng Ngày 1 đã được làm mới theo sở thích của bạn!</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-xs text-zinc-300">
                    <p className="font-semibold text-white">🔥 Tăng Duy Tân ra mắt hit mới</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Khám phá ngay bài hát vừa phát hành.</p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
