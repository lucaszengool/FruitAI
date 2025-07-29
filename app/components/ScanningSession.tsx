'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, X, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ScannedItem {
  id: string;
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  storageRecommendation?: string;
  daysRemaining?: number;
  timestamp: Date;
  location: 'store' | 'fridge' | 'pantry';
}

interface ScanningSessionProps {
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
  onClose: () => void;
}

export function ScanningSession({ sessionType, onClose }: ScanningSessionProps) {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sessionTitles = {
    'shopping': '🛒 Store Shopping Session',
    'fridge-check': '🥶 Refrigerator Check',
    'pantry-check': '🏠 Pantry Inventory'
  };

  const sessionDescriptions = {
    'shopping': 'Scan multiple items to compare freshness and get buying recommendations',
    'fridge-check': 'Check what needs to be used soon and what to replenish',
    'pantry-check': 'Monitor your stored produce and plan your shopping list'
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setSelectedImage(imageData);
    analyzeImage(imageData);
  };

  const analyzeImage = async (imageData: string) => {
    setIsScanning(true);
    
    try {
      const response = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      
      // Process results and add to scanned items
      const newItems: ScannedItem[] = result.analyzedFruits.map((fruit: { item: string; freshness: number; recommendation: 'buy' | 'avoid' | 'check'; details: string; confidence: number; position?: any; storageRecommendation?: string; daysRemaining?: number; }) => ({
        id: `${Date.now()}-${Math.random()}`,
        item: fruit.item,
        freshness: fruit.freshness,
        recommendation: fruit.recommendation,
        details: fruit.details,
        confidence: fruit.confidence,
        position: fruit.position,
        storageRecommendation: fruit.storageRecommendation,
        daysRemaining: fruit.daysRemaining,
        timestamp: new Date(),
        location: sessionType === 'shopping' ? 'store' : sessionType === 'fridge-check' ? 'fridge' : 'pantry'
      }));

      setScannedItems(prev => [...prev, ...newItems]);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsScanning(false);
      setSelectedImage(null);
    }
  };

  const getRecommendations = () => {
    const buyItems = scannedItems.filter(item => item.recommendation === 'buy');
    const checkItems = scannedItems.filter(item => item.recommendation === 'check');

    if (sessionType === 'shopping') {
      return {
        primary: `Found ${buyItems.length} fresh items perfect for purchase`,
        secondary: checkItems.length > 0 ? `${checkItems.length} items need closer inspection` : null,
        action: 'Continue scanning or review your selections'
      };
    } else if (sessionType === 'fridge-check') {
      const useNow = scannedItems.filter(item => item.daysRemaining && item.daysRemaining <= 2);
      const replenish = scannedItems.filter(item => item.freshness < 50);
      return {
        primary: useNow.length > 0 ? `${useNow.length} items should be used within 2 days` : 'All items are fresh',
        secondary: replenish.length > 0 ? `Consider replacing ${replenish.length} items` : null,
        action: 'Add these items to your shopping list'
      };
    } else {
      const expired = scannedItems.filter(item => item.freshness < 30);
      return {
        primary: expired.length > 0 ? `${expired.length} items need immediate attention` : 'Pantry items are in good condition',
        secondary: `Total ${scannedItems.length} items scanned`,
        action: 'Update your inventory list'
      };
    }
  };

  const recommendations = getRecommendations();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">{sessionTitles[sessionType]}</h2>
            <p className="text-gray-600">{sessionDescriptions[sessionType]}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 h-[calc(90vh-120px)]">
          {/* Camera/Upload Section */}
          <div className="relative bg-black overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay with scanned items */}
            {showOverlay && selectedImage && (
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedImage} 
                  alt="Captured" 
                  className="w-full h-full object-cover opacity-50"
                />
                {scannedItems.slice(-5).map((item) => (
                  item.position && (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute bg-white/90 rounded-lg p-2 shadow-lg"
                      style={{
                        left: `${item.position.x}%`,
                        top: `${item.position.y}%`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          item.freshness >= 80 ? 'bg-green-500' :
                          item.freshness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="font-semibold text-sm">{item.item}</span>
                        <span className="text-xs font-bold">{item.freshness}%</span>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              <Button
                onClick={captureFrame}
                disabled={isScanning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isScanning ? 'Analyzing...' : 'Capture & Scan'}
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
              >
                Upload Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setShowOverlay(!showOverlay)}
                variant="secondary"
                size="sm"
              >
                {showOverlay ? 'Hide' : 'Show'} Overlay
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="overflow-y-auto p-6 bg-gray-50">
            {/* Summary */}
            <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Session Summary</h3>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {scannedItems.length} items scanned
                  </span>
                </div>
              </div>
              <p className="text-gray-700 font-medium">{recommendations.primary}</p>
              {recommendations.secondary && (
                <p className="text-gray-600 text-sm mt-1">{recommendations.secondary}</p>
              )}
              <p className="text-blue-600 text-sm mt-2">{recommendations.action}</p>
            </Card>

            {/* Scanned Items List */}
            <div className="space-y-3">
              <AnimatePresence>
                {scannedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-lg">{item.item}</h4>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.recommendation === 'buy' ? 'bg-green-100 text-green-700' :
                              item.recommendation === 'check' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {item.recommendation.toUpperCase()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    item.freshness >= 80 ? 'bg-green-500' :
                                    item.freshness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.freshness}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold">{item.freshness}%</span>
                            </div>
                            {item.daysRemaining && (
                              <span className="text-sm text-gray-600">
                                {item.daysRemaining} days left
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setScannedItems(prev => prev.filter(i => i.id !== item.id))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={() => {
                // Save session to history
                localStorage.setItem(`session-${Date.now()}`, JSON.stringify({
                  type: sessionType,
                  items: scannedItems,
                  timestamp: new Date()
                }));
                onClose();
              }}>
                <Check className="w-4 h-4 mr-2" />
                Complete Session
              </Button>
              <Button variant="secondary" onClick={() => setScannedItems([])}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}