import React, { useEffect, useState } from 'react';
import { MusicPlayerProvider, useMusic } from './context/MusicPlayerContext';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { DesktopRightPanel } from './components/layout/DesktopRightPanel';
import { DesktopPlayerBar } from './components/layout/DesktopPlayerBar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { MiniPlayer } from './components/player/MiniPlayer';
import { FullPlayer } from './components/player/FullPlayer';
import { HomeView } from './components/home/HomeView';
import { SearchView } from './components/search/SearchView';
import { LibraryView } from './components/library/LibraryView';
import { ArtistModal } from './components/common/ArtistModal';
import { PlaylistDetailModal } from './components/library/PlaylistDetailModal';
import { CreatePlaylistModal } from './components/library/CreatePlaylistModal';
import { UploadSongModal } from './components/library/UploadSongModal';
import { SyncModal } from './components/library/SyncModal';
import { YouTubePlayerBridge } from './components/player/YouTubePlayerBridge';
import { decodeSyncToken, fetchCloudSync } from './services/storageService';
import confetti from 'canvas-confetti';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainAppLayout: React.FC = () => {
  const {
    mainTab,
    selectedArtist,
    setSelectedArtist,
    selectedPlaylist,
    setSelectedPlaylist,
    isCreatePlaylistOpen,
    setIsCreatePlaylistOpen,
    importLibraryBackup,
    accentTheme,
    dynamicCoverColor,
  } = useMusic();

  const [autoSyncToast, setAutoSyncToast] = useState<string | null>(null);

  // Auto-detect ?sync= parameter on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncParam = params.get('sync');
    if (syncParam) {
      const processSync = async () => {
        let parsed = decodeSyncToken(syncParam);
        if (!parsed) {
          parsed = await fetchCloudSync(syncParam);
        }
        if (parsed) {
          const success = importLibraryBackup(JSON.stringify(parsed));
          if (success) {
            setAutoSyncToast('Đã tự động đồng bộ thư viện nhạc thành công!');
            confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
            setTimeout(() => setAutoSyncToast(null), 4000);
            // Clean URL param
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      };
      processSync();
    }
  }, [importLibraryBackup]);

  return (
    <div className="min-h-screen h-screen w-screen bg-[#050608] text-zinc-100 flex flex-col overflow-hidden select-none font-sans relative">
      {/* Background Dynamic Ambient Auras — reacts to current song's cover art color */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-[2000ms]"
        style={{ backgroundColor: dynamicCoverColor || accentTheme.color }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10 pointer-events-none transition-all duration-[2000ms]"
        style={{ backgroundColor: dynamicCoverColor ? `${dynamicCoverColor}88` : '#6366F1' }}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative z-10">
        {/* DESKTOP LEFT SIDEBAR (Visible on >= 1024px lg screens) */}
        <div className="hidden lg:block flex-shrink-0">
          <DesktopSidebar />
        </div>

        {/* CENTER MAIN CONTENT STAGE (Adaptive for both Desktop & Mobile) */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {/* MOBILE HEADER (Visible on < 1024px) */}
          <div className="lg:hidden">
            <Header />
          </div>

          {/* SCROLLABLE VIEW CONTAINER */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            <AnimatePresence mode="wait">
              {mainTab === 'home' && (
                <motion.div
                  key="tab-home"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="max-w-6xl mx-auto w-full pt-2"
                >
                  <HomeView />
                </motion.div>
              )}

              {mainTab === 'search' && (
                <motion.div
                  key="tab-search"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="max-w-6xl mx-auto w-full pt-2"
                >
                  <SearchView />
                </motion.div>
              )}

              {mainTab === 'library' && (
                <motion.div
                  key="tab-library"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="max-w-6xl mx-auto w-full pt-2"
                >
                  <LibraryView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* DESKTOP RIGHT PANEL (Visible on >= 1024px lg screens) */}
        <div className="hidden lg:block flex-shrink-0">
          <DesktopRightPanel />
        </div>
      </div>

      {/* DESKTOP BOTTOM PLAYER BAR (Visible on >= 1024px screens) */}
      <div className="hidden lg:block">
        <DesktopPlayerBar />
      </div>

      {/* MOBILE CONTROLS & NAVIGATION (Visible on < 1024px) */}
      <div className="lg:hidden">
        {/* Floating Mini Player */}
        <MiniPlayer />

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Full Screen Player Modal (Universal for mobile swipe up or desktop expand) */}
      <FullPlayer />

      {/* Global YouTube Player Audio/Video Bridge */}
      <YouTubePlayerBridge />

      {/* Shared Modals - Available Globally Across All Tabs */}
      <UploadSongModal />

      <SyncModal />

      <ArtistModal
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />

      <PlaylistDetailModal
        playlist={selectedPlaylist}
        onClose={() => setSelectedPlaylist(null)}
      />

      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
      />

      {/* Auto Sync Success Toast */}
      <AnimatePresence>
        {autoSyncToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl glass-panel border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{autoSyncToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function App() {
  return (
    <MusicPlayerProvider>
      <MainAppLayout />
    </MusicPlayerProvider>
  );
}

export default App;
