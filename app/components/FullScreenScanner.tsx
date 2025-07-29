'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Zap, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { getTranslations, formatTranslation } from '../lib/i18n';

interface DetectedItem {
  id: string;
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  storageRecommendation?: string;
  daysRemaining?: number;
}

interface ScanResult {
  screenshot: string;
  items: DetectedItem[];
  timestamp: Date;
  averageFreshness: number;
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
}

interface FullScreenScannerProps {
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
  onClose: () => void;
  onComplete: (result: ScanResult) => void;
}

export function FullScreenScanner({ sessionType, onClose, onComplete }: FullScreenScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStable, setIsStable] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef<ImageData | null>(null);
  const stabilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const t = getTranslations();

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);
        }
      } catch (err) {
        setError('Camera access denied or not available');
        console.error('Camera error:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Motion detection
  const detectMotion = useCallback(() => {
    if (!videoRef.current || !motionCanvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = motionCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0) return;

    canvas.width = video.videoWidth / 4; // Reduce resolution for performance
    canvas.height = video.videoHeight / 4;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    if (lastFrameRef.current) {
      let diff = 0;
      const pixelCount = currentFrame.data.length / 4;
      
      for (let i = 0; i < currentFrame.data.length; i += 4) {
        const rDiff = Math.abs(currentFrame.data[i] - lastFrameRef.current.data[i]);
        const gDiff = Math.abs(currentFrame.data[i + 1] - lastFrameRef.current.data[i + 1]);
        const bDiff = Math.abs(currentFrame.data[i + 2] - lastFrameRef.current.data[i + 2]);
        diff += (rDiff + gDiff + bDiff) / 3;
      }
      
      const avgDiff = diff / pixelCount;
      setMotionLevel(avgDiff);
      
      // Consider stable if motion is below threshold
      const isCurrentlyStable = avgDiff < 10; // Threshold can be adjusted
      
      if (isCurrentlyStable && !isStable) {
        // Start stability timer
        stabilityTimerRef.current = setTimeout(() => {
          setIsStable(true);
          startAutoCapture();
        }, 1000); // Wait 1 second of stability
      } else if (!isCurrentlyStable && isStable) {
        setIsStable(false);
        setAutoCapturing(false);
        setCountdown(0);
        if (stabilityTimerRef.current) {
          clearTimeout(stabilityTimerRef.current);
        }
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
      }
    }
    
    lastFrameRef.current = currentFrame;
  }, [isScanning, isStable]);

  // Motion detection loop
  useEffect(() => {
    if (!isScanning || isAnalyzing) return;
    
    const interval = setInterval(detectMotion, 100);
    return () => clearInterval(interval);
  }, [detectMotion, isScanning, isAnalyzing]);

  // Auto capture countdown
  const startAutoCapture = () => {
    setAutoCapturing(true);
    setCountdown(3);
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          captureAndAnalyze();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Capture and analyze
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    setAutoCapturing(false);
    setCountdown(0);
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const screenshot = canvas.toDataURL('image/jpeg', 0.9);
      
      // Analyze with backend
      const response = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: screenshot }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      
      // Process results
      const items: DetectedItem[] = result.analyzedFruits.map((fruit: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        item: fruit.item,
        freshness: fruit.freshness,
        recommendation: fruit.recommendation,
        details: fruit.details,
        confidence: fruit.confidence,
        position: fruit.position || {
          x: 20 + (index % 3) * 30,
          y: 20 + Math.floor(index / 3) * 25,
          width: 15,
          height: 20
        },
        storageRecommendation: fruit.storageRecommendation,
        daysRemaining: fruit.daysRemaining
      }));

      const averageFreshness = Math.round(
        items.reduce((sum, item) => sum + item.freshness, 0) / items.length
      );

      const scanResult: ScanResult = {
        screenshot,
        items,
        timestamp: new Date(),
        averageFreshness,
        sessionType
      };

      onComplete(scanResult);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const getStabilityColor = () => {
    if (isAnalyzing) return 'bg-blue-500';
    if (autoCapturing) return 'bg-green-500';
    if (isStable) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (isAnalyzing) return t.analyzing;
    if (autoCapturing) return formatTranslation(t.autoCapturing, { seconds: countdown.toString() });
    if (isStable) return t.detectingItems;
    return t.stabilizeCamera;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Hidden canvases for processing */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={motionCanvasRef} className="hidden" />

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pointer-events-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStabilityColor()} animate-pulse`} />
                <span className="text-white font-medium">{getStatusText()}</span>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Center guidance */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-48 border-2 border-white/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-60" />
                <p className="text-sm opacity-80">
                  {isStable ? t.detectingItems : t.stabilizeCamera}
                </p>
              </div>
            </div>
          </div>

          {/* Auto-capture countdown */}
          <AnimatePresence>
            {autoCapturing && countdown > 0 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-lg">
                  {countdown}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis overlay */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <div className="bg-white rounded-lg p-6 flex items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  <span className="font-medium">{t.analyzing}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pointer-events-auto">
            <div className="flex justify-center items-center gap-4">
              {/* Motion indicator */}
              <div className="flex items-center gap-2 text-white text-sm">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-6 rounded-full ${
                        motionLevel > i * 5 ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="opacity-80">Motion</span>
              </div>

              {/* Manual capture button */}
              <Button
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                {t.tapToCapture}
              </Button>
            </div>
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <Button
                onClick={() => setError(null)}
                variant="ghost"
                size="sm"
                className="ml-auto text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}