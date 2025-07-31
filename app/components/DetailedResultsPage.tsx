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

  // Check if this is an unknown produce case
  const isUnknownProduce = selectedFruit.item === 'Unknown Produce' || selectedFruit.freshness === 0;

  return (
    <div className={`min-h-screen ${isUnknownProduce ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Header with background image or white background for unknown produce */}
      <div className={`relative h-64 overflow-hidden ${
        isUnknownProduce 
          ? 'bg-white' 
          : 'bg-gradient-to-br from-orange-200 to-orange-400'
      }`}>
        {isUnknownProduce ? (
          /* White background with friendly message for unknown produce */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('noProduceDetected')}</h2>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">{t('scanFruitsVegetables')}</p>
              
              <div className="bg-blue-50 p-4 rounded-lg max-w-sm mx-auto">
                <h3 className="font-semibold text-blue-800 mb-2">{t('improveImageQuality')}</h3>
                <div className="text-sm text-blue-700 text-left space-y-1">
                  <p>{t('betterLightingTip')}</p>
                  <p>{t('clearImageTip')}</p>
                  <p>{t('closerDistanceTip')}</p>
                  <p>{t('multipleAnglesTip')}</p>
                  <p>{t('removeObstructionsTip')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : capturedImage ? (
          <>
            <img 
              src={capturedImage} 
              alt="Captured produce"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.warn('Failed to load captured image, using fallback');
                (e.target as HTMLImageElement).style.display = 'none';
              }}
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
        ) : (
          /* Fallback design when no image is available */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Apple className="w-16 h-16 mx-auto mb-2 opacity-60" />
              <p className="text-sm opacity-80">{t('scanHistoryView')}</p>
            </div>
          </div>
        )}
        {!isUnknownProduce && <div className="absolute inset-0 bg-black bg-opacity-30" />}
        
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

            {/* Storage Recommendations - Expanded */}
            {!isUnknownProduce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Package2 className="w-5 h-5 text-blue-600" />
                  {t('expandedStorageTips')}
                </h3>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
                  <div className="space-y-4">
                    {/* Storage categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            {t('temperatureControl')}
                          </h4>
                          <p className="text-sm text-blue-700">{t('temperatureRange')}</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            {t('humidityManagement')}
                          </h4>
                          <p className="text-sm text-blue-700">{t('humidityLevel')}</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Leaf className="w-4 h-4" />
                            {t('gasManagement')}
                          </h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>• {t('ethyleneProducers')}</p>
                            <p>• {t('ethyleneSensitive')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Package2 className="w-4 h-4" />
                            {t('containerGuidance')}
                          </h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>• {t('ventilatedContainers')}</p>
                            <p>• {t('airtightStorage')}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Apple className="w-4 h-4" />
                            {t('locationRecommendations')}
                          </h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>• {t('refrigeratorCrisper')}</p>
                            <p>• {t('counterRipening')}</p>
                            <p>• {t('avoidDirectSunlight')}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Maintenance
                          </h4>
                          <p className="text-sm text-blue-700">{t('checkRegularly')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Custom storage recommendation if available */}
                    {selectedFruit.storageRecommendation && (
                      <div className="pt-3 border-t border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Specific Recommendation:</h4>
                        <p className="text-sm text-blue-700 italic">
                          "{translateAnalysisValue(language, selectedFruit.storageRecommendation)}"
                        </p>
                      </div>
                    )}
                    
                    {/* Freshness-dependent storage advice */}
                    <div className="pt-3 border-t border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">
                        {selectedFruit.freshness >= 80 ? '🟢 Optimal Storage:' :
                         selectedFruit.freshness >= 60 ? '🟡 Priority Storage:' : '🔴 Immediate Use:'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {selectedFruit.freshness >= 80 
                          ? 'High quality produce - follow standard storage guidelines for maximum shelf life extension.'
                          : selectedFruit.freshness >= 60
                          ? 'Good quality but aging - store properly and use within recommended timeframe.'
                          : 'Lower quality - consume soon and store in optimal conditions to prevent further deterioration.'
                        }
                      </p>
                    </div>
                  </div>
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

            {/* Nutritional Breakdown */}
            {!isUnknownProduce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-green-600" />
                  {t('nutritionalBreakdown')}
                </h3>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">{t('macronutrients')}</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• {t('carbs')}: {selectedFruit.nutritionInfo?.netCarbs || '25g'}</p>
                        <p>• {t('fiber')}: {selectedFruit.nutritionInfo?.fiber || '4.4g'}</p>
                        <p>• {t('sugar')}: {selectedFruit.nutritionInfo?.sugar || '19g'}</p>
                        <p>• {t('protein')}: 0.3g</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">{t('micronutrients')}</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Vitamin C: 14% DV</p>
                        <p>• Potassium: 6% DV</p>
                        <p>• Vitamin A: 3% DV</p>
                        <p>• Calcium: 1% DV</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">{t('phytonutrients')}</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• Quercetin</p>
                        <p>• Catechin</p>
                        <p>• Chlorogenic acid</p>
                        <p>• Anthocyanins</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-green-200">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium text-green-800">{t('calorieContent')}: </span>
                        <span className="text-green-700">{selectedFruit.nutritionInfo?.calories || '95 kcal'} per serving</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">{t('glycemicIndex')}: </span>
                        <span className="text-green-700">Low to Medium (36-38)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Preparation & Usage Tips */}
            {!isUnknownProduce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-600" />
                  {t('preparationTips')}
                </h3>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-2">Preparation Methods</h4>
                        <div className="text-sm text-purple-700 space-y-1">
                          <p>• Fresh consumption</p>
                          <p>• Juice extraction</p>
                          <p>• Cooking & baking</p>
                          <p>• Dehydration</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-2">{t('servingRecommendations')}</h4>
                        <div className="text-sm text-purple-700 space-y-1">
                          <p>• Adults: 1-2 medium pieces</p>
                          <p>• Children: ½-1 medium piece</p>
                          <p>• Best consumed with skin</p>
                          <p>• Combine with protein/fat</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-2">{t('pairingsSuggestions')}</h4>
                        <div className="text-sm text-purple-700 space-y-1">
                          <p>• Nuts & nut butters</p>
                          <p>• Yogurt & cheese</p>
                          <p>• Oats & grains</p>
                          <p>• Dark leafy greens</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-2">{t('seasonalAvailability')}</h4>
                        <div className="text-sm text-purple-700 space-y-1">
                          <p>• Peak: Fall season</p>
                          <p>• Available year-round</p>
                          <p>• Best quality: August-November</p>
                          <p>• Local varieties preferred</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Environmental & Sustainability Info */}
            {!isUnknownProduce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  {t('sustainabilityInfo')}
                </h3>
                <Card className="p-4 bg-gradient-to-br from-emerald-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">Carbon Footprint</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <p>• Local: 0.3 kg CO₂/kg</p>
                        <p>• Regional: 0.8 kg CO₂/kg</p>
                        <p>• Choose local when possible</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">Water Usage</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <p>• 70L water per apple</p>
                        <p>• Moderate water footprint</p>
                        <p>• Support sustainable farms</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-emerald-200">
                      <h4 className="font-medium text-emerald-800 mb-2">Eco Tips</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <p>• Buy organic when possible</p>
                        <p>• Compost peels & cores</p>
                        <p>• Use reusable bags</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-emerald-200">
                    <p className="text-sm text-emerald-700">
                      <span className="font-medium">Freshness Impact:</span> {
                        selectedFruit.freshness >= 80 
                          ? 'Optimal freshness reduces food waste and maximizes nutritional value.' 
                          : 'Consider using soon to minimize waste and environmental impact.'
                      }
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Health Benefits - Expanded */}
            {!isUnknownProduce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  {t('expandedHealthBenefits')}
                </h3>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-white">
                  <div className="space-y-4">
                    {/* Comprehensive health benefits grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-800">{t('immuneSystemSupport')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-gray-800">{t('cardiovascularHealth')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-800">{t('digestiveWellness')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium text-gray-800">{t('skinHealthBenefits')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-gray-800">{t('energyMetabolism')}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package2 className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-800">{t('boneHealthSupport')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Apple className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-800">{t('eyeHealthProtection')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-gray-800">{t('antiInflammatoryProps')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-800">{t('weightManagementAid')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-teal-600" />
                          <span className="font-medium text-gray-800">{t('detoxificationSupport')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Custom benefits if available */}
                    {selectedFruit.nutritionInfo?.benefits && (
                      <div className="pt-3 border-t border-red-200">
                        <p className="text-sm text-gray-700 italic">
                          "{translateAnalysisValue(language, selectedFruit.nutritionInfo.benefits)}"
                        </p>
                      </div>
                    )}
                    
                    {/* Freshness-dependent additional benefits */}
                    {selectedFruit.freshness >= 80 && (
                      <div className="pt-3 border-t border-red-200">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          ✨ Premium Quality Benefits:
                        </p>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p>• {t('highFiberBenefits')}</p>
                          <p>• {t('naturalEnergySource')}</p>
                          <p>• Maximum nutrient density and bioavailability</p>
                          <p>• Optimal antioxidant activity for cellular protection</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
            {isUnknownProduce ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('backToMain')}
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  onClick={onScanAnother}
                >
                  <Camera className="w-4 h-4" />
                  {t('retryScanning')}
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}