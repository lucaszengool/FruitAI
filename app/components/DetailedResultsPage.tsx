'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Share, 
  MoreHorizontal,
  Bookmark,
  Edit3,
  Flame,
  Apple,
  Droplets,
  Leaf,
  Clock,
  Plus,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTranslation } from '../contexts/TranslationContext';
import { translateAnalysisValue } from '../lib/translations';
import { CheckCircle, XCircle, ShoppingCart, Package2, Calendar, Heart, Shield, DollarSign } from 'lucide-react';

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
  nutritionInfo?: {
    calories: string;
    vitamins: string;
    fiber: string;
    minerals: string;
    benefits: string;
    netCarbs?: string;
    sugar?: string;
    sodium?: string;
  };
}

interface DetailedResultsPageProps {
  results: FruitAnalysisResult[];
  onBack: () => void;
  onScanAnother: () => void;
  capturedImage?: string;
}

export function DetailedResultsPage({ 
  results, 
  onBack,
  onScanAnother,
  capturedImage 
}: DetailedResultsPageProps) {
  const { t, language } = useTranslation();
  const [selectedFruit, setSelectedFruit] = useState<FruitAnalysisResult>(results[0]);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy': return 'text-green-600';
      case 'check': return 'text-yellow-600';
      case 'avoid': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getFreshnessColor = (freshness: number) => {
    if (freshness >= 80) return 'text-green-600';
    if (freshness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Nutrition metrics for the selected fruit
  const nutritionMetrics = [
    {
      icon: Droplets,
      label: t('fiber'),
      value: selectedFruit.nutritionInfo?.fiber?.replace(/[^0-9.]/g, '') || '0',
      status: selectedFruit.nutritionInfo?.fiber?.includes('0') ? 'poor' : 'good',
      color: selectedFruit.nutritionInfo?.fiber?.includes('0') ? 'text-red-500' : 'text-green-500'
    },
    {
      icon: Apple,
      label: t('netCarbs'), 
      value: selectedFruit.nutritionInfo?.netCarbs?.replace(/[^0-9.]/g, '') || '25',
      status: 'good',
      color: 'text-green-500'
    },
    {
      icon: Leaf,
      label: t('sugar'),
      value: selectedFruit.nutritionInfo?.sugar?.replace(/[^0-9.]/g, '') || '24', 
      status: 'good',
      color: 'text-green-500'
    },
    {
      icon: Flame,
      label: t('sodium'),
      value: selectedFruit.nutritionInfo?.sodium?.replace(/[^0-9.]/g, '') || '10',
      status: 'good', 
      color: 'text-green-500'
    }
  ];

  const getFreshnessLevel = (score: number) => {
    if (score >= 80) return { level: t('veryGood'), color: 'text-green-600', description: t('highNutrients') };
    if (score >= 60) return { level: t('good'), color: 'text-yellow-600', description: t('decentQuality') };
    return { level: t('needsAttention'), color: 'text-red-600', description: t('qualityDeclining') };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'poor': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50';
      case 'poor': return 'bg-red-50';
      default: return 'bg-yellow-50';
    }
  };

  const processedScore = Math.min(10, Math.max(0, Math.round((100 - selectedFruit.freshness) / 10)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with background image */}
      <div className="relative h-64 bg-gradient-to-br from-orange-200 to-orange-400 overflow-hidden">
        {capturedImage && (
          <>
            <img 
              src={capturedImage} 
              alt="Captured produce"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Position indicators for each fruit */}
            {results.map((fruit, index) => {
              if (!fruit.position) return null;
              return (
                <div
                  key={index}
                  className="absolute flex items-center justify-center w-8 h-8 bg-white bg-opacity-90 rounded-full border-2 border-green-500 font-bold text-green-700 text-sm shadow-lg"
                  style={{
                    left: `${fruit.position.x}%`,
                    top: `${fruit.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {index + 1}
                </div>
              );
            })}
          </>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        {/* Header controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <h1 className="text-lg font-semibold text-white">{t('freshnessAnalysis')}</h1>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Share className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-8 mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-3xl min-h-screen"
        >
          {/* Header Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-sm"
              >
                <span>{results.length}</span>
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>

            <h2 className="text-2xl font-bold text-black mb-4">
              {results.length === 1 ? translateAnalysisValue(language, selectedFruit.item) : `${results.length} ${t('itemsAnalyzed')}`}
            </h2>

            {/* Freshness Score Section - Now Directly Displayed */}
            <Card className="p-6 border border-green-200 bg-gradient-to-br from-green-50 to-white">
              {/* Score Circle */}
              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      className="text-green-500"
                      strokeDasharray={`${(selectedFruit.freshness / 100) * 282.6} 282.6`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black">
                        {selectedFruit.freshness}/100
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${getFreshnessLevel(selectedFruit.freshness).color}`}>
                  {getFreshnessLevel(selectedFruit.freshness).level}
                </h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  {getFreshnessLevel(selectedFruit.freshness).description}
                </p>
              </div>

              {/* Nutrition Metrics */}
              <div className="space-y-3">
                {nutritionMetrics.map((metric, index) => (
                  <div key={metric.label} className={`p-3 rounded-lg ${getStatusColor(metric.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        <span className="font-medium text-gray-800">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{metric.value}{metric.label === t('sodium') ? 'mg' : 'g'}</span>
                        {getStatusIcon(metric.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Processing Score */}
              <div className="mt-4">
                <Card className="p-4 border-0 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">{t('processed')}</span>
                    </div>
                    <span className="font-semibold text-green-600">{processedScore}/10</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t('minimalAdditives')}
                  </p>
                </Card>
              </div>
            </Card>
          </div>

          {/* Individual Fruits List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">{t('analyzedItems')}</h3>
              <button className="flex items-center gap-1 text-green-600 text-sm">
                <Plus className="w-4 h-4" />
                <span>{t('addMore')}</span>
              </button>
            </div>

            <div className="space-y-3">
              {results.map((fruit, index) => (
                <motion.div
                  key={index}  
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all ${
                      selectedFruit === fruit ? 'ring-2 ring-green-500 border-green-200' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedFruit(fruit)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg flex items-center justify-center">
                          <Apple className="w-6 h-6 text-orange-800" />
                          {/* Number indicator */}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-black">{translateAnalysisValue(language, fruit.item)}</h4>
                            {fruit.daysRemaining && fruit.daysRemaining < 3 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{fruit.freshness}% {t('fresh')}</span>
                            {fruit.daysRemaining && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{fruit.daysRemaining} {t('daysLeft')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getRecommendationColor(fruit.recommendation)}`}>
                          {t(fruit.recommendation)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {fruit.confidence}% {t('confidenceLevel')}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Storage Recommendations */}
            {selectedFruit.storageRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3">{t('storageTips')}</h3>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-800">{translateAnalysisValue(language, selectedFruit.storageRecommendation || '')}</p>
                </Card>
              </motion.div>
            )}

            {/* Quality Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h3 className="text-lg font-semibold text-black mb-3">{t('qualityAssessment')}</h3>
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">{t('color')}:</span>
                    <span className="ml-2 text-black">{translateAnalysisValue(language, selectedFruit.characteristics.color)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('texture')}:</span>
                    <span className="ml-2 text-black">{translateAnalysisValue(language, selectedFruit.characteristics.texture)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('blemishes')}:</span>
                    <span className="ml-2 text-black">{translateAnalysisValue(language, selectedFruit.characteristics.blemishes)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('ripeness')}:</span>
                    <span className="ml-2 text-black">{translateAnalysisValue(language, selectedFruit.characteristics.ripeness)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Shopping Decision Helper */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t('shoppingDecision')}
              </h3>
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('recommendation')}:</span>
                    <span className={`font-semibold ${getRecommendationColor(selectedFruit.recommendation)}`}>
                      {t(selectedFruit.recommendation).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('priceValue')}:</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{selectedFruit.freshness >= 80 ? t('goodValue') : t('considerPrice')}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-700">
                      {selectedFruit.freshness >= 80 
                        ? t('perfectForPurchase')
                        : selectedFruit.freshness >= 60 
                        ? t('inspectBeforeBuying')
                        : t('notRecommendedToBuy')
                      }
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Refrigerator Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                <Package2 className="w-5 h-5" />
                {t('fridgeManagement')}
              </h3>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">{t('estimatedShelfLife')}:</span>
                    </div>
                    <span className="font-semibold text-purple-700">
                      {selectedFruit.daysRemaining || Math.round(selectedFruit.freshness / 20)} {t('daysLeft')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('consumeBy')}:</span>
                    <span className="font-medium">
                      {new Date(Date.now() + (selectedFruit.daysRemaining || Math.round(selectedFruit.freshness / 20)) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedFruit.daysRemaining && selectedFruit.daysRemaining <= 3 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-yellow-800">{t('consumeSoon')}</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Health Benefits */}
            {selectedFruit.nutritionInfo?.benefits && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  {t('healthBenefits')}
                </h3>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-white">
                  <p className="text-sm text-gray-700">
                    {translateAnalysisValue(language, selectedFruit.nutritionInfo.benefits)}
                  </p>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={onScanAnother}
            >
              <Camera className="w-4 h-4" />
              {t('scanAnother')}
            </Button>
            <Button 
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              onClick={onBack}
            >
              {t('backToMain')}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}