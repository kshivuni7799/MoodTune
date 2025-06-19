'use client'

import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'

interface WebcamCaptureProps {
  onMoodDetected: (mood: string, intensity: number) => void
  onHighFiveDetected?: () => void
}

interface ExpressionData {
  mood: string
  intensity: number
  timestamp: number
}

export default function WebcamCapture({ onMoodDetected, onHighFiveDetected }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [error, setError] = useState<string | null>(null)
  const [faceapi, setFaceapi] = useState<any>(null)
  const expressionsRef = useRef<ExpressionData[]>([])
  const analysisTimeRef = useRef<number>(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const ANALYSIS_WINDOW = 10000 // 10 seconds in milliseconds
  const lastHighFiveTime = useRef<number>(0)
  const HIGH_FIVE_COOLDOWN = 2000 // 2 seconds cooldown between high-five detections
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isInitialAnalysis, setIsInitialAnalysis] = useState(true)
  const [waitingForHighFive, setWaitingForHighFive] = useState(false)
  const hasSentMoodRef = useRef(false)

  // Update timer display
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isModelLoaded && isAnalyzing && isInitialAnalysis) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - analysisTimeRef.current) / 1000);
        
        if (elapsed >= 10) { // Changed from 60 to 10 seconds
          // First 10-second analysis is complete
          const dominantMood = getDominantMood();
          if (dominantMood) {
            onMoodDetected(dominantMood.mood, dominantMood.intensity);
            setDebugInfo(`Analysis complete! Playing songs for mood: ${dominantMood.mood}`);
            setIsInitialAnalysis(false);
            setWaitingForHighFive(true);
            setIsAnalyzing(false);
            expressionsRef.current = []; // Clear expressions after analysis
          }
          setElapsedTime(0);
        } else {
          setElapsedTime(elapsed);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isModelLoaded, isAnalyzing, isInitialAnalysis, onMoodDetected]);

  useEffect(() => {
    const loadFaceAPI = async () => {
      try {
        setLoadingMessage('Loading TensorFlow...')
        await tf.ready();
        setLoadingMessage('Loading face-api...')
        const faceapiImport = await import('@vladmandic/face-api')
        setFaceapi(faceapiImport)
        
        setLoadingMessage('Loading face detection models...')
        const MODEL_URL = '/models'
        
        setDebugInfo('Loading models from: ' + MODEL_URL)
        
        try {
          // Load models in sequence to ensure dependencies are met
          setDebugInfo(prev => prev + '\nLoading TinyFaceDetector model...')
          await faceapiImport.nets.tinyFaceDetector.load(MODEL_URL)
          
          setDebugInfo(prev => prev + '\nLoading FaceLandmark68 model...')
          await faceapiImport.nets.faceLandmark68Net.load(MODEL_URL)
          
          setDebugInfo(prev => prev + '\nLoading FaceExpression model...')
          await faceapiImport.nets.faceExpressionNet.load(MODEL_URL)
          
          setDebugInfo(prev => prev + '\nAll models loaded successfully')
        } catch (modelError: any) {
          console.error('Error loading models:', modelError)
          setDebugInfo(prev => prev + '\nError loading models: ' + (modelError?.message || 'Unknown error'))
          throw new Error('Failed to load face detection models: ' + (modelError?.message || 'Unknown error'))
        }

        setLoadingMessage('All models loaded successfully!')
        setIsModelLoaded(true)
        setError(null)
        analysisTimeRef.current = Date.now()
        setIsAnalyzing(true)
      } catch (error: any) {
        console.error('Error in loadFaceAPI:', error)
        setError(error instanceof Error ? error.message : 'Failed to load face detection models')
        setLoadingMessage('Error loading models')
      }
    }

    loadFaceAPI()
  }, [])

  const getDominantMood = () => {
    if (expressionsRef.current.length === 0) {
      return { mood: 'neutral', intensity: 0.5 };
    }

    // Group expressions by mood and find the maximum intensity for each mood
    const moodIntensities = expressionsRef.current.reduce((acc, curr) => {
      if (!acc[curr.mood] || curr.intensity > acc[curr.mood]) {
        acc[curr.mood] = curr.intensity;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Count occurrences of each mood
    const moodCounts = expressionsRef.current.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Find the mood with highest occurrence and its maximum intensity
    let maxCount = 0;
    let dominantMood = 'neutral';
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });

    return {
      mood: dominantMood,
      intensity: moodIntensities[dominantMood] || 0.5
    };
  };

  const handleHighFive = async () => {
    if (!onHighFiveDetected) return;
    
    onHighFiveDetected();
    setDebugInfo('High-five detected! Starting new mood analysis...');
    
    // Reset for new analysis
    expressionsRef.current = [];
    analysisTimeRef.current = Date.now();
    setIsInitialAnalysis(true);
    setWaitingForHighFive(false);
    setIsAnalyzing(true);
  };

  const detectHighFive = async (detection: any) => {
    if (!waitingForHighFive) return;
    
    const currentTime = Date.now();
    if (currentTime - lastHighFiveTime.current < HIGH_FIVE_COOLDOWN) return;

    try {
      const landmarks = detection.landmarks;
      const nose = landmarks.getNose()[0];
      const leftEye = landmarks.getLeftEye()[0];
      const rightEye = landmarks.getRightEye()[0];
      
      // Calculate the average eye height as reference
      const eyeHeight = (leftEye.y + rightEye.y) / 2;
      
      // Check if any hand landmarks are significantly above the eyes
      const allPoints = landmarks.positions;
      const handsUp = allPoints.some((point: { x: number; y: number }) => 
        point.y < eyeHeight - (nose.y - eyeHeight) // Point is higher than eyes
      );

      if (handsUp) {
        lastHighFiveTime.current = currentTime;
        handleHighFive();
      }
    } catch (error) {
      console.error('Error detecting high-five:', error);
    }
  };

  useEffect(() => {
    if (!isModelLoaded || !faceapi) return;

    let isDetecting = true;
    let frameId: number | null = null;
    let lastDetectionTime = Date.now();
    const DETECTION_INTERVAL = 200; // Detect every 200ms

    const detectMood = async () => {
      if (!webcamRef.current?.video || !isDetecting) return;

      const video = webcamRef.current.video;
      const currentTime = Date.now();

      if (currentTime - lastDetectionTime >= DETECTION_INTERVAL) {
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
              .withFaceLandmarks()
              .withFaceExpressions();

            if (detection) {
              // Always check for high-five gesture if waiting for it
              if (waitingForHighFive) {
                await detectHighFive(detection);
                setDebugInfo('Waiting for high-five gesture to change song...');
              }

              // Only analyze expressions during initial analysis
              if (isAnalyzing && isInitialAnalysis) {
                const expressions = detection.expressions;
                let maxMood = 'neutral';
                let maxIntensity = 0;

                Object.entries(expressions).forEach(([mood, intensity]) => {
                  const numericIntensity = Number(intensity);
                  if (!isNaN(numericIntensity) && numericIntensity > maxIntensity) {
                    maxMood = mood;
                    maxIntensity = numericIntensity;
                  }
                });

                // Store the expression data
                expressionsRef.current.push({
                  mood: maxMood,
                  intensity: maxIntensity,
                  timestamp: currentTime
                });

                // Update debug info
                setDebugInfo(`Analyzing mood: ${maxMood} (${Math.round(maxIntensity * 100)}%)`);
              }
            }
          }
        } catch (error: any) {
          console.error('Detection error:', error);
          setDebugInfo(`Detection error: ${error?.message || 'Unknown error'}`);
        }
        lastDetectionTime = currentTime;
      }

      frameId = requestAnimationFrame(detectMood);
    };

    frameId = requestAnimationFrame(detectMood);

    return () => {
      isDetecting = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isModelLoaded, isAnalyzing, waitingForHighFive, isInitialAnalysis, onMoodDetected, onHighFiveDetected, faceapi]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
    frameRate: { ideal: 30 }
  };

  return (
    <div className="webcam-container relative">
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
      {isModelLoaded && isAnalyzing && isInitialAnalysis && (
        <div className="absolute top-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
          Initial Analysis: {elapsedTime}s / 10s
        </div>
      )}
      {isModelLoaded && waitingForHighFive && (
        <div className="absolute top-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
          Show high-five to change song ✋
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
        {debugInfo}
      </div>
    </div>
  );
} 