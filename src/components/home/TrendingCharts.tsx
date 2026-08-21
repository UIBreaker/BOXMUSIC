import React from 'react';
import type { Song } from '../../types/music';
import { SongListItem } from '../common/SongListItem';
import { Trophy, TrendingUp } from 'lucide-react';

export const TrendingCharts: React.FC<{ songs: Song[] }> = ({ songs }) => {
  return (
    <div className="space-y-3 select-none text-left px-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Bảng xếp hạng tuần</span>
          </div>
          <h2 className="text-base font-extrabold text-white tracking-tight mt-0.5">
            Top Bài Hát Nghe Nhiều Nhất
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-1 glass-panel rounded-2xl p-2 border border-white/5">
        {songs.slice(0, 5).map((song, index) => (
          <SongListItem
            key={song.id}
            song={song}
            index={index}
            playlistContext={songs}
          />
        ))}
      </div>
    </div>
  );
};
