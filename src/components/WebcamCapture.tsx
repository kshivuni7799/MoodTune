'use client'

import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import dynamic from 'next/dynamic'

interface WebcamCaptureProps {
  onMoodDetected: (mood: string, intensity: number) => void
}

export default function WebcamCapture({ onMoodDetected }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [error, setError] = useState<string | null>(null)
  const [faceapi, setFaceapi] = useState<any>(null)

  useEffect(() => {
    const loadFaceAPI = async () => {
      try {
        setLoadingMessage('Loading face-api...')
        const faceapiModule = await import('@tensorflow/tfjs')
        const faceapiImport = await import('@vladmandic/face-api')
        setFaceapi(faceapiImport)
        
        setLoadingMessage('Loading face detection models...')
        const MODEL_URL = '/models'
        
        await Promise.all([
          faceapiImport.nets.tinyFaceDetector.load(MODEL_URL),
          faceapiImport.nets.faceExpressionNet.load(MODEL_URL)
        ])

        setLoadingMessage('All models loaded successfully!')
        setIsModelLoaded(true)
        setError(null)
      } catch (error) {
        console.error('Error loading models:', error)
        setError(error instanceof Error ? error.message : 'Failed to load face detection models')
        setLoadingMessage('Error loading models')
      }
    }

    loadFaceAPI()
  }, [])

  useEffect(() => {
    if (!isModelLoaded || !faceapi) return

    let isDetecting = true
    let frameId: number | null = null

    const detectMood = async () => {
      if (!webcamRef.current?.video || !isDetecting) return

      const video = webcamRef.current.video

      try {
        if (video.readyState === 4) {
          const detection = await faceapi
            .detectSingleFace(
              video,
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 224,
                scoreThreshold: 0.5
              })
            )
            .withFaceExpressions()

          if (detection) {
            const expressions = detection.expressions
            let maxMood = 'neutral'
            let maxIntensity = 0

            Object.entries(expressions).forEach(([mood, intensity]) => {
              const numericIntensity = Number(intensity)
              if (!isNaN(numericIntensity) && numericIntensity > maxIntensity && numericIntensity > 0.2) {
                maxMood = mood
                maxIntensity = numericIntensity
              }
            })

            onMoodDetected(maxMood, maxIntensity)
          }
        }
      } catch (error) {
        console.error('Detection error:', error)
      }

      if (isDetecting) {
        frameId = requestAnimationFrame(detectMood)
      }
    }

    frameId = requestAnimationFrame(detectMood)

    return () => {
      isDetecting = false
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [isModelLoaded, onMoodDetected, faceapi])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
    frameRate: { ideal: 30 }
  }

  return (
    <div className="webcam-container">
      <Webcam
        ref={webcamRef}
        audio={false}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full h-full rounded-lg"
        mirrored={true}
      />
      {(!isModelLoaded || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          <div className="text-center p-4">
            {!error && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            )}
            <p className="text-lg">{error || loadingMessage}</p>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 