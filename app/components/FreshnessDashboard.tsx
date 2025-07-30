'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Apple, 
  TrendingUp, 
  Clock,
  Flame,
  Droplets,
  Leaf,
  Target,
  Plus
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface FreshnessDashboardProps {
  onStartScan: () => void;
}

interface RecentScan {
  id: string;
  image: string;
  title: string;
  freshness: number;
  timestamp: string;
  itemCount: number;
  averageScore: number;
}

export function FreshnessDashboard({ onStartScan }: FreshnessDashboardProps) {
  const [currentStreak, setCurrentStreak] = useState(1);
  const [todayScans, setTodayScans] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(82);
  const [freshItemsLeft, setFreshItemsLeft] = useState(1290);
  
  // Mock data for recent scans
  const [recentScans, setRecentScans] = useState<RecentScan[]>([
    {
      id: '1',
      image: '/api/placeholder/80/60',
      title: 'Mixed Berries & Apples',
      freshness: 89,
      timestamp: '14:21',
      itemCount: 5,
      averageScore: 89
    },
    {
      id: '2', 
      image: '/api/placeholder/80/60',
      title: 'Leafy Greens Bundle',
      freshness: 76,
      timestamp: '12:45',
      itemCount: 3,
      averageScore: 76
    },
    {
      id: '3',
      image: '/api/placeholder/80/60', 
      title: 'Citrus Collection',
      freshness: 94,
      timestamp: '09:30',
      itemCount: 4,
      averageScore: 94
    }
  ]);

  const freshnessMetrics = [
    {
      title: 'Fresh Items',
      value: '108g',
      subtitle: 'Protein left',
      icon: Apple,
      color: 'text-red-500',
      progress: 0.7
    },
    {
      title: 'Quality Score',
      value: '128g', 
      subtitle: 'Carbs left',
      icon: Leaf,
      color: 'text-orange-500',
      progress: 0.8
    },
    {
      title: 'Shelf Life',
      value: '38g',
      subtitle: 'Fat left', 
      icon: Clock,
      color: 'text-blue-500',
      progress: 0.3
    }
  ];

  const getCurrentWeekDays = () => {
    const days = ['F', 'S', 'S', 'M', 'T', 'W', 'T'];
    const dates = [25, 26, 27, 28, 29, 30, 31];
    const today = new Date().getDate();
    
    return days.map((day, index) => ({
      day,
      date: dates[index],
      isToday: dates[index] === 30, // Mock today as 30th
      hasActivity: index < 5 // First 5 days have activity
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Apple className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black">FreshAI</h1>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-black">{currentStreak}</span>
        </div>
      </motion.div>

      {/* Weekly Calendar */}
      <motion.div 
        className="flex justify-center gap-4 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {getCurrentWeekDays().map((day, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${
              day.isToday 
                ? 'border-black bg-black text-white' 
                : day.hasActivity
                ? 'border-gray-300 bg-white text-black'
                : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}>
              <span className="text-sm font-medium">{day.day}</span>
            </div>
            <span className="text-sm text-gray-600">{day.date}</span>
          </div>
        ))}
      </motion.div>

      {/* Main Freshness Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-white p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-8xl font-light text-black mb-2">
              {freshItemsLeft}
            </div>
            <p className="text-lg text-gray-600 mb-4">Fresh items left</p>
            
            {/* Circular Progress Indicator */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-black"
                  strokeDasharray={`${(weeklyAverage / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-8 h-8 text-black" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div 
        className="grid grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {freshnessMetrics.map((metric, index) => (
          <Card key={index} className="bg-white p-4 text-center">
            <div className="mb-3">
              <span className="text-2xl font-semibold text-black">{metric.value}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{metric.subtitle}</p>
            
            {/* Progress Circle */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  className={metric.color}
                  strokeDasharray={`${metric.progress * 219.8} 219.8`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Page Indicator */}
      <motion.div 
        className="flex justify-center gap-2 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-2 h-2 bg-black rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </motion.div>

      {/* Recently Scanned Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-black mb-4">Recently scanned</h2>
        
        <div className="space-y-3">
          {recentScans.map((scan) => (
            <Card key={scan.id} className="bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center">
                    <Apple className="w-6 h-6 text-orange-800" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-black truncate">{scan.title}</h3>
                    <span className="text-sm text-gray-500">{scan.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-black" />
                      <span className="text-black font-medium">{scan.averageScore}% fresh</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Apple className="w-3 h-3" />
                      <span>{scan.itemCount} items</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Droplets className="w-3 h-3" />
                      <span>0g</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Leaf className="w-3 h-3" />
                      <span>0g</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={onStartScan}
          className="w-14 h-14 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex justify-center gap-12 max-w-sm mx-auto">
          <button className="flex flex-col items-center gap-1 p-2">
            <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xs font-medium text-black">Home</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 p-2">
            <TrendingUp className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Progress</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 p-2">
            <Target className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Settings</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}