'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Dynamically import components with no SSR
const WebcamCapture = dynamic(() => import('@/components/WebcamCapture'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-white/10 backdrop-blur-sm rounded-2xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
    </div>
  ),
})

const MoodDisplay = dynamic(() => import('@/components/MoodDisplay'), {
  ssr: false,
})

const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), {
  ssr: false,
})

function AppContent() {
  const [isMounted, setIsMounted] = useState(false)
  const [appStarted, setAppStarted] = useState(false)
  const [currentMood, setCurrentMood] = useState<string>('neutral')
  const [moodIntensity, setMoodIntensity] = useState<number>(0.5)
  const [shouldSkipSong, setShouldSkipSong] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleMoodDetected = (mood: string, intensity: number) => {
    if (isMounted) {
      setCurrentMood(mood)
      setMoodIntensity(intensity)
    }
  }

  const handleHighFive = () => {
    if (isMounted) {
      setShouldSkipSong(true)
      setTimeout(() => {
        if (isMounted) {
          setShouldSkipSong(false)
        }
      }, 10000)
    }
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!appStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome to MoodTune
          </h1>
          <p className="text-2xl text-blue-200 font-light mb-8">
            Click Start to allow audio and begin the experience.
          </p>
          <button
            onClick={() => setAppStarted(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-transform transform hover:scale-105"
          >
            Start
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            MoodTune
          </h1>
          <p className="text-xl text-blue-200 font-light">
            Let AI DJ Your Emotions
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Webcam and Mood */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Mood Detection</h2>
              <ErrorBoundary>
                <WebcamCapture 
                  onMoodDetected={handleMoodDetected} 
                  onHighFiveDetected={handleHighFive}
                />
              </ErrorBoundary>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Current Mood</h2>
              <ErrorBoundary>
                <MoodDisplay mood={currentMood} intensity={moodIntensity} />
              </ErrorBoundary>
            </div>
          </div>

          {/* Right Column - Music Player */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Music Player</h2>
            <ErrorBoundary>
              <MusicPlayer 
                mood={currentMood} 
                intensity={moodIntensity}
                shouldSkipSong={shouldSkipSong}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-blue-200/60 text-sm">
          <p>Show a high-five gesture to skip songs ✋</p>
        </footer>
      </div>
    </main>
  )
}

export default AppContent 