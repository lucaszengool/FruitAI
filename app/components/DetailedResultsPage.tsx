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
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

  const handleShare = async () => {
    if (isUnknownProduce) {
      alert('Cannot share results for undetected produce');
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          capturedImage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const data = await response.json();
      setShareUrl(data.shareUrl);
      setShowShareModal(true);
      
      console.log('Share created:', data.shareUrl);
    } catch (error) {
      console.error('Error sharing results:', error);
      alert('Failed to create share link. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with image */}
      <div className="relative h-64 overflow-hidden">
        {capturedImage ? (
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
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <Apple className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* Header controls */}
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-white">{t('freshnessAnalysis')}</h1>
          
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              disabled={isSharing}
              className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
            >
              <Share className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
              <MoreHorizontal className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-t-3xl min-h-screen px-4"
        >
          {/* Header Info */}
          <div className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {results.length > 1 && (
                <div className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-1">
                  <span className="text-sm font-medium">{results.indexOf(selectedFruit) + 1}</span>
                  <Edit3 className="w-3 h-3" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-black mb-8">
              {translateAnalysisValue(language, selectedFruit.item)}
            </h2>

            {/* Main Freshness Score Display */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-8 h-8 text-black" />
                <span className="text-lg text-gray-600">{t('freshnessScore')}</span>
              </div>
              <div className="text-6xl font-bold text-black mb-2">
                {selectedFruit.freshness}
              </div>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl">🥩</span>
                  <span className="text-sm text-gray-600">{t('protein')}</span>
                </div>
                <div className="text-2xl font-bold">0g</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl">🌾</span>
                  <span className="text-sm text-gray-600">{t('carbs')}</span>
                </div>
                <div className="text-2xl font-bold">{selectedFruit.nutritionInfo?.netCarbs?.replace(/[^0-9]/g, '') || '25'}g</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-sm text-gray-600">{t('calories')}</span>
                </div>
                <div className="text-2xl font-bold">{selectedFruit.nutritionInfo?.calories?.replace(/[^0-9]/g, '') || '95'}</div>
              </div>
            </div>

            {/* Progress Bar for Freshness */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${selectedFruit.freshness >= 80 ? 'bg-green-500' : 
                    selectedFruit.freshness >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${selectedFruit.freshness}%` }}
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 mb-8">
              {/* Storage Tips - Expandable */}
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'storage' ? null : 'storage')}
                  className="w-full flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-xl font-semibold text-black">{t('storageGuide')}</span>
                  </div>
                  <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform ${
                    expandedSection === 'storage' ? 'rotate-45' : ''
                  }`}>
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </button>
                {expandedSection === 'storage' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {/* Temperature Control Card */}
                    <div className="bg-white p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-black mb-2">{t('temperatureControl')}</h4>
                          <p className="text-gray-600 leading-relaxed">{t('temperatureRange')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shelf Life Card */}
                    <div className="bg-white p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-black mb-2">{t('estimatedShelfLife')}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-black">{selectedFruit.daysRemaining || 3}</span>
                            <span className="text-gray-600">{t('daysLeft')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quality Assessment - Always Visible */}
              <div className="bg-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-xl font-semibold text-black">{t('qualityAssessment')}</span>
                </div>
                
                <div className="space-y-4">
                  {/* Color & Texture Row */}
                  <div className="flex gap-6">
                    <div className="flex-1 bg-white p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">🎨</span>
                        </div>
                        <span className="font-medium text-gray-600">{t('color')}</span>
                      </div>
                      <p className="text-black font-semibold">{translateAnalysisValue(language, selectedFruit.characteristics.color)}</p>
                    </div>
                    <div className="flex-1 bg-white p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">✋</span>
                        </div>
                        <span className="font-medium text-gray-600">{t('texture')}</span>
                      </div>
                      <p className="text-black font-semibold">{translateAnalysisValue(language, selectedFruit.characteristics.texture)}</p>
                    </div>
                  </div>
                  
                  {/* Blemishes & Ripeness Row */}
                  <div className="flex gap-6">
                    <div className="flex-1 bg-white p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">🔍</span>
                        </div>
                        <span className="font-medium text-gray-600">{t('blemishes')}</span>
                      </div>
                      <p className="text-black font-semibold">{translateAnalysisValue(language, selectedFruit.characteristics.blemishes)}</p>
                    </div>
                    <div className="flex-1 bg-white p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">⏰</span>
                        </div>
                        <span className="font-medium text-gray-600">{t('ripeness')}</span>
                      </div>
                      <p className="text-black font-semibold">{translateAnalysisValue(language, selectedFruit.characteristics.ripeness)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Benefits - Always Visible */}
              <div className="bg-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-xl font-semibold text-black">{t('healthBenefits')}</span>
                </div>
                
                <div className="space-y-4">
                  {/* Immune System */}
                  <div className="bg-white p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">{t('immuneSystemSupport')}</h4>
                        <p className="text-sm text-gray-600">Supports immune function and helps fight infections</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cardiovascular */}
                  <div className="bg-white p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">{t('cardiovascularHealth')}</h4>
                        <p className="text-sm text-gray-600">Promotes heart health and healthy blood circulation</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Digestive */}
                  <div className="bg-white p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">{t('digestiveWellness')}</h4>
                        <p className="text-sm text-gray-600">Aids digestion and supports gut health</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nutrition Details - Expandable */}
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'nutrition' ? null : 'nutrition')}
                  className="w-full flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Apple className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-xl font-semibold text-black">{t('nutritionalBreakdown')}</span>
                  </div>
                  <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center transition-transform ${
                    expandedSection === 'nutrition' ? 'rotate-45' : ''
                  }`}>
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </button>
                {expandedSection === 'nutrition' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-6"
                  >
                    {/* Macronutrients */}
                    <div className="bg-white p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🌾</span>
                        </div>
                        <h4 className="text-lg font-semibold text-black">{t('macronutrients')}</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">{selectedFruit.nutritionInfo?.netCarbs?.replace(/[^0-9]/g, '') || '25'}g</div>
                          <div className="text-sm text-gray-600">{t('carbs')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">{selectedFruit.nutritionInfo?.fiber?.replace(/[^0-9.]/g, '') || '4.4'}g</div>
                          <div className="text-sm text-gray-600">{t('fiber')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-black">{selectedFruit.nutritionInfo?.sugar?.replace(/[^0-9]/g, '') || '19'}g</div>
                          <div className="text-sm text-gray-600">{t('sugar')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Micronutrients */}
                    <div className="bg-white p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">💊</span>
                        </div>
                        <h4 className="text-lg font-semibold text-black">{t('micronutrients')}</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('vitaminC')}</span>
                          <span className="font-bold text-black">14% {t('dv')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('potassium')}</span>
                          <span className="font-bold text-black">6% {t('dv')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('vitaminA')}</span>
                          <span className="font-bold text-black">3% {t('dv')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Phytonutrients */}
                    <div className="bg-white p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🧬</span>
                        </div>
                        <h4 className="text-lg font-semibold text-black">{t('phytonutrients')}</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                          <span className="text-gray-700 font-medium">{t('quercetin')}</span>
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                          <span className="text-gray-700 font-medium">{t('catechin')}</span>
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                          <span className="text-gray-700 font-medium">{t('anthocyanins')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Multiple Fruit Selector */}
          {results.length > 1 && (
            <div className="px-4 mb-4">
              <h3 className="text-lg font-semibold text-black mb-3">{t('analyzedItems')}</h3>
              <div className="space-y-2">
                {results.map((fruit, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedFruit(fruit)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedFruit === fruit ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <span className="font-medium">{translateAnalysisValue(language, fruit.item)}</span>
                      </div>
                      <span className="text-sm text-gray-500">{fruit.freshness}%</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

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

      {/* Share Modal */}
      {showShareModal && shareUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Results</h2>
              <p className="text-gray-600">
                Share this analysis with others. The link will expire in 7 days.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Share Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={copyShareUrl}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'FruitAI Analysis Results',
                      text: `Check out my produce freshness analysis from FruitAI! ${results.length} items analyzed.`,
                      url: shareUrl
                    }).catch(() => copyShareUrl());
                  } else {
                    copyShareUrl();
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Share Link
              </button>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
