import React, { useState } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';
import { X, Plus, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createUserPlaylist, accentTheme } = useMusic();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createUserPlaylist(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-w-md mx-auto">
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full glass-panel p-6 rounded-3xl border border-white/15 shadow-2xl text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-bold"
                style={{ backgroundColor: accentTheme.color }}
              >
                <Music className="w-4 h-4" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                Tạo Danh Sách Phát Mới
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Tên Playlist *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Giai điệu mùa hè, Tập gym..."
                className="w-full bg-[#161a26] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả cảm xúc hoặc thể loại..."
                rows={2}
                className="w-full bg-[#161a26] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 placeholder-zinc-500 focus:outline-none focus:border-white/30 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl glass-card text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black shadow-lg transition-transform active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: accentTheme.color,
                  boxShadow: `0 0 14px ${accentTheme.glow}`,
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Tạo ngay</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
