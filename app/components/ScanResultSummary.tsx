'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertTriangle, X, Download, Share2, TrendingUp, Package } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
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
}

interface ScanResult {
  screenshot: string;
  items: DetectedItem[];
  timestamp: Date;
  averageFreshness: number;
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
}

interface ScanResultSummaryProps {
  result: ScanResult;
  onClose: () => void;
  onNewScan: () => void;
}

export function ScanResultSummary({ result, onClose, onNewScan }: ScanResultSummaryProps) {
  const [selectedItem, setSelectedItem] = useState<DetectedItem | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  const t = getTranslations();

  const saveToHistory = () => {
    // Save to localStorage
    const sessionData = {
      type: result.sessionType,
      items: result.items.map(item => ({
        id: item.id,
        item: item.item,
        freshness: item.freshness,
        timestamp: result.timestamp,
        location: result.sessionType === 'shopping' ? 'store' : 
                 result.sessionType === 'fridge-check' ? 'fridge' : 'pantry'
      })),
      timestamp: result.timestamp,
      screenshot: result.screenshot
    };
    
    localStorage.setItem(`session-${Date.now()}`, JSON.stringify(sessionData));
  };

  const handleComplete = () => {
    saveToHistory();
    onClose();
  };

  const downloadScreenshot = () => {
    const link = document.createElement('a');
    link.download = `scan-${result.timestamp.toISOString().split('T')[0]}.jpg`;
    link.href = result.screenshot;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FruitAI Scan Results`,
          text: `Scanned ${result.items.length} items with ${result.averageFreshness}% average freshness`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const getFreshnessColor = (freshness: number) => {
    if (freshness >= 80) return 'text-green-600 bg-green-100';
    if (freshness >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'buy': return <Check className="w-4 h-4 text-green-600" />;
      case 'check': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'avoid': return <X className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'buy': return t.buyRecommended;
      case 'check': return t.checkCarefully;
      case 'avoid': return t.avoidItem;
      default: return recommendation;
    }
  };

  const categoryStats = {
    buy: result.items.filter(item => item.recommendation === 'buy').length,
    check: result.items.filter(item => item.recommendation === 'check').length,
    avoid: result.items.filter(item => item.recommendation === 'avoid').length,
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{t.sessionSummary}</h1>
              <p className="text-gray-600 text-sm">
                {formatTranslation(t.foundItems, { count: result.items.length.toString() })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadScreenshot} variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={shareResults} variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">{t.itemsScanned}</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{result.items.length}</div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">{t.averageFreshness}</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{result.averageFreshness}%</div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Buy</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{categoryStats.buy}</div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Avoid</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{categoryStats.avoid}</div>
          </motion.div>
        </div>

        {/* Annotated Screenshot */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Scan Results</h2>
            <Button
              onClick={() => setShowAnnotations(!showAnnotations)}
              variant="ghost"
              size="sm"
            >
              {showAnnotations ? 'Hide' : 'Show'} Annotations
            </Button>
          </div>
          
          <div className="relative inline-block max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.screenshot}
              alt="Scan result"
              className="w-full max-h-96 object-contain rounded-lg shadow-md"
            />
            
            {/* Item annotations */}
            {showAnnotations && result.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * result.items.indexOf(item) }}
                className="absolute cursor-pointer"
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  transform: 'translate(-50%, -100%)'
                }}
                onClick={() => setSelectedItem(item)}
              >
                <div className={`px-3 py-2 rounded-lg shadow-lg border-2 ${getFreshnessColor(item.freshness)} ${
                  selectedItem?.id === item.id ? 'border-blue-500 scale-110' : 'border-white'
                } transition-all duration-200`}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {getRecommendationIcon(item.recommendation)}
                    <span>{item.item}</span>
                    <span className="font-bold">{item.freshness}%</span>
                  </div>
                </div>
                
                {/* Connection line */}
                <div className="absolute top-full left-1/2 w-0.5 h-4 bg-gray-400 transform -translate-x-1/2" />
                <div className="absolute top-full left-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1" />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Item Details List */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Detailed Results</h2>
          <div className="space-y-3">
            {result.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedItem?.id === item.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{item.item}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getFreshnessColor(item.freshness)}`}>
                        {item.freshness}% {t.freshness}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        item.recommendation === 'buy' ? 'bg-green-100 text-green-700' :
                        item.recommendation === 'check' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {getRecommendationIcon(item.recommendation)}
                        {getRecommendationText(item.recommendation)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{item.details}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{t.confidence}: {item.confidence}%</span>
                      {item.daysRemaining && (
                        <span>{t.shelfLife}: {item.daysRemaining} {t.days}</span>
                      )}
                    </div>
                    
                    {item.storageRecommendation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <span className="font-medium">{t.storageAdvice}:</span> {item.storageRecommendation}
                      </div>
                    )}
                    
                    {item.nutritionInfo && (
                      <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                        <h4 className="font-medium mb-2">{t.nutrition}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div><span className="font-medium">{t.calories}:</span> {item.nutritionInfo.calories}</div>
                          <div><span className="font-medium">{t.vitamins}:</span> {item.nutritionInfo.vitamins}</div>
                          <div><span className="font-medium">{t.fiber}:</span> {item.nutritionInfo.fiber}</div>
                          <div><span className="font-medium">{t.minerals}:</span> {item.nutritionInfo.minerals}</div>
                        </div>
                        {item.nutritionInfo.benefits && (
                          <p className="mt-2"><span className="font-medium">{t.healthBenefits}:</span> {item.nutritionInfo.benefits}</p>
                        )}
                      </div>
                    )}
                    
                    {item.selectionTips && (
                      <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                        <span className="font-medium">{t.selectionTips}:</span> {item.selectionTips}
                      </div>
                    )}
                    
                    {(item.seasonInfo || item.commonUses) && (
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {item.seasonInfo && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{t.seasonality}:</span> {item.seasonInfo}
                          </div>
                        )}
                        {item.commonUses && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{t.commonUses}:</span> {item.commonUses}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handleComplete} className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            {t.completeSession}
          </Button>
          <Button onClick={onNewScan} variant="secondary" className="flex-1">
            New Scan
          </Button>
        </div>
      </div>
    </div>
  );
}