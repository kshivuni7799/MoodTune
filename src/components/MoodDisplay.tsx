'use client'

import { useEffect, useState } from 'react'

interface MoodDisplayProps {
  mood: string
  intensity: number
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  neutral: '😐',
  surprised: '😲'
}

const moodColors: Record<string, string> = {
  happy: 'from-yellow-400 to-orange-400',
  sad: 'from-blue-400 to-indigo-400',
  angry: 'from-red-400 to-pink-400',
  fearful: 'from-purple-400 to-indigo-400',
  neutral: 'from-gray-400 to-blue-400',
  surprised: 'from-pink-400 to-purple-400'
}

const moodDescriptions: { [key: string]: string } = {
  happy: 'You seem to be in a great mood! 🌟',
  sad: 'You look a bit down. Let\'s lift your spirits! 💙',
  angry: 'You appear frustrated. Let\'s channel that energy! 💪',
  neutral: 'You seem calm and balanced. 🌱',
  surprised: 'Something caught you off guard! ✨',
  fearful: 'You look a bit anxious. Let\'s help you relax! 🍃',
  disgusted: 'Something bothering you? Let\'s change that! 🌈'
}

export default function MoodDisplay({ mood, intensity }: MoodDisplayProps) {
  const emoji = moodEmojis[mood.toLowerCase()] || '😐'
  const colorGradient = moodColors[mood.toLowerCase()] || 'from-gray-400 to-blue-400'
  const intensityPercentage = Math.round(intensity * 100)

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Emoji Display */}
      <div className={`text-7xl animate-bounce-slow p-6 rounded-full bg-gradient-to-r ${colorGradient} shadow-lg`}>
        {emoji}
      </div>

      {/* Mood Text */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold capitalize mb-2">
          {mood}
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="text-sm text-blue-200">Intensity:</div>
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colorGradient} transition-all duration-500`}
              style={{ width: `${intensityPercentage}%` }}
            />
          </div>
          <div className="text-sm text-blue-200">{intensityPercentage}%</div>
        </div>
      </div>
    </div>
  )
} 