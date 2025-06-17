'use client'

import { useState, useEffect } from 'react'
import { searchSongs, YouTubeSong } from '../services/youtubeService'

interface MusicPlayerProps {
  mood: string
  intensity: number
}

export default function MusicPlayer({ mood, intensity }: MusicPlayerProps) {
  const [songs, setSongs] = useState<YouTubeSong[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentSong = songs[currentSongIndex]

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Fetching songs for mood:', mood); // Debug log
        const newSongs = await searchSongs({ mood })
        console.log('Fetched songs:', newSongs); // Debug log
        if (newSongs.length > 0) {
          setSongs(newSongs)
          setCurrentSongIndex(0)
        } else {
          setError('No songs found for this mood. Please try again.')
        }
      } catch (err) {
        console.error('Error in fetchSongs:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to load songs. Please check your internet connection and YouTube API key.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongs()
  }, [mood])

  const handleNextSong = async () => {
    if (currentSongIndex === songs.length - 1) {
      try {
        setIsLoading(true)
        const newSongs = await searchSongs({ mood })
        if (newSongs.length > 0) {
          setSongs(newSongs)
          setCurrentSongIndex(0)
        } else {
          setError('No more songs available. Please try again.')
        }
      } catch (err) {
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to load new songs. Please try again.'
        )
      } finally {
        setIsLoading(false)
      }
    } else {
      setCurrentSongIndex(prev => prev + 1)
    }
    setIsPlaying(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading songs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!currentSong) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600 mb-4">No songs available for the current mood.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="music-player bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{currentSong.title}</h3>
        <p className="text-gray-600">{currentSong.artist}</p>
        <p className="text-sm text-gray-500">Current Mood: {mood}</p>
      </div>

      <div className="aspect-video w-full mb-4">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=${isPlaying ? 1 : 0}`}
          title={currentSong.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleNextSong}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Next Song
        </button>
      </div>

      {songs.length > 1 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Up Next:</p>
          <div className="space-y-2">
            {songs.slice(currentSongIndex + 1, currentSongIndex + 3).map((song, index) => (
              <div key={song.videoId} className="flex items-center space-x-2">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 