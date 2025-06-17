'use client'

interface MoodDisplayProps {
  mood: string
  intensity: number
}

const moodEmojis: { [key: string]: string } = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  surprised: '😮',
  fearful: '😨',
  disgusted: '🤢'
}

const moodColors: { [key: string]: string } = {
  happy: 'bg-happy',
  sad: 'bg-sad',
  angry: 'bg-angry',
  neutral: 'bg-neutral',
  surprised: 'bg-purple-400',
  fearful: 'bg-indigo-400',
  disgusted: 'bg-green-400'
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
  const emoji = moodEmojis[mood] || '😐'
  const colorClass = moodColors[mood] || 'bg-neutral'
  const description = moodDescriptions[mood] || 'Reading your mood...'
  const intensityPercentage = Math.round(intensity * 100)

  return (
    <div className="mood-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="text-6xl mr-4 animate-bounce">{emoji}</div>
          <div>
            <h2 className="text-2xl font-semibold capitalize">{mood}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Intensity</span>
          <span className="font-medium">{intensityPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
          <div 
            className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-in-out animate-mood-pulse`}
            style={{ width: `${intensityPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p className="text-center italic">
          {intensityPercentage < 20 && 'Expression is very subtle...'}
          {intensityPercentage >= 20 && intensityPercentage < 50 && 'Expression is moderate'}
          {intensityPercentage >= 50 && intensityPercentage < 80 && 'Expression is quite clear'}
          {intensityPercentage >= 80 && 'Expression is very strong!'}
        </p>
      </div>
    </div>
  )
} 