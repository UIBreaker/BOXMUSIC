import React from 'react';
import { Search, X } from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';

interface SearchBarProps {
  query: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onClear,
}) => {
  const { accentTheme } = useMusic();

  return (
    <div className="sticky top-0 z-30 pt-2 pb-3 px-4 bg-[#07080c]/85 backdrop-blur-xl border-b border-white/5">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bạn muốn nghe bài hát, nghệ sĩ hay podcast nào?"
          className="w-full bg-[#151924] text-white text-xs font-medium pl-10 pr-10 py-3 rounded-2xl border border-white/10 placeholder-zinc-500 focus:outline-none transition-all"
          style={{
            borderColor: query ? accentTheme.color : undefined,
            boxShadow: query ? `0 0 16px -4px ${accentTheme.glow}` : undefined,
          }}
        />
        {query && (
          <button
            onClick={onClear}
            className="absolute right-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
