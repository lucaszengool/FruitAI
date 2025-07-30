'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { Button } from './ui/Button';

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
  nutritionInfo?: {
    calories: string;
    vitamins: string;
    fiber: string;
    minerals: string;
    benefits: string;
  };
  selectionTips?: string;
  seasonInfo?: string;
  commonUses?: string;
  ripeTiming?: string;
  pairings?: string;
  medicinalUses?: string;
}

interface ScanResult {
  screenshot: string;
  items: DetectedItem[];
  timestamp: Date;
  averageFreshness: number;
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
}

interface SimpleScannerProps {
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
  onClose: () => void;
  onComplete: (result: ScanResult) => void;
}

export function SimpleScanner({ sessionType, onClose, onComplete }: SimpleScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Camera ready');
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied or not available');
    }
  };

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas size to a reasonable resolution for API processing
      const maxWidth = 1024;
      const maxHeight = 768;
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      
      let canvasWidth, canvasHeight;
      if (videoAspectRatio > maxWidth / maxHeight) {
        canvasWidth = maxWidth;
        canvasHeight = maxWidth / videoAspectRatio;
      } else {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * videoAspectRatio;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
      
      const screenshot = canvas.toDataURL('image/jpeg', 0.8);
      
      console.log('📸 Image captured:');
      console.log('  - Original video size:', video.videoWidth, 'x', video.videoHeight);
      console.log('  - Canvas size:', canvasWidth, 'x', canvasHeight);
      console.log('  - Screenshot data length:', screenshot.length);
      console.log('  - Data URL prefix:', screenshot.substring(0, 50));
      
      // Validate the image is properly formatted
      if (!screenshot.startsWith('data:image/jpeg;base64,')) {
        throw new Error('Invalid image format generated');
      }
      
      // Check minimum image size to ensure it's not corrupted
      if (screenshot.length < 1000) {
        throw new Error('Image too small, likely corrupted');
      }
      
      console.log('📤 Sending image for analysis...');
      console.log('🔍 Image size:', screenshot.length);
      console.log('📡 API endpoint: /api/analyze-batch');
      console.log('🎯 Session type:', sessionType);
      
      // Create fallback result immediately for better UX
      const fallbackResult = {
        screenshot,
        items: [{
          id: `${Date.now()}-0`,
          item: 'Scanned Item',
          freshness: 75,
          recommendation: 'check' as const,
          details: 'Visual inspection recommended - look for firmness, color, and any visible damage.',
          confidence: 50,
          position: { x: 50, y: 50, width: 15, height: 20 },
          storageRecommendation: 'Store in cool, dry place',
          daysRemaining: 3,
          nutritionInfo: {
            calories: 'Varies by item',
            vitamins: 'Check nutrition labels',
            fiber: 'Good source typically',
            minerals: 'Varies by type',
            benefits: 'Fresh produce provides essential nutrients'
          },
          selectionTips: 'Choose items that feel firm and have good color',
          seasonInfo: 'Check with store for seasonal availability',
          commonUses: 'Follow standard preparation methods',
          ripeTiming: 'Use visual and tactile cues',
          pairings: 'Consult recipe guides',
          medicinalUses: 'Research individual item benefits'
        }],
        timestamp: new Date(),
        averageFreshness: 75,
        sessionType
      };

      // Try OpenAI analysis first (primary method)
      try {
        console.log('🤖 Starting OpenAI analysis with fine-tuned model...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('⏰ OpenAI API call timed out after 45 seconds');
          controller.abort();
        }, 45000);
        
        const requestStart = Date.now();
        const response = await fetch('/api/analyze-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: screenshot }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const requestTime = Date.now() - requestStart;
        console.log(`📊 OpenAI API call completed in ${requestTime}ms`);
        console.log('📈 Response status:', response.status);
        console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          console.log('✅ OpenAI analysis successful!');
          const result = await response.json();
          console.log('🔍 API response keys:', Object.keys(result));
          console.log('📊 Total fruits found:', result.totalFruits || 'undefined');
          console.log('🍎 Analyzed fruits count:', result.analyzedFruits?.length || 'undefined');
          
          const items: DetectedItem[] = result.analyzedFruits?.map((fruit: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            item: fruit.item,
            freshness: fruit.freshness,
            recommendation: fruit.recommendation,
            details: fruit.details,
            confidence: fruit.confidence,
            position: fruit.position || { x: 50, y: 50, width: 15, height: 20 },
            storageRecommendation: fruit.storageRecommendation,
            daysRemaining: fruit.daysRemaining,
            nutritionInfo: fruit.nutritionInfo,
            selectionTips: fruit.selectionTips,
            seasonInfo: fruit.seasonInfo,
            commonUses: fruit.commonUses,
            ripeTiming: fruit.ripeTiming,
            pairings: fruit.pairings,
            medicinalUses: fruit.medicinalUses
          })) || [];

          if (items.length === 0) {
            throw new Error('No fruits detected in analysis');
          }

          const averageFreshness = Math.round(
            items.reduce((sum, item) => sum + item.freshness, 0) / items.length
          );

          console.log('🎉 Analysis complete! Using OpenAI results.');
          onComplete({
            screenshot,
            items,
            timestamp: new Date(),
            averageFreshness,
            sessionType
          });
        } else {
          console.error('❌ OpenAI API failed');
          console.error('📄 Status:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('📝 Error response body:', errorText);
          throw new Error(`OpenAI API failed with status ${response.status}: ${response.statusText}`);
        }
      } catch (apiError) {
        console.error('🚨 OpenAI analysis failed:', apiError);
        console.error('🔍 Error type:', typeof apiError);
        console.error('📝 Error message:', apiError instanceof Error ? apiError.message : String(apiError));
        console.error('📚 Error stack:', apiError instanceof Error ? apiError.stack : 'No stack trace');
        
        let errorMessage = 'Analysis temporarily unavailable. Please try again later.';
        
        if (apiError instanceof Error) {
          if (apiError.name === 'AbortError') {
            console.log('⏰ Request timed out after 45 seconds');
            errorMessage = 'Analysis timed out. Please try again with better lighting or a clearer image.';
          } else if (apiError.message.includes('500')) {
            errorMessage = 'Server error occurred. Please try again in a moment.';
          } else if (apiError.message.includes('400')) {
            errorMessage = 'Image format issue. Please try capturing the image again.';
          } else if (apiError.message.includes('network') || apiError.message.includes('fetch')) {
            errorMessage = 'Network connection issue. Please check your internet and try again.';
          }
        }
        
        // Show error to user instead of fallback
        setError(errorMessage);
        console.log('❌ Showing error to user:', errorMessage);
      }
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <canvas ref={canvasRef} className="hidden" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                isAnalyzing ? 'bg-blue-500 animate-pulse' : 
                cameraReady ? 'bg-green-500' : 'bg-orange-400 animate-pulse'
              }`} />
              <span className="text-white font-medium">
                {isAnalyzing ? 'Analyzing...' : 
                 cameraReady ? 'Ready to scan' : 'Starting camera...'}
              </span>
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

        {/* Center guide */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-48 border-2 border-white/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <p className="text-sm opacity-80">Point camera at produce</p>
            </div>
          </div>
        </div>

        {/* Analysis overlay */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <span className="font-medium">Analyzing freshness...</span>
            </div>
          </motion.div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex justify-center">
            <Button
              onClick={captureAndAnalyze}
              disabled={isAnalyzing || !cameraReady}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm disabled:opacity-50"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 
               cameraReady ? 'Capture & Analyze' : 'Starting camera...'}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute bottom-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg flex items-center gap-3">
            <span>{error}</span>
            <Button
              onClick={() => setError(null)}
              variant="ghost"
              size="sm"
              className="ml-auto text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}