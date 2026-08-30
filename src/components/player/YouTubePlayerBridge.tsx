import React, { useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicPlayerContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayerBridge: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    nextSong,
  } = useMusic();

  const playerRef = useRef<any>(null);
  const isReadyRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSyncTimeRef = useRef<number>(0);

  // Load YouTube IFrame Player API script if not loaded
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize or update YouTube Player when song changes
  useEffect(() => {
    const isYt = currentSong?.isYoutube || !!currentSong?.youtubeId;
    if (!isYt || !currentSong?.youtubeId) {
      if (playerRef.current && isReadyRef.current) {
        try {
          playerRef.current.stopVideo?.();
        } catch {}
      }
      return;
    }

    const videoId = currentSong.youtubeId;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 200);
        return;
      }

      if (playerRef.current) {
        try {
          playerRef.current.loadVideoById({
            videoId,
            startSeconds: currentSong.videoPreviewStart || 0,
          });
          if (isPlaying) {
            playerRef.current.playVideo?.();
          } else {
            playerRef.current.pauseVideo?.();
          }
        } catch {
          // Re-create player if reload failed
        }
        return;
      }

      try {
        playerRef.current = new window.YT.Player('yt-audio-bridge-iframe', {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            start: currentSong.videoPreviewStart || 0,
          },
          events: {
            onReady: (event: any) => {
              isReadyRef.current = true;
              event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // 0 = ENDED
              if (event.data === 0) {
                nextSong();
              }
            },
            onError: () => {
              // On playback error, move to next song after delay
              console.warn('YouTube Bridge Playback notice, moving next...');
            },
          },
        });
      } catch (err) {
        console.warn('Error creating YouTube Player instance:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
      // fallback poller
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          initPlayer();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [currentSong?.id, currentSong?.youtubeId]);

  // Sync play/pause state
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    const isYt = currentSong?.isYoutube || !!currentSong?.youtubeId;
    if (!isYt) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo?.();
      } else {
        playerRef.current.pauseVideo?.();
      }
    } catch {}
  }, [isPlaying]);

  // Sync volume & mute state
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute?.();
      } else {
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(Math.round(volume * 100));
      }
    } catch {}
  }, [volume, isMuted]);

  // Sync seek time (only if gap is > 2 seconds to avoid jitter)
  useEffect(() => {
    if (!playerRef.current || !isReadyRef.current) return;
    const isYt = currentSong?.isYoutube || !!currentSong?.youtubeId;
    if (!isYt) return;

    if (Math.abs(currentTime - lastSyncTimeRef.current) > 2) {
      try {
        playerRef.current.seekTo?.(currentTime, true);
        lastSyncTimeRef.current = currentTime;
      } catch {}
    } else {
      lastSyncTimeRef.current = currentTime;
    }
  }, [currentTime]);

  return (
    <div
      ref={containerRef}
      className="fixed -left-[9999px] -top-[9999px] w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-[-1]"
      aria-hidden="true"
    >
      <div id="yt-audio-bridge-iframe" />
    </div>
  );
};
