import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Mic2,
  ListMusic,
  Maximize2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Music,
} from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import type { AudioQuality } from '../../types/music';
import { motion, AnimatePresence } from 'framer-motion';

export const DesktopPlayerBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    likedSongIds,
    desktopRightPanelTab,
    isDesktopRightPanelOpen,
    audioQuality,
    accentTheme,
    offlineSongIds,
    downloadingSongIds,
    toggleOfflineDownload,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    setDesktopRightPanelTab,
    setIsDesktopRightPanelOpen,
    setAudioQuality,
    setIsFullScreen,
    setIsUploadModalOpen,
  } = useMusic();

  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  if (!currentSong) {
    return (
      <footer className="h-22 bg-[#080a11]/95 backdrop-blur-2xl border-t border-white/[0.08] px-5 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
            <Music className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Thư viện nhạc cá nhân trống</p>
            <p className="text-xs text-zinc-400">Hãy thêm file MP3 / MP4 từ máy tính của bạn</p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-black flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          style={{ backgroundColor: accentTheme.color }}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Tải Nhạc Lên Ngay (+ MP3/MP4)</span>
        </button>
      </footer>
    );
  }

  const isLiked = likedSongIds.has(currentSong.id);
  const isDownloaded = offlineSongIds.has(currentSong.id) || currentSong.isCustomUpload;
  const isDownloading = downloadingSongIds.has(currentSong.id);

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(Number(e.target.value));
  };

  const handleToggleRightPanel = (tab: 'lyrics' | 'queue') => {
    if (isDesktopRightPanelOpen && desktopRightPanelTab === tab) {
      setIsDesktopRightPanelOpen(false);
    } else {
      setDesktopRightPanelTab(tab);
      setIsDesktopRightPanelOpen(true);
    }
  };

  const handleSetSleepTimer = (mins: number | null) => {
    setSleepTimerMinutes(mins);
    setShowSleepModal(false);
    if (mins) {
      setTimeout(() => {
        if (isPlaying) togglePlay();
        setSleepTimerMinutes(null);
      }, mins * 60 * 1000);
    }
  };

  const qualities: { id: AudioQuality; label: string; desc: string }[] = [
    { id: 'lossless', label: 'Lossless Hi-Res (24-bit / 96kHz)', desc: 'Chất lượng phòng thu cao cấp nhất' },
    { id: 'hires', label: 'High Quality (320kbps MP3)', desc: 'Âm thanh chi tiết, mượt mà' },
    { id: 'standard', label: 'Tiết kiệm dữ liệu (160kbps)', desc: 'Tối ưu tốc độ tải' },
  ];

  return (
    <footer className="h-22 bg-[#080a11]/95 backdrop-blur-2xl border-t border-white/[0.08] px-5 flex items-center justify-between z-40 select-none">
      {/* Left: Track Info & Quick Actions */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[220px]">
        {/* Cover thumbnail */}
        <div
          onClick={() => setIsFullScreen(true)}
          className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 shadow-md flex-shrink-0 cursor-pointer group"
        >
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-white truncate hover:underline cursor-pointer">
              {currentSong.title}
            </p>
            {isDownloaded && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">
            {currentSong.artist}
          </p>
        </div>

        {/* Download & Like Buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {!currentSong.isCustomUpload && (
            <button
              onClick={() => toggleOfflineDownload(currentSong)}
              disabled={isDownloading}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDownloaded ? 'text-emerald-400' : 'text-zinc-400 hover:text-white'
              }`}
              title={isDownloaded ? 'Đã tải về nghe Offline (Bấm để xóa)' : 'Tải về nghe Offline'}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : isDownloaded ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
            </button>
          )}

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => toggleLike(currentSong.id, e)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Yêu thích"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* Center: Controls & Seek Bar */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        {/* Buttons Row */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`transition-colors cursor-pointer ${
              isShuffle ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={{
              color: isShuffle ? accentTheme.color : undefined,
              filter: isShuffle ? `drop-shadow(0 0 6px ${accentTheme.glow})` : undefined,
            }}
            title="Trộn bài"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Prev */}
          <button
            onClick={prevSong}
            className="text-zinc-300 hover:text-white transition-colors active:scale-90 cursor-pointer"
            title="Bài trước"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Big Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold shadow-xl cursor-pointer"
            style={{
              backgroundColor: accentTheme.color,
              boxShadow: `0 0 16px ${accentTheme.glow}`,
            }}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            )}
          </motion.button>

          {/* Next */}
          <button
            onClick={nextSong}
            className="text-zinc-300 hover:text-white transition-colors active:scale-90 cursor-pointer"
            title="Bài tiếp theo"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`transition-colors cursor-pointer ${
              repeatMode !== 'off' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            style={{
              color: repeatMode !== 'off' ? accentTheme.color : undefined,
              filter: repeatMode !== 'off' ? `drop-shadow(0 0 6px ${accentTheme.glow})` : undefined,
            }}
            title="Lặp lại"
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-semibold text-zinc-400 w-8 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer focus:outline-none"
              style={{ accentColor: accentTheme.color }}
            />
          </div>

          <span className="text-[11px] font-semibold text-zinc-400 w-8 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Extra Controls, Quality, Volume & Fullscreen */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[220px]">
        {/* Live Lyrics Button */}
        <button
          onClick={() => handleToggleRightPanel('lyrics')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isDesktopRightPanelOpen && desktopRightPanelTab === 'lyrics'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          style={{
            color: isDesktopRightPanelOpen && desktopRightPanelTab === 'lyrics' ? accentTheme.color : undefined,
          }}
          title="Lời bài hát đồng bộ"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Button */}
        <button
          onClick={() => handleToggleRightPanel('queue')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isDesktopRightPanelOpen && desktopRightPanelTab === 'queue'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
          style={{
            color: isDesktopRightPanelOpen && desktopRightPanelTab === 'queue' ? accentTheme.color : undefined,
          }}
          title="Danh sách chờ"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Audio Quality Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="px-2 py-1 rounded-lg glass-card border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1 hover:border-emerald-500/40 transition-colors cursor-pointer"
            title="Chất lượng âm thanh"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>LOSSLESS</span>
          </button>

          <AnimatePresence>
            {showQualityMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowQualityMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 bottom-12 z-50 p-3 rounded-2xl glass-panel shadow-2xl border border-white/15 w-64 text-left space-y-1.5"
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/10">
                    <span className="text-xs font-bold text-white">Chất lượng phát nhạc</span>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  {qualities.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setAudioQuality(q.id);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left transition-all ${
                        audioQuality === q.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{q.label}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{q.desc}</p>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Sleep Timer */}
        <button
          onClick={() => setShowSleepModal(true)}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            sleepTimerMinutes ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-400 hover:text-white'
          }`}
          title="Hẹn giờ tắt nhạc"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: accentTheme.color }}
          />
        </div>

        {/* Expand Fullscreen Player */}
        <button
          onClick={() => setIsFullScreen(true)}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Xem toàn màn hình"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sleep Timer Modal */}
      <AnimatePresence>
        {showSleepModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowSleepModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-xs glass-panel p-5 rounded-3xl border border-white/15 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Hẹn giờ tắt nhạc</h3>
              <p className="text-xs text-zinc-400 mb-4">
                Nhạc sẽ tự động tạm dừng sau thời gian đã chọn.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetSleepTimer(mins)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      sleepTimerMinutes === mins
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'glass-card border-white/10 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
              {sleepTimerMinutes && (
                <button
                  onClick={() => handleSetSleepTimer(null)}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 mb-2 transition-colors cursor-pointer"
                >
                  Tắt hẹn giờ
                </button>
              )}
              <button
                onClick={() => setShowSleepModal(false)}
                className="w-full py-2 rounded-xl glass-card text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
