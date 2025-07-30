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
  };
}

interface DetailedResultsPageProps {
  results: FruitAnalysisResult[];
  onBack: () => void;
  onFreshnessScoreClick: (fruit: FruitAnalysisResult) => void;
  onScanAnother: () => void;
  capturedImage?: string;
}

export function DetailedResultsPage({ 
  results, 
  onBack, 
  onFreshnessScoreClick,
  onScanAnother,
  capturedImage 
}: DetailedResultsPageProps) {
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

  const macroNutrients = [
    {
      icon: Apple,
      label: 'Protein',
      value: '0g',
      color: 'text-red-500'
    },
    {
      icon: Leaf,
      label: 'Carbs', 
      value: '23g',
      color: 'text-orange-500'
    },
    {
      icon: Droplets,
      label: 'Fats',
      value: '0g',
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with background image */}
      <div className="relative h-64 bg-gradient-to-br from-orange-200 to-orange-400 overflow-hidden">
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured produce"
            className="absolute inset-0 w-full h-full object-cover"
          />
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
          
          <h1 className="text-lg font-semibold text-white">Freshness Analysis</h1>
          
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

            <h2 className="text-2xl font-bold text-black mb-2">
              {results.length === 1 ? selectedFruit.item : `${results.length} Items Analyzed`}
            </h2>

            {/* Main freshness score */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-black" />
                <span className="text-lg font-semibold text-black">
                  {Math.round(results.reduce((sum, r) => sum + r.freshness, 0) / results.length)}% Fresh
                </span>
              </div>
            </div>

            {/* Macro nutrients display */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {macroNutrients.map((macro, index) => (
                <div key={index} className="text-center">
                  <macro.icon className={`w-5 h-5 mx-auto mb-1 ${macro.color}`} />
                  <div className="text-lg font-semibold text-black">{macro.value}</div>
                  <div className="text-sm text-gray-500">{macro.label}</div>
                </div>
              ))}
            </div>

            {/* Freshness Score Clickable Section */}
            <button
              onClick={() => onFreshnessScoreClick(selectedFruit)}
              className="w-full"
            >
              <Card className="p-4 border border-green-200 hover:border-green-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Flame className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-black">Freshness Score</div>
                      <div className="text-sm text-gray-500">Tap for detailed breakdown</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {Math.round(results.reduce((sum, r) => sum + r.freshness, 0) / results.length)}/100
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ 
                          width: `${Math.round(results.reduce((sum, r) => sum + r.freshness, 0) / results.length)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          </div>

          {/* Individual Fruits List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Analyzed Items</h3>
              <button className="flex items-center gap-1 text-green-600 text-sm">
                <Plus className="w-4 h-4" />
                <span>Add More</span>
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
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg flex items-center justify-center">
                          <Apple className="w-6 h-6 text-orange-800" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-black">{fruit.item}</h4>
                            {fruit.daysRemaining && fruit.daysRemaining < 3 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{fruit.freshness}% fresh</span>
                            {fruit.daysRemaining && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{fruit.daysRemaining} days left</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getRecommendationColor(fruit.recommendation)}`}>
                          {fruit.recommendation.charAt(0).toUpperCase() + fruit.recommendation.slice(1)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {fruit.confidence}% confidence
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
                <h3 className="text-lg font-semibold text-black mb-3">Storage Tips</h3>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-800">{selectedFruit.storageRecommendation}</p>
                </Card>
              </motion.div>
            )}

            {/* Item Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h3 className="text-lg font-semibold text-black mb-3">Quality Assessment</h3>
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Color:</span>
                    <span className="ml-2 text-black">{selectedFruit.characteristics.color}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Texture:</span>
                    <span className="ml-2 text-black">{selectedFruit.characteristics.texture}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Blemishes:</span>
                    <span className="ml-2 text-black">{selectedFruit.characteristics.blemishes}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ripeness:</span>
                    <span className="ml-2 text-black">{selectedFruit.characteristics.ripeness}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={onScanAnother}
            >
              <Camera className="w-4 h-4" />
              Scan Another
            </Button>
            <Button 
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              onClick={onBack}
            >
              Back to Main
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}