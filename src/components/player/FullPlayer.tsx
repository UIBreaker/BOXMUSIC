import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  ListMusic,
  Mic2,
  Disc3,
  Volume2,
  VolumeX,
  Share2,
  Clock,
  Check,
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useMusic } from '../../context/MusicPlayerContext';
import { SyncedLyrics } from './SyncedLyrics';
import { QueueView } from './QueueView';
import { Visualizer } from './Visualizer';
import { motion, AnimatePresence } from 'framer-motion';

export const FullPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isFullScreen,
    playerSubTab,
    likedSongIds,
    turntableMode,
    accentTheme,
    offlineSongIds,
    downloadingSongIds,
    toggleOfflineDownload,
    setIsFullScreen,
    setPlayerSubTab,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    toggleTurntableMode,
  } = useMusic();

  const [showShareToast, setShowShareToast] = useState(false);
  const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  if (!isFullScreen || !currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const isDownloaded = offlineSongIds.has(currentSong.id);
  const isDownloading = downloadingSongIds.has(currentSong.id);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seekTo(val);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: currentSong.title,
          text: `Đang nghe "${currentSong.title}" của ${currentSong.artist} trên BOXMUSIC!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Đang nghe "${currentSong.title}" - ${currentSong.artist} trên BOXMUSIC!`
      );
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleSetSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    setShowSleepTimerModal(false);
    if (minutes) {
      setTimeout(() => {
        if (isPlaying) togglePlay();
        setSleepTimerMinutes(null);
      }, minutes * 60 * 1000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed inset-0 z-50 flex flex-col bg-[#080a10] text-white select-none overflow-hidden max-w-md mx-auto"
      >
        {/* Dynamic Ambient Background Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[130px] opacity-35 pointer-events-none transition-all duration-1000"
          style={{ backgroundColor: currentSong.accentColor || accentTheme.color }}
        />

        {/* Top Navigation Bar */}
        <div className="pt-3 px-4 pb-2 flex items-center justify-between z-20">
          <button
            onClick={() => setIsFullScreen(false)}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-zinc-300 hover:text-white transition-transform active:scale-90 cursor-pointer"
            title="Thu nhỏ"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          <div className="text-center px-4 min-w-0">
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 block">
              Đang phát từ
            </span>
            <p className="text-xs font-bold text-zinc-200 truncate max-w-[180px]">
              {currentSong.album}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Offline Download Button */}
            <button
              onClick={() => toggleOfflineDownload(currentSong)}
              disabled={isDownloading}
              className={`w-9 h-9 rounded-full glass-card flex items-center justify-center transition-colors cursor-pointer ${
                isDownloaded ? 'text-emerald-400 border-emerald-500/40' : 'text-zinc-400 hover:text-white'
              }`}
              title={isDownloaded ? 'Đã tải về nghe Offline' : 'Tải về nghe Offline'}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : isDownloaded ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
            </button>

            {/* Sleep Timer */}
            <button
              onClick={() => setShowSleepTimerModal(true)}
              className={`w-9 h-9 rounded-full glass-card flex items-center justify-center transition-colors cursor-pointer ${
                sleepTimerMinutes ? 'text-emerald-400 border-emerald-500/40' : 'text-zinc-400 hover:text-white'
              }`}
              title="Hẹn giờ tắt nhạc"
            >
              <Clock className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Chia sẻ bài hát"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Switcher (Trình phát / Lời bài hát / Hàng đợi) */}
        <div className="px-6 py-2 flex items-center justify-center z-20">
          <div className="p-1 rounded-2xl glass-card flex items-center gap-1 border border-white/10">
            <button
              onClick={() => setPlayerSubTab('player')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                playerSubTab === 'player'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5" />
              Đĩa nhạc
            </button>
            <button
              onClick={() => setPlayerSubTab('lyrics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                playerSubTab === 'lyrics'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              Lời bài hát
            </button>
            <button
              onClick={() => setPlayerSubTab('queue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                playerSubTab === 'queue'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              Hàng đợi
            </button>
          </div>
        </div>

        {/* Center Stage Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
          {playerSubTab === 'player' && (
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-2 relative">
              {/* Turntable Vinyl Mode vs High-Res Album Art */}
              <div className="relative my-auto flex items-center justify-center">
                {turntableMode ? (
                  /* Vinyl Record View */
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 shadow-2xl border-4 border-zinc-700/60 flex items-center justify-center">
                    {/* Vinyl Grooves */}
                    <div className="absolute inset-4 rounded-full border border-white/5" />
                    <div className="absolute inset-8 rounded-full border border-white/5" />
                    <div className="absolute inset-12 rounded-full border border-white/5" />

                    {/* Rotating Inner Label */}
                    <div
                      className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-zinc-900 shadow-inner flex items-center justify-center relative ${
                        isPlaying ? 'animate-spin-slow' : 'animate-spin-slow-paused'
                      }`}
                    >
                      <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow" />
                    </div>
                  </div>
                ) : (
                  /* Standard Modern HD Art with ambient edge */
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: isPlaying ? 1 : 0.96 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
                  >
                    <img
                      src={currentSong.coverUrl}
                      alt={currentSong.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </motion.div>
                )}

                {/* Vinyl Mode Toggle Chip */}
                <button
                  onClick={toggleTurntableMode}
                  className="absolute -bottom-3 right-4 px-2.5 py-1 rounded-full glass-panel text-[10px] font-bold text-zinc-300 border border-white/15 shadow-md flex items-center gap-1 hover:text-white transition-all cursor-pointer"
                  title="Chuyển chế độ đĩa than"
                >
                  <Disc3 className="w-3 h-3 text-amber-400" />
                  <span>{turntableMode ? 'Ảnh vuông' : 'Đĩa than'}</span>
                </button>
              </div>

              {/* Audio Wave Visualizer */}
              <div className="w-full mt-4 mb-2">
                <Visualizer barCount={24} />
              </div>
            </div>
          )}

          {playerSubTab === 'lyrics' && <SyncedLyrics />}

          {playerSubTab === 'queue' && <QueueView />}
        </div>

        {/* Bottom Control Section */}
        <div className="px-6 pb-6 pt-2 z-20 bg-gradient-to-t from-[#080a10] via-[#080a10]/95 to-transparent space-y-4">
          {/* Track Info & Like Button */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-4 text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white truncate tracking-tight">
                  {currentSong.title}
                </h2>
                {isDownloaded && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    OFFLINE
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-zinc-400 truncate mt-0.5">
                {currentSong.artist}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={(e) => toggleLike(currentSong.id, e)}
              className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
              title="Yêu thích"
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-200 ${
                  isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'
                }`}
              />
            </motion.button>
          </div>

          {/* Seek Bar */}
          <div className="space-y-1.5">
            <div className="relative group flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                style={{
                  accentColor: accentTheme.color,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 select-none">
              <span>{formatTime(currentTime)}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 uppercase tracking-wider font-bold">
                LOSSLESS • 24BIT
              </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between pt-1">
            {/* Shuffle Button */}
            <button
              onClick={toggleShuffle}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isShuffle ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={{
                color: isShuffle ? accentTheme.color : undefined,
                filter: isShuffle ? `drop-shadow(0 0 6px ${accentTheme.glow})` : undefined,
              }}
              title="Xáo trộn bài hát"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevSong}
              className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-200 hover:text-white active:scale-85 transition-transform cursor-pointer"
              title="Bài trước"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            {/* Big Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-16 h-16 rounded-full flex items-center justify-center text-black font-extrabold shadow-2xl cursor-pointer transition-transform"
              style={{
                backgroundColor: accentTheme.color,
                boxShadow: `0 0 28px ${accentTheme.glow}`,
              }}
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-black text-black" />
              ) : (
                <Play className="w-7 h-7 fill-black text-black ml-1" />
              )}
            </motion.button>

            {/* Next Button */}
            <button
              onClick={nextSong}
              className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-200 hover:text-white active:scale-85 transition-transform cursor-pointer"
              title="Bài tiếp theo"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>

            {/* Repeat Mode Button */}
            <button
              onClick={toggleRepeat}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                repeatMode !== 'off' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={{
                color: repeatMode !== 'off' ? accentTheme.color : undefined,
                filter: repeatMode !== 'off' ? `drop-shadow(0 0 6px ${accentTheme.glow})` : undefined,
              }}
              title={`Lặp lại: ${repeatMode === 'one' ? '1 bài' : repeatMode === 'all' ? 'Tất cả' : 'Tắt'}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Volume Slider Bar */}
          <div className="flex items-center gap-3 pt-1 px-2">
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
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: accentTheme.color }}
            />
          </div>
        </div>

        {/* Share Feedback Toast */}
        <AnimatePresence>
          {showShareToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-panel border border-white/20 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 z-50"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Đã sao chép link bài hát vào bộ nhớ tạm!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleep Timer Modal */}
        <AnimatePresence>
          {showSleepTimerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowSleepTimerModal(false)}
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
                  onClick={() => setShowSleepTimerModal(false)}
                  className="w-full py-2 rounded-xl glass-card text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
