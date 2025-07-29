'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RefreshCw, X, ShoppingCart, Scan, Grid, Eye } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';

// Single fruit analysis result
interface AnalysisResult {
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  characteristics: {
    color: string;
    texture: string;
    blemishes: string;
    ripeness: string;
  };
  timestamp: string;
  analysisId: string;
}

// Multi-fruit batch analysis result
interface FruitAnalysisResult {
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  characteristics: {
    color: string;
    texture: string;
    blemishes: string;
    ripeness: string;
  };
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  storageRecommendation?: string;
  daysRemaining?: number;
}

interface BatchAnalysisResult {
  totalFruits: number;
  analyzedFruits: FruitAnalysisResult[];
  bestFruit?: FruitAnalysisResult;
  worstFruit?: FruitAnalysisResult;
  averageFreshness: number;
  shoppingRecommendation: string;
  analysisId: string;
  timestamp: string;
  ranking?: FruitAnalysisResult[];
  categories?: {
    buyNow: FruitAnalysisResult[];
    checkFirst: FruitAnalysisResult[];
    avoidThese: FruitAnalysisResult[];
  };
  storageAdvice?: Array<{
    item: string;
    advice: string;
  }>;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [batchAnalysis, setBatchAnalysis] = useState<BatchAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'single' | 'batch' | 'live'>('single');
  const [isLiveMode, setIsLiveMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 10MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.onerror = () => {
        setError('Failed to load image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setBatchAnalysis(null);

    try {
      console.log(`Starting ${analysisMode} analysis...`);
      
      const endpoint = analysisMode === 'batch' ? '/api/analyze-batch' : '/api/analyze';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      console.log('Analysis complete:', result);
      
      if (analysisMode === 'batch') {
        setBatchAnalysis(result);
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startLiveScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsLiveMode(true);
        setAnalysisMode('live');
      }
    } catch (err) {
      setError('Camera access denied or not available');
    }
  };

  const stopLiveScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsLiveMode(false);
  };

  const captureAndAnalyze = useCallback(() => {
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
    
    // Auto-analyze in batch mode for live scanning
    setBatchAnalysis(null);
    setAnalysis(null);
    analyzeImage();
  }, []);

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setBatchAnalysis(null);
    setError(null);
    stopLiveScanning();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            🛒 FruitAI
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            Smart Grocery Shopping Assistant
          </p>
          <p className="text-lg text-gray-600">
            Scan, compare, and choose the freshest produce with AI precision
          </p>
        </motion.div>

        {/* Mode Selector */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-100">
            <div className="flex gap-2">
              <Button
                variant={analysisMode === 'single' ? 'primary' : 'ghost'}
                size="lg"
                onClick={() => {
                  setAnalysisMode('single');
                  resetAnalysis();
                }}
                className="flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                <span className="font-semibold">Single Item</span>
              </Button>
              <Button
                variant={analysisMode === 'batch' ? 'primary' : 'ghost'}
                size="lg"
                onClick={() => {
                  setAnalysisMode('batch');
                  resetAnalysis();
                }}
                className="flex items-center gap-2"
              >
                <Grid className="w-5 h-5" />
                <span className="font-semibold">Shopping Cart</span>
              </Button>
              <Button
                variant={analysisMode === 'live' ? 'primary' : 'ghost'}
                size="lg"
                onClick={() => {
                  if (isLiveMode) {
                    stopLiveScanning();
                  } else {
                    startLiveScanning();
                  }
                }}
                className="flex items-center gap-2"
              >
                <Scan className="w-5 h-5" />
                <span className="font-semibold">Live Scan</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mode Descriptions */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="max-w-2xl mx-auto">
            {analysisMode === 'single' && (
              <p className="text-gray-600">
                📍 Perfect for analyzing individual fruits or vegetables in detail
              </p>
            )}
            {analysisMode === 'batch' && (
              <p className="text-gray-600">
                🛒 Ideal for comparing multiple items and making smart shopping decisions
              </p>
            )}
            {analysisMode === 'live' && (
              <p className="text-gray-600">
                📱 Real-time scanning for instant freshness feedback while shopping
              </p>
            )}
          </div>
        </motion.div>

        {/* Live Camera Mode */}
        {isLiveMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold">📱 Live Scanning Mode</h2>
                <p className="text-gray-600">Point your camera at fruits/vegetables for instant analysis</p>
              </div>
              
              <div className="relative max-w-2xl mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg shadow-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-3">
                    <Button
                      onClick={captureAndAnalyze}
                      disabled={isAnalyzing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAnalyzing ? 'Analyzing...' : '📸 Capture & Analyze'}
                    </Button>
                    <Button
                      onClick={stopLiveScanning}
                      variant="secondary"
                    >
                      ❌ Stop
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Upload Section */}
        {!isLiveMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8">
              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-semibold mb-3">
                    {analysisMode === 'single' ? '📸 Upload Single Item' : '🛒 Upload Shopping Cart Photo'}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {analysisMode === 'single' 
                      ? 'Take a clear photo of one fruit or vegetable for detailed analysis'
                      : 'Capture multiple fruits/vegetables to compare freshness and get shopping advice'
                    }
                  </p>
                </div>
                
                {!selectedImage ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                      {analysisMode === 'single' ? (
                        <Camera className="w-16 h-16 text-white" />
                      ) : (
                        <ShoppingCart className="w-16 h-16 text-white" />
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
                      >
                        <Upload className="w-6 h-6 mr-3" />
                        Choose Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden max-w-2xl mx-auto">
                      <img
                        src={selectedImage}
                        alt="Selected produce"
                        className="w-full h-auto object-cover"
                      />
                      <button
                        onClick={resetAnalysis}
                        className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                      >
                        {isAnalyzing 
                          ? '🔍 Analyzing...' 
                          : analysisMode === 'single' 
                            ? '🔍 Analyze Freshness' 
                            : '🛒 Analyze Shopping Cart'
                        }
                      </Button>
                      
                      <Button
                        onClick={resetAnalysis}
                        variant="secondary"
                        size="lg"
                        className="px-6 py-4"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
                  >
                    <p className="text-red-700 font-medium">{error}</p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Single Fruit Results */}
        <AnimatePresence>
          {analysis && analysisMode === 'single' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center">🍎 Freshness Analysis</h2>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Freshness Score */}
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke={analysis.freshness >= 80 ? '#22c55e' : analysis.freshness >= 60 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysis.freshness / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">{analysis.freshness}%</span>
                      </div>
                    </div>
                    
                    <div
                      className={`inline-flex px-6 py-3 rounded-full text-lg font-semibold ${
                        analysis.recommendation === 'buy'
                          ? 'bg-green-100 text-green-800'
                          : analysis.recommendation === 'check'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {analysis.recommendation === 'buy'
                        ? '✅ Recommended to Buy'
                        : analysis.recommendation === 'check'
                        ? '⚠️ Check Before Buying'
                        : '❌ Avoid This Item'}
                    </div>
                    
                    <p className="mt-4 text-gray-600">
                      Confidence: {analysis.confidence}%
                    </p>
                  </div>

                  {/* Item Details */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{analysis.item}</h3>
                    <p className="text-gray-700 mb-6 text-lg">{analysis.details}</p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-lg">Characteristics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">Color:</span>
                          <p className="font-medium">{analysis.characteristics.color}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Texture:</span>
                          <p className="font-medium">{analysis.characteristics.texture}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Blemishes:</span>
                          <p className="font-medium">{analysis.characteristics.blemishes}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Ripeness:</span>
                          <p className="font-medium">{analysis.characteristics.ripeness}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batch Analysis Results */}
        <AnimatePresence>
          {batchAnalysis && (analysisMode === 'batch' || analysisMode === 'live') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Summary Card */}
              <Card className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-center">🛒 Shopping Cart Analysis</h2>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <motion.div 
                    className="text-center p-6 bg-blue-50 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-blue-600 mb-2">{batchAnalysis.totalFruits}</div>
                    <div className="text-gray-600 font-medium">Items Found</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-green-50 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl font-bold text-green-600 mb-2">{batchAnalysis.averageFreshness}%</div>
                    <div className="text-gray-600 font-medium">Avg Freshness</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-green-100 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-lg font-bold text-green-800 mb-2">
                      {batchAnalysis.bestFruit?.item || 'N/A'}
                    </div>
                    <div className="text-gray-600 font-medium">Freshest</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-red-100 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-lg font-bold text-red-800 mb-2">
                      {batchAnalysis.worstFruit?.item || 'N/A'}
                    </div>
                    <div className="text-gray-600 font-medium">Least Fresh</div>
                  </motion.div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">🛍️ Shopping Recommendation</h4>
                  <p className="text-gray-700 text-lg">{batchAnalysis.shoppingRecommendation}</p>
                </div>
              </Card>

              {/* Shopping Categories */}
              {batchAnalysis.categories && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Buy These */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="p-6 border-l-4 border-green-500">
                      <h3 className="text-xl font-semibold text-green-800 mb-4">
                        ✅ Perfect to Buy ({batchAnalysis.categories.buyNow.length})
                      </h3>
                      <div className="space-y-3">
                        {batchAnalysis.categories.buyNow.map((fruit, index) => (
                          <motion.div 
                            key={index} 
                            className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <span className="font-medium text-gray-900">{fruit.item}</span>
                            <span className="text-lg font-bold text-green-600">{fruit.freshness}%</span>
                          </motion.div>
                        ))}
                        {batchAnalysis.categories.buyNow.length === 0 && (
                          <p className="text-gray-500 italic text-center py-4">No items recommended for purchase</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Check These */}
                  <motion.div
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="p-6 border-l-4 border-yellow-500">
                      <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                        ⚠️ Inspect Carefully ({batchAnalysis.categories.checkFirst.length})
                      </h3>
                      <div className="space-y-3">
                        {batchAnalysis.categories.checkFirst.map((fruit, index) => (
                          <motion.div 
                            key={index} 
                            className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <span className="font-medium text-gray-900">{fruit.item}</span>
                            <span className="text-lg font-bold text-yellow-600">{fruit.freshness}%</span>
                          </motion.div>
                        ))}
                        {batchAnalysis.categories.checkFirst.length === 0 && (
                          <p className="text-gray-500 italic text-center py-4">No items need careful inspection</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Avoid These */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="p-6 border-l-4 border-red-500">
                      <h3 className="text-xl font-semibold text-red-800 mb-4">
                        ❌ Skip These ({batchAnalysis.categories.avoidThese.length})
                      </h3>
                      <div className="space-y-3">
                        {batchAnalysis.categories.avoidThese.map((fruit, index) => (
                          <motion.div 
                            key={index} 
                            className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <span className="font-medium text-gray-900">{fruit.item}</span>
                            <span className="text-lg font-bold text-red-600">{fruit.freshness}%</span>
                          </motion.div>
                        ))}
                        {batchAnalysis.categories.avoidThese.length === 0 && (
                          <p className="text-gray-500 italic text-center py-4">Great! No items to avoid 🎉</p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </div>
              )}

              {/* Detailed Analysis */}
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-6">📊 Detailed Item Analysis</h3>
                <div className="space-y-6">
                  {batchAnalysis.analyzedFruits.map((fruit, index) => (
                    <motion.div 
                      key={index} 
                      className="border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900">{fruit.item}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="w-32 bg-gray-200 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  fruit.freshness >= 80
                                    ? 'bg-green-500'
                                    : fruit.freshness >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${fruit.freshness}%` }}
                              />
                            </div>
                            <span className="text-lg font-bold">{fruit.freshness}%</span>
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            fruit.recommendation === 'buy'
                              ? 'bg-green-100 text-green-800'
                              : fruit.recommendation === 'check'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {fruit.recommendation.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-700 mb-3">{fruit.details}</p>
                          {fruit.daysRemaining && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Est. shelf life:</span> {fruit.daysRemaining} days
                            </p>
                          )}
                        </div>
                        {fruit.storageRecommendation && (
                          <div>
                            <p className="font-medium text-gray-900 mb-2">💡 Storage Tip:</p>
                            <p className="text-sm text-gray-700">{fruit.storageRecommendation}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        {!analysis && !batchAnalysis && !isLiveMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to make smarter shopping decisions?
            </h3>
            <p className="text-gray-600 mb-8">
              Upload your produce photos and let AI guide your choices
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4"
            >
              🚀 Start Analyzing
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}