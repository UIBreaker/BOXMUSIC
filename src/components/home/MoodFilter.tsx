import React from 'react';
import { MOOD_TAGS } from '../../data/mockData';
import { useMusic } from '../../context/MusicPlayerContext';

interface MoodFilterProps {
  activeMood: string;
  onSelectMood: (mood: string) => void;
}

export const MoodFilter: React.FC<MoodFilterProps> = ({
  activeMood,
  onSelectMood,
}) => {
  const { accentTheme } = useMusic();

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-4 select-none">
      {MOOD_TAGS.map((mood) => {
        const isActive = activeMood === mood;
        return (
          <button
            key={mood}
            onClick={() => onSelectMood(mood)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-black shadow-md'
                : 'glass-card text-zinc-400 hover:text-white hover:border-white/20'
            }`}
            style={{
              backgroundColor: isActive ? accentTheme.color : undefined,
              boxShadow: isActive ? `0 2px 10px ${accentTheme.glow}` : undefined,
            }}
          >
            {mood}
          </button>
        );
      })}
    </div>
  );
};
