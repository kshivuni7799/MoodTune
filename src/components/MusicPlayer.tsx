'use client'

import { useState, useEffect } from 'react'

interface MusicPlayerProps {
  mood: string
  intensity: number
}

interface Song {
  title: string
  artist: string
  embedUrl: string
}

// Mock data - In a real app, this would come from Spotify/YouTube API
const moodSongs: { [key: string]: Song[] } = {
  happy: [
    {
      title: "Don't Stop Believin'",
      artist: 'Journey',
      embedUrl: 'https://www.youtube.com/embed/1k8craCGpgs'
    },
    {
      title: 'Happy',
      artist: 'Pharrell Williams',
      embedUrl: 'https://www.youtube.com/embed/ZbZSe6N_BXs'
    }
  ],
  sad: [
    {
      title: 'Someone Like You',
      artist: 'Adele',
      embedUrl: 'https://www.youtube.com/embed/hLQl3WQQoQ0'
    },
    {
      title: 'Say Something',
      artist: 'A Great Big World',
      embedUrl: 'https://www.youtube.com/embed/-2U0Ivkn2Ds'
    }
  ],
  angry: [
    {
      title: 'In The End',
      artist: 'Linkin Park',
      embedUrl: 'https://www.youtube.com/embed/eVTXPUF4Oz4'
    },
    {
      title: 'Break Stuff',
      artist: 'Limp Bizkit',
      embedUrl: 'https://www.youtube.com/embed/ZpUYjpKg9KY'
    }
  ],
  neutral: [
    {
      title: 'Weightless',
      artist: 'Marconi Union',
      embedUrl: 'https://www.youtube.com/embed/UfcAVejslrU'
    },
    {
      title: 'Clair de Lune',
      artist: 'Debussy',
      embedUrl: 'https://www.youtube.com/embed/CvFH_6DNRCY'
    }
  ]
}

export default function MusicPlayer({ mood, intensity }: MusicPlayerProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  useEffect(() => {
    const songs = moodSongs[mood] || moodSongs.neutral
    const songIndex = Math.floor(Math.random() * songs.length)
    setCurrentSong(songs[songIndex])
  }, [mood])

  if (!currentSong) {
    return (
      <div className="music-player">
        <p className="text-center text-gray-500">Loading music suggestion...</p>
      </div>
    )
  }

  return (
    <div className="music-player">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-1">{currentSong.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{currentSong.artist}</p>
      </div>
      
      <div className="relative pt-[56.25%]">
        <iframe
          src={currentSong.embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <button
        onClick={() => {
          const songs = moodSongs[mood] || moodSongs.neutral
          const currentIndex = songs.findIndex(s => s.title === currentSong.title)
          const nextIndex = (currentIndex + 1) % songs.length
          setCurrentSong(songs[nextIndex])
        }}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Next Song
      </button>
    </div>
  )
} 