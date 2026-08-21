import React from 'react';
import { Home, Compass, Library } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import type { MainTab } from '../../types/music';
import { motion } from 'framer-motion';

export const BottomNav: React.FC = () => {
  const { mainTab, setMainTab, accentTheme } = useMusic();

  const navItems: { id: MainTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'search', label: 'Khám phá', icon: Compass },
    { id: 'library', label: 'Thư viện', icon: Library },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-auto">
      <div className="mx-3 mb-2 rounded-2xl glass-nav px-4 py-2 flex items-center justify-around shadow-2xl shadow-black/80 border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = mainTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setMainTab(item.id)}
              className="relative flex flex-col items-center justify-center py-1 px-4 cursor-pointer transition-all duration-300 group focus:outline-none"
            >
              {/* Active Background Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 rounded-xl bg-white/5 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              {/* Icon with subtle bounce */}
              <motion.div
                whileTap={{ scale: 0.85 }}
                animate={{ scale: isActive ? 1.08 : 1 }}
                className="relative"
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                  style={{
                    color: isActive ? accentTheme.color : undefined,
                    filter: isActive ? `drop-shadow(0 0 8px ${accentTheme.glow})` : undefined,
                  }}
                />
                {isActive && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accentTheme.color }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium mt-1 transition-colors duration-200 ${
                  isActive ? 'font-semibold text-white' : 'text-zinc-400'
                }`}
                style={{ color: isActive ? accentTheme.color : undefined }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
