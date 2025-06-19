'use client'

import { useState, useEffect, useRef } from 'react'
import YouTube from 'react-youtube';
import { searchSongs, Song } from '@/services/youtubeService'

interface MusicPlayerProps {
  mood: string
  intensity: number
  shouldSkipSong: boolean
}

export default function MusicPlayer({ mood, intensity, shouldSkipSong }: MusicPlayerProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [songQueue, setSongQueue] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [songTitle, setSongTitle] = useState('Select a mood to start');
  const playerRef = useRef<any>(null);
  const nextSongTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (nextSongTimerRef.current) {
        clearTimeout(nextSongTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchSongs() {
      if (mood) {
        const songs = await searchSongs({ mood })
        setSongQueue(songs)
        setCurrentSongIndex(0)
        setCurrentSong(songs[0] || null)
        if (songs[0]) {
          setSongTitle(songs[0].title);
        }
      }
    }
    fetchSongs()
  }, [mood])

  useEffect(() => {
    if (shouldSkipSong) {
      handleNext()
    }
  }, [shouldSkipSong])

  const handleNext = () => {
    if (songQueue.length > 0) {
      if (nextSongTimerRef.current) {
        clearTimeout(nextSongTimerRef.current);
      }
      nextSongTimerRef.current = setTimeout(() => {
        const nextIndex = (currentSongIndex + 1) % songQueue.length;
        setCurrentSongIndex(nextIndex);
        setCurrentSong(songQueue[nextIndex]);
        setSongTitle(songQueue[nextIndex].title);
      }, 10000); // 10-second pause
    }
  };

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    event.target.playVideo();
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Song Info */}
      <div className="text-center">
        <div className="w-full aspect-video mx-auto mb-4 rounded-lg bg-black flex items-center justify-center overflow-hidden relative">
          {currentSong ? (
            <YouTube
              key={currentSong.id}
              videoId={currentSong.id}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                },
              }}
              onReady={onPlayerReady}
              onEnd={handleNext}
              className="w-full h-full"
            />
          ) : (
            <div className="text-4xl">🎵</div>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-1">{songTitle || 'Select a mood'}</h3>
        <p className="text-blue-200/60 text-sm">{currentSong ? `By ${currentSong.artist}` : (mood ? `Based on your ${mood} mood` : '')}</p>
      </div>
    </div>
  )
} 