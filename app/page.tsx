'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scan, Refrigerator, Store, History } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { ScanningSession } from './components/ScanningSession';
import { UserHistory } from './components/UserHistory';
import { ShoppingList } from './components/ShoppingList';
import { UserRewards } from './components/UserRewards';
import { getTranslations } from './lib/i18n';

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
  
  const t = getTranslations();


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
                variant="primary"
                size="lg"
                onClick={() => {
                  setSessionType('shopping');
                  setShowScanningSession(true);
                }}
                className="flex items-center gap-2"
              >
                <Store className="w-5 h-5" />
                <span className="font-semibold">{t.storeSession}</span>
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setSessionType('fridge-check');
                  setShowScanningSession(true);
                }}
                className="flex items-center gap-2"
              >
                <Refrigerator className="w-5 h-5" />
                <span className="font-semibold">{t.fridgeCheck}</span>
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setSessionType('pantry-check');
                  setShowScanningSession(true);
                }}
                className="flex items-center gap-2"
              >
                <Scan className="w-5 h-5" />
                <span className="font-semibold">{t.pantryCheck}</span>
              </Button>
              <Button
                variant={showHistory ? 'primary' : 'ghost'}
                size="lg"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2"
              >
                <History className="w-5 h-5" />
                <span className="font-semibold">{t.dashboard}</span>
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
          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
            <Card className="p-4 text-center">
              <Store className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-2">{t.storeSession}</h3>
              <p className="text-sm text-gray-600">
                {t.storeSessionDesc}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <Refrigerator className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-2">{t.fridgeCheck}</h3>
              <p className="text-sm text-gray-600">
                {t.fridgeCheckDesc}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <Scan className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-2">{t.pantryCheck}</h3>
              <p className="text-sm text-gray-600">
                {t.pantryCheckDesc}
              </p>
            </Card>
          </div>
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
                onClick={() => {
                  setSessionType('shopping');
                  setShowScanningSession(true);
                }}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4"
              >
                🛒 Start Shopping Session
              </Button>
              <Button
                onClick={() => {
                  setSessionType('fridge-check');
                  setShowScanningSession(true);
                }}
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                🥶 Check My Fridge
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
    </div>
  );
}