'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Camera, Sparkles, Zap, Target, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/Button';
import { ScanningSession } from './components/ScanningSession';
import { FreshnessDashboard } from './components/FreshnessDashboard';
import { DetailedResultsPage } from './components/DetailedResultsPage';
import { CameraView } from './components/CameraView';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranslation } from './contexts/TranslationContext';
import { useScanLimit } from './hooks/useScanLimit';
import { SignUpPrompt } from './components/SignUpPrompt';
import { UserMenu } from './components/UserMenu';

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

// Auto-playing demo phone component
function PhoneDemoPlayer() {
  const [demoStage, setDemoStage] = useState<'ready' | 'scanning' | 'analyzing' | 'results'>('ready');
  const [currentTime, setCurrentTime] = useState('14:52');

  useEffect(() => {
    const cycle = async () => {
      // Stage 1: Ready state (3 seconds)
      setDemoStage('ready');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Stage 2: Scanning (2 seconds)
      setDemoStage('scanning');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 3: Analyzing (3 seconds)
      setDemoStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Stage 4: Results (4 seconds)
      setDemoStage('results');
      await new Promise(resolve => setTimeout(resolve, 4000));
    };

    // Start initial cycle after 2 seconds
    const initialDelay = setTimeout(() => {
      cycle();
      // Then repeat every 12 seconds
      const interval = setInterval(cycle, 12000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, []);

  // Update time every minute for realism
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto">
      {/* Clean Mobile Phone Interface */}
      <div className="relative w-[350px] h-[650px] bg-gradient-to-b from-gray-200 to-gray-300 rounded-[40px] shadow-2xl p-3 border-4 border-gray-800">
        
        {/* Phone Screen */}
        <div className="w-full h-full bg-black rounded-[35px] overflow-hidden relative">
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-black/20 flex items-center justify-between px-6 text-white text-sm font-medium z-20">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
              <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
              <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
              <div className="w-6 h-3 bg-yellow-400 rounded-sm"></div>
            </div>
          </div>
          
          {/* Main Content Area - Changes based on demo stage */}
          <div className="absolute inset-0 top-10">
            <AnimatePresence mode="wait">
              {demoStage === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=600&fit=crop&crop=center"
                    alt="Fresh Apple" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-24 left-8 right-8 bottom-32">
                    <motion.div 
                      className="absolute -top-2 -left-2 w-12 h-12"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="absolute top-0 left-0 w-8 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-0 left-0 w-2 h-8 bg-white rounded-full"></div>
                    </motion.div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-12 h-12"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    >
                      <div className="absolute top-0 right-0 w-8 h-2 bg-white rounded-full"></div>
                      <div className="absolute top-0 right-0 w-2 h-8 bg-white rounded-full"></div>
                    </motion.div>
                    <motion.div 
                      className="absolute -bottom-2 -left-2 w-12 h-12"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    >
                      <div className="absolute bottom-0 left-0 w-8 h-2 bg-white rounded-full"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-8 bg-white rounded-full"></div>
                    </motion.div>
                    <motion.div 
                      className="absolute -bottom-2 -right-2 w-12 h-12"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      <div className="absolute bottom-0 right-0 w-8 h-2 bg-white rounded-full"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-8 bg-white rounded-full"></div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {demoStage === 'scanning' && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-white flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-800 font-medium">Scanning fruit...</p>
                    <p className="text-gray-600 text-sm mt-1">Detecting items</p>
                  </div>
                </motion.div>
              )}

              {demoStage === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-white flex items-center justify-center"
                >
                  <div className="text-center max-w-xs px-6">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Analyzing with AI</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Detecting color & texture
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Analyzing freshness
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Target className="w-4 h-4" />
                        Calculating score
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}

              {demoStage === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-gray-50 overflow-y-auto"
                >
                  {/* Header with scanned image */}
                  <div className="relative h-32 bg-gradient-to-br from-orange-200 to-orange-400 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=200&fit=crop&crop=center"
                      alt="Scanned Apple" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20" />
                    
                    {/* Header controls */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <div className="w-6 h-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">←</span>
                      </div>
                      <h1 className="text-sm font-semibold text-white">Freshness Analysis</h1>
                      <div className="w-6 h-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">⋯</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative -mt-4 mx-2">
                    <div className="bg-white rounded-t-2xl min-h-full">
                      {/* Header Info */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            1 item
                          </div>
                        </div>

                        <h2 className="text-lg font-bold text-black mb-3">Fresh Apple</h2>

                        {/* Main freshness score */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base font-semibold text-black">92% Fresh</span>
                          </div>
                        </div>

                        {/* Macro nutrients */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-black">0g</div>
                            <div className="text-xs text-gray-500">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-black">23g</div>
                            <div className="text-xs text-gray-500">Carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-black">0g</div>
                            <div className="text-xs text-gray-500">Fats</div>
                          </div>
                        </div>

                        {/* Freshness Score Section */}
                        <div className="p-3 border border-green-200 rounded-lg bg-green-50 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                                <span className="text-pink-600 text-xs">🔥</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-black">Freshness Score</div>
                                <div className="text-xs text-gray-500">Detailed breakdown</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-green-600">92/100</div>
                              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '92%' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Analyzed Items */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-black">Analyzed Items</h3>
                        </div>

                        {/* Item Card */}
                        <div className="p-3 border border-gray-200 rounded-lg bg-white mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg flex items-center justify-center">
                                <span className="text-orange-800 text-xs">🍎</span>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                  1
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-black">Fresh Apple</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>92% fresh</span>
                                  <span>•</span>
                                  <span>7 days left</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs font-medium text-green-600">Buy</div>
                              <div className="text-xs text-gray-400">95% confidence</div>
                            </div>
                          </div>
                        </div>

                        {/* Quality Assessment */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-black mb-2">Quality Assessment</h3>
                          <div className="p-3 border border-gray-200 rounded-lg bg-white">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Color:</span>
                                <span className="ml-1 text-black">Vibrant red</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Texture:</span>
                                <span className="ml-1 text-black">Crisp & firm</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Blemishes:</span>
                                <span className="ml-1 text-black">None visible</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Ripeness:</span>
                                <span className="ml-1 text-black">Perfect</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Storage Tips */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-black mb-2">Storage Tips</h3>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-800">Store in refrigerator crisper drawer for up to 2 weeks. Keep away from other fruits that produce ethylene gas.</p>
                          </div>
                        </div>

                        {/* Nutrition Info */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-black mb-2">Nutrition Highlights</h3>
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="space-y-1 text-xs">
                              <p className="text-purple-800"><strong>Vitamins:</strong> High in Vitamin C, Vitamin A</p>
                              <p className="text-purple-800"><strong>Fiber:</strong> 4.4g per medium apple</p>
                              <p className="text-purple-800"><strong>Minerals:</strong> Potassium, Calcium</p>
                              <p className="text-purple-800"><strong>Benefits:</strong> Heart health, digestive support</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-xs">
                            <span>📷</span>
                            Scan Another
                          </button>
                          <button className="flex-1 py-2 px-3 bg-black text-white rounded-lg text-xs">
                            Back to Main
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Top Controls */}
          <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6 z-30">
            <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white text-xl">×</span>
            </div>
            <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white text-xl">?</span>
            </div>
          </div>
          
          {/* Bottom Control Panel - Only show in ready state */}
          {demoStage === 'ready' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4"
            >
              {/* Mode Selector */}
              <div className="flex justify-center gap-2 mb-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 flex gap-1">
                  <div className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center gap-1">
                    <span>🍎</span>
                    <span>Scan Food</span>
                  </div>
                  <div className="px-3 py-1.5 text-gray-600 rounded-xl text-xs font-medium flex items-center gap-1">
                    <span>🔍</span>
                    <span>Barcode</span>
                  </div>
                </div>
              </div>
              
              {/* Camera Controls */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                
                <motion.div 
                  className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-12 h-12 bg-white rounded-full"></div>
                </motion.div>
                
                <div className="w-12 h-12"></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dynamic Preview Info */}
      <motion.div
        className="absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-sm text-gray-800 p-3 rounded-xl shadow-xl border border-gray-200"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const scanLimit = useScanLimit();
  const [showScanningSession, setShowScanningSession] = useState(false);
  const [sessionType] = useState<'shopping' | 'fridge-check' | 'pantry-check'>('shopping');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [currentResults, setCurrentResults] = useState<FruitAnalysisResult[]>([]);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartScan = () => {
    // Check if user has exceeded scan limit
    if (scanLimit.hasExceededLimit) {
      setShowSignUpPrompt(true);
      return;
    }
    
    setShowCameraView(true);
  };

  const handleCameraCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setShowCameraView(false);
    setIsAnalyzing(true);
    
    // Increment scan count for guests
    const newScanCount = scanLimit.incrementScanCount();
    
    try {
      console.log('Calling API with captured image...');
      
      // Direct API call without timeout limit
      const response = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const batchResult = await response.json();
      console.log('API response received:', batchResult);
      
      // Convert API response to expected format
      const results: FruitAnalysisResult[] = batchResult.analyzedFruits || [];
      
      if (results.length === 0) {
        throw new Error('No fruits detected in the image');
      }
      
      setCurrentResults(results);
      setIsAnalyzing(false);
      setShowDetailedResults(true);
      
      // Save to scan history
      saveScanToHistory(results, capturedImage);
      
      // Show sign-up prompt after 2nd scan for guests
      if (!scanLimit.isSignedIn && newScanCount >= scanLimit.scanLimit) {
        // Delay showing the prompt to allow user to see results first
        setTimeout(() => {
          setShowSignUpPrompt(true);
        }, 3000);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Return to camera view on error
      setShowCameraView(true);
    }
  };


  const handleBackFromResults = () => {
    setShowDetailedResults(false);
    setCurrentResults([]);
    setCapturedImage('');
  };

  const handleScanAnother = () => {
    setShowDetailedResults(false);
    setCurrentResults([]);
    setCapturedImage('');
    
    // Check if user has exceeded scan limit
    if (scanLimit.hasExceededLimit) {
      setShowSignUpPrompt(true);
      return;
    }
    
    setShowCameraView(true);
  };

  const saveScanToHistory = (results: FruitAnalysisResult[], image: string) => {
    try {
      const scanData = {
        id: Date.now().toString(),
        image: image,
        title: results.length === 1 ? results[0].item : `${results.length} items analyzed`,
        freshness: Math.round(results.reduce((sum, r) => sum + r.freshness, 0) / results.length),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itemCount: results.length,
        averageScore: Math.round(results.reduce((sum, r) => sum + r.freshness, 0) / results.length),
        date: new Date().toISOString().split('T')[0],
        results: results
      };

      const existingScans = JSON.parse(localStorage.getItem('fruitai_scan_history') || '[]');
      const updatedScans = [scanData, ...existingScans].slice(0, 50); // Keep last 50 scans
      localStorage.setItem('fruitai_scan_history', JSON.stringify(updatedScans));
      
      console.log('Scan saved to history:', scanData);
    } catch (error) {
      console.error('Error saving scan to history:', error);
    }
  };

  // Show different views based on state
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-3xl font-light text-gray-800 mb-3">{t('analyzingFruit')}</h2>
          <p className="text-gray-600 mb-6 text-lg">{t('aiScanning')}</p>
          <div className="text-sm text-gray-500 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('detectingFruits')}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              {t('analyzingColor')}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              {t('calculatingFreshness')}
            </p>
            <p className="mt-4 font-medium text-gray-700">{t('thisMayTake')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showDetailedResults && currentResults.length > 0) {
    return (
      <>
        <DetailedResultsPage
          results={currentResults}
          onBack={handleBackFromResults}
          onScanAnother={handleScanAnother}
          capturedImage={capturedImage}
        />
      </>
    );
  }

  if (showDashboard) {
    return (
      <>
        <FreshnessDashboard 
          onStartScan={handleStartScan} 
          onBack={() => setShowDashboard(false)}
        />
        <CameraView
          isOpen={showCameraView}
          onClose={() => setShowCameraView(false)}
          onCapture={handleCameraCapture}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-emerald-50 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: '10%', left: '80%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-green-50 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          style={{ bottom: '20%', left: '10%' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Scan className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-light text-gray-800 tracking-wide">{t('appTitle')}</h1>
              <p className="text-gray-600 text-sm">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <UserMenu />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <motion.h2 
                  className="text-6xl lg:text-7xl font-extralight text-gray-800 mb-6 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('aiPoweredAnalysis')}
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-700 mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {t('smartShopping')}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleStartScan}
                      size="lg"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 group"
                    >
                      <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      {t('scanProduce')}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Free to use - no sign up required
                    </p>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowDashboard(true)}
                      variant="outline"
                      size="lg"
                      className="border-gray-300 text-gray-700 hover:text-gray-800 hover:border-gray-400 font-medium text-lg px-8 py-4 rounded-xl backdrop-blur-sm bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                    >
                      {t('viewDashboard')}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="grid grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-light">{t('smartShoppingFeature')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-light">{t('instantCheckFeature')}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-light">{t('fridgeHelperFeature')}</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Auto-Playing Demo Phone */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <PhoneDemoPlayer />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showScanningSession && (
        <ScanningSession
          sessionType={sessionType}
          onClose={() => setShowScanningSession(false)}
        />
      )}

      <CameraView
        isOpen={showCameraView}
        onClose={() => setShowCameraView(false)}
        onCapture={handleCameraCapture}
      />

      <SignUpPrompt
        isOpen={showSignUpPrompt}
        onClose={() => setShowSignUpPrompt(false)}
        remainingScans={scanLimit.remainingScans}
        totalScans={scanLimit.scanLimit}
      />
    </div>
  );
}
