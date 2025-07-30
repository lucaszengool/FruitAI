'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Camera, Sparkles, Zap, Target, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/Button';
import { ScanningSession } from './components/ScanningSession';
import { FreshnessDashboard } from './components/FreshnessDashboard';
import { DetailedResultsPage } from './components/DetailedResultsPage';
import { FreshnessScoreModal } from './components/FreshnessScoreModal';
import { CameraView } from './components/CameraView';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranslation } from './contexts/TranslationContext';

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
  const { t } = useTranslation();
  const [showScanningSession, setShowScanningSession] = useState(false);
  const [sessionType] = useState<'shopping' | 'fridge-check' | 'pantry-check'>('shopping');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [showFreshnessModal, setShowFreshnessModal] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  const [currentResults, setCurrentResults] = useState<FruitAnalysisResult[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<FruitAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartScan = () => {
    setShowCameraView(true);
  };

  const handleCameraCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setShowCameraView(false);
    setIsAnalyzing(true);
    
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
      
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Return to camera view on error
      setShowCameraView(true);
    }
  };

  const handleFreshnessScoreClick = (fruit: FruitAnalysisResult) => {
    setSelectedFruit(fruit);
    setShowFreshnessModal(true);
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
          onFreshnessScoreClick={handleFreshnessScoreClick}
          onScanAnother={handleScanAnother}
          capturedImage={capturedImage}
        />
        {selectedFruit && (
          <FreshnessScoreModal
            isOpen={showFreshnessModal}
            onClose={() => setShowFreshnessModal(false)}
            fruit={selectedFruit}
          />
        )}
      </>
    );
  }

  if (showDashboard) {
    return (
      <>
        <FreshnessDashboard onStartScan={handleStartScan} />
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
              <p className="text-gray-600 text-sm">Smart Shopping Assistant</p>
            </div>
          </div>
          <LanguageSelector />
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
                  Smart
                  <span className="block text-emerald-600 font-light">
                    Grocery
                  </span>
                  <span className="block">
                    Shopping
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-700 mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Never buy spoiled groceries again! Scan fruits and vegetables while shopping to 
                  <span className="text-emerald-600 font-medium"> instantly check freshness</span> and get smart 
                  recommendations. Perfect for checking what's in your refrigerator too.
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
                      Scan Produce
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowDashboard(true)}
                      variant="outline"
                      size="lg"
                      className="border-gray-300 text-gray-700 hover:text-gray-800 hover:border-gray-400 font-medium text-lg px-8 py-4 rounded-xl backdrop-blur-sm bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                    >
                      View Dashboard
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
                    <p className="text-gray-600 text-sm font-light">Smart Shopping</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-light">Instant Check</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-light">Fridge Helper</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Mobile-Style Camera Interface */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative mx-auto">
                  {/* Mobile Camera Interface - Much Larger */}
                  <div className="relative w-[350px] h-[650px] bg-gradient-to-b from-gray-200 to-gray-300 rounded-[40px] shadow-2xl p-3 border-4 border-gray-800">
                    
                    {/* Phone Screen */}
                    <div className="w-full h-full bg-gray-400 rounded-[35px] overflow-hidden relative">
                      
                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-10 bg-black/20 flex items-center justify-between px-6 text-white text-sm font-medium z-20">
                        <span>14:52</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                          <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                          <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                          <div className="w-6 h-3 bg-yellow-400 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* Camera View */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 rounded-[35px] overflow-hidden">
                        
                        {/* Top Controls */}
                        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6 z-30">
                          <motion.div 
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-white text-xl">×</span>
                          </motion.div>
                          <motion.div 
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-white text-xl">?</span>
                          </motion.div>
                        </div>
                        
                        {/* Main Scanning Area with Corner Brackets */}
                        <div className="absolute top-32 left-8 right-8 bottom-40">
                          {/* Corner Brackets - Larger and more prominent */}
                          <div className="absolute -top-2 -left-2 w-12 h-12">
                            <div className="absolute top-0 left-0 w-8 h-2 bg-white rounded-full"></div>
                            <div className="absolute top-0 left-0 w-2 h-8 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute -top-2 -right-2 w-12 h-12">
                            <div className="absolute top-0 right-0 w-8 h-2 bg-white rounded-full"></div>
                            <div className="absolute top-0 right-0 w-2 h-8 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute -bottom-2 -left-2 w-12 h-12">
                            <div className="absolute bottom-0 left-0 w-8 h-2 bg-white rounded-full"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-8 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-12 h-12">
                            <div className="absolute bottom-0 right-0 w-8 h-2 bg-white rounded-full"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-8 bg-white rounded-full"></div>
                          </div>
                        </div>

                        {/* Real Fruit Images Being Scanned - Larger and more realistic */}
                        <motion.div 
                          className="absolute top-40 left-12 w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white/30"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <img 
                            src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop&crop=center"
                            alt="Fresh Apple" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="absolute top-48 right-16 w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white/30"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, -3, 3, 0]
                          }}
                          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        >
                          <img 
                            src="https://images.unsplash.com/photo-1557800636-894a64c1696f?w=200&h=200&fit=crop&crop=center"
                            alt="Fresh Orange" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        <motion.div 
                          className="absolute bottom-32 left-16 w-22 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white/30"
                          animate={{ 
                            scale: [1, 1.08, 1],
                            rotate: [0, 4, -4, 0]
                          }}
                          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                        >
                          <img 
                            src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=150&fit=crop&crop=center"
                            alt="Fresh Banana" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        {/* Additional fruits */}
                        <motion.div 
                          className="absolute top-56 left-20 w-18 h-18 rounded-xl overflow-hidden shadow-lg border-2 border-white/30"
                          animate={{ 
                            scale: [1, 1.06, 1],
                            rotate: [0, -2, 2, 0]
                          }}
                          transition={{ duration: 3.8, repeat: Infinity, delay: 0.8 }}
                        >
                          <img 
                            src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop&crop=center"
                            alt="Fresh Strawberry" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="absolute bottom-40 right-12 w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white/30"
                          animate={{ 
                            scale: [1, 1.04, 1],
                            rotate: [0, 3, -3, 0]
                          }}
                          transition={{ duration: 4.2, repeat: Infinity, delay: 1.2 }}
                        >
                          <img 
                            src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200&h=200&fit=crop&crop=center"
                            alt="Fresh Grapes" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        {/* Subtle Scanning Animation */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent"
                          animate={{
                            y: ["-100%", "100%"]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Bottom Control Panel */}
                        <div className="absolute bottom-4 left-4 right-4">
                          {/* Mode Selector - Similar to reference */}
                          <div className="flex justify-center gap-2 mb-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 flex gap-1">
                              <motion.div 
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span>🍎</span>
                                <span>Scan Food</span>
                              </motion.div>
                              <motion.div 
                                className="px-4 py-2 text-gray-600 rounded-xl text-sm font-medium flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span>🔍</span>
                                <span>Barcode</span>
                              </motion.div>
                              <motion.div 
                                className="px-4 py-2 text-gray-600 rounded-xl text-sm font-medium flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span>🏷️</span>
                                <span>Food label</span>
                              </motion.div>
                              <motion.div 
                                className="px-4 py-2 text-gray-600 rounded-xl text-sm font-medium flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span>📱</span>
                                <span>Library</span>
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Camera Controls */}
                          <div className="flex items-center justify-between">
                            <motion.div 
                              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className="text-white text-xl">⚡</span>
                            </motion.div>
                            
                            <motion.div 
                              className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <div className="w-12 h-12 bg-white rounded-full"></div>
                            </motion.div>
                            
                            <div className="w-12 h-12"></div>
                          </div>
                        </div>

                        {/* Smart Analysis Notifications */}
                        <motion.div
                          className="absolute top-16 left-6 bg-emerald-500/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          ✓ 94% Fresh - Buy Now!
                        </motion.div>
                        
                        <motion.div
                          className="absolute top-20 right-6 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                        >
                          Perfect for smoothies
                        </motion.div>

                        <motion.div
                          className="absolute bottom-24 left-6 bg-amber-500/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
                        >
                          Store in fridge
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Phone Shadow and Reflection */}
                  <div className="absolute -bottom-8 left-4 right-4 h-8 bg-gradient-to-r from-transparent via-black/20 to-transparent blur-xl"></div>
                  
                  {/* Floating Info Cards */}
                  <motion.div
                    className="absolute -top-6 -right-8 bg-white/95 backdrop-blur-sm text-gray-800 p-3 rounded-xl shadow-xl border border-gray-200 max-w-40"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div>
                        <p className="text-xs font-medium">AI Scanner Active</p>
                        <p className="text-xs text-gray-600">5 fruits detected</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-6 -left-8 bg-white/95 backdrop-blur-sm text-gray-800 p-3 rounded-xl shadow-xl border border-gray-200 max-w-44"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <div>
                        <p className="text-xs font-medium">Smart Shopping</p>
                        <p className="text-xs text-gray-600">Grocery helper ready</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
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

      {selectedFruit && (
        <FreshnessScoreModal
          isOpen={showFreshnessModal}
          onClose={() => setShowFreshnessModal(false)}
          fruit={selectedFruit}
        />
      )}
    </div>
  );
}
