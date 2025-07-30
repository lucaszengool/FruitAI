'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { ScanningSession } from './components/ScanningSession';
import { UserHistory } from './components/UserHistory';
import { ShoppingList } from './components/ShoppingList';
import { UserRewards } from './components/UserRewards';
import { FreshnessDashboard } from './components/FreshnessDashboard';
import { DetailedResultsPage } from './components/DetailedResultsPage';
import { FreshnessScoreModal } from './components/FreshnessScoreModal';
import { CameraView } from './components/CameraView';
// Removed useTranslation to fix hydration issues


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
  const [showScanningSession, setShowScanningSession] = useState(false);
  const [sessionType, setSessionType] = useState<'shopping' | 'fridge-check' | 'pantry-check'>('shopping');
  const [showHistory, setShowHistory] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [showFreshnessModal, setShowFreshnessModal] = useState(false);
  const [showCameraView, setShowCameraView] = useState(false);
  const [currentResults, setCurrentResults] = useState<FruitAnalysisResult[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<FruitAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Static translations to avoid hydration issues
  const t = {
    appTitle: 'FruitAI',
    appSubtitle: 'AI-Powered Freshness Scanner',
    storeSession: 'Store Session',
    fridgeCheck: 'Fridge Check', 
    pantryCheck: 'Pantry Scan',
    dashboard: 'Dashboard',
    storeSessionDesc: 'Scan multiple items while shopping to compare freshness and make the best choices',
    fridgeCheckDesc: 'Monitor what needs to be used soon and track freshness of stored produce',
    pantryCheckDesc: 'Keep track of stored items and get alerts when they need attention'
  };

  const handleStartScan = () => {
    setShowCameraView(true);
  };

  const handleCameraCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setShowCameraView(false);
    setIsAnalyzing(true);
    
    try {
      console.log('Calling API with captured image...');
      
      const response = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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


  // Show different views based on state
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyzing your fruit...</h2>
          <p className="text-gray-600">AI is scanning for freshness and quality</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            🛒 {t.appTitle}
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            {t.appSubtitle}
          </p>
          <p className="text-lg text-gray-600">
            Smart shopping decisions and waste reduction through AI scanning
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleStartScan}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4"
          >
            📱 Quick Scan
          </Button>
          <Button
            onClick={() => setShowDashboard(true)}
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-4"
          >
            📊 View Dashboard
          </Button>
        </motion.div>

        {/* App Description */}
        <motion.div 
          className="text-center mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="text-center">
              <Scan className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">AI-Powered Freshness Analysis</h3>
              <p className="text-gray-600">
                Use your camera to instantly analyze fruit freshness, get quality scores, 
                and receive personalized recommendations for optimal selection and storage.
              </p>
            </div>
          </Card>
        </motion.div>


        {/* User Dashboard */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-8"
          >
            {/* Rewards and Achievements */}
            <UserRewards />
            
            {/* History and Shopping List */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UserHistory />
              </div>
              <div>
                <ShoppingList />
              </div>
            </div>
          </motion.div>
        )}



        {/* Call to Action */}
        {!showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to reduce food waste and make smarter choices?
            </h3>
            <p className="text-gray-600 mb-8">
              Start a scanning session to analyze freshness and get personalized recommendations
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartScan}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4"
              >
                📱 Quick Scan
              </Button>
              <Button
                onClick={() => setShowDashboard(true)}
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                📊 View Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Scanning Session Modal */}
      {showScanningSession && (
        <ScanningSession
          sessionType={sessionType}
          onClose={() => setShowScanningSession(false)}
        />
      )}

      {/* Camera View */}
      <CameraView
        isOpen={showCameraView}
        onClose={() => setShowCameraView(false)}
        onCapture={handleCameraCapture}
      />

      {/* Freshness Score Modal */}
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