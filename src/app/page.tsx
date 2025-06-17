'use client'

import { useState, useEffect } from 'react'
import WebcamCapture from '@/components/WebcamCapture'
import MoodDisplay from '@/components/MoodDisplay'
import MusicPlayer from '@/components/MusicPlayer'

export default function Home() {
  const [currentMood, setCurrentMood] = useState<string>('neutral')
  const [moodIntensity, setMoodIntensity] = useState<number>(0.5)

  const handleMoodDetected = (mood: string, intensity: number) => {
    setCurrentMood(mood)
    setMoodIntensity(intensity)
  }

  return (
    <main className="mood-container">
      <h1 className="text-4xl font-bold mb-8 text-center">
        MoodTune
      </h1>
      <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
        Let AI DJ Your Mood
      </p>
      
      <WebcamCapture onMoodDetected={handleMoodDetected} />
      <MoodDisplay mood={currentMood} intensity={moodIntensity} />
      <MusicPlayer mood={currentMood} intensity={moodIntensity} />
    </main>
  )
} 