'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Info,
  Flame,
  Droplets,
  Leaf,
  Apple,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card } from './ui/Card';

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
  nutritionInfo?: {
    calories: string;
    vitamins: string;
    fiber: string;
    minerals: string;
    benefits: string;
  };
}

interface FreshnessScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  fruit: FruitAnalysisResult;
}

export function FreshnessScoreModal({ isOpen, onClose, fruit }: FreshnessScoreModalProps) {
  const getFreshnessLevel = (score: number) => {
    if (score >= 80) return { level: 'Very Good!', color: 'text-green-600', description: 'High in beneficial nutrients and very supportive of overall health. It can be a regular part of a healthy diet.' };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-600', description: 'Decent quality with some beneficial nutrients. Consider consuming soon for best quality.' };
    return { level: 'Needs Attention', color: 'text-red-600', description: 'Quality is declining. Inspect carefully before consuming or consider avoiding.' };
  };

  const freshnessInfo = getFreshnessLevel(fruit.freshness);

  const qualityMetrics = [
    {
      icon: Droplets,
      label: 'Fiber',
      value: '0g',
      status: 'poor',
      color: 'text-red-500'
    },
    {
      icon: Apple,
      label: 'Net Carbs', 
      value: '25g',
      status: 'good',
      color: 'text-green-500'
    },
    {
      icon: Leaf,
      label: 'Sugar',
      value: '24g', 
      status: 'good',
      color: 'text-green-500'
    },
    {
      icon: Flame,
      label: 'Sodium',
      value: '10mg',
      status: 'good', 
      color: 'text-green-500'
    }
  ];

  const processedScore = Math.min(10, Math.max(0, Math.round((100 - fruit.freshness) / 10)));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'poor': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100';
      case 'poor': return 'bg-red-100';
      default: return 'bg-yellow-100';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 text-center border-b border-gray-100">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              
              <h2 className="text-xl font-semibold text-black">Freshness Score</h2>
            </div>

            {/* Main Score Display */}
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative inline-flex items-center justify-center mb-6"
              >
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    className="text-green-500"
                    strokeDasharray={`${(fruit.freshness / 100) * 282.6} 282.6`}
                    initial={{ strokeDasharray: "0 282.6" }}
                    animate={{ strokeDasharray: `${(fruit.freshness / 100) * 282.6} 282.6` }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-black mb-1">
                      {fruit.freshness}/100
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <h3 className={`text-2xl font-semibold mb-2 ${freshnessInfo.color}`}>
                  {freshnessInfo.level}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {freshnessInfo.description}
                </p>
              </motion.div>
            </div>

            {/* Quality Metrics */}
            <div className="px-6 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-4"
              >
                {qualityMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <Card className={`p-4 ${getStatusColor(metric.status)} border-0`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <metric.icon className={`w-5 h-5 ${metric.color}`} />
                          <span className="font-medium text-gray-800">{metric.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{metric.value}</span>
                          {getStatusIcon(metric.status)}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Processing Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mt-6"
              >
                <Card className="p-4 border-0 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">Processed</span>
                    </div>
                    <span className="font-semibold text-green-600">{processedScore}/10</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Contains minimal additives or preservatives, no artificial sweeteners, dyes, or seed oils.
                  </p>
                </Card>
              </motion.div>

              {/* Info Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mt-6 pt-4 border-t border-gray-100"
              >
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto">
                  <Info className="w-4 h-4" />
                  <span className="underline">Click to see how the freshness score is calculated</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}