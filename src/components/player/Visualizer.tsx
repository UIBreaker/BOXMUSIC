import React from 'react';
import { useMusic } from '../../context/MusicPlayerContext';

export const Visualizer: React.FC<{ barCount?: number; className?: string }> = ({
  barCount = 20,
  className = '',
}) => {
  const { isPlaying, accentTheme, currentTime } = useMusic();

  return (
    <div className={`flex items-end justify-center gap-1 h-10 ${className}`}>
      {Array.from({ length: barCount }).map((_, index) => {
        // Calculate dynamic height based on playback time and bar index
        let height = 6;
        if (isPlaying) {
          const wave1 = Math.sin(currentTime * 4 + index * 0.7) * 14;
          const wave2 = Math.cos(currentTime * 2.5 + index * 0.4) * 10;
          height = Math.max(6, Math.min(36, Math.abs(18 + wave1 + wave2)));
        }

        return (
          <div
            key={index}
            className="w-1 rounded-full transition-all duration-150 ease-out"
            style={{
              height: `${height}px`,
              backgroundColor: accentTheme.color,
              opacity: isPlaying ? 0.7 + (index % 3) * 0.15 : 0.25,
              boxShadow: isPlaying ? `0 0 8px ${accentTheme.glow}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
