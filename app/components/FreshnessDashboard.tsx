'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Apple, 
  TrendingUp, 
  Clock,
  Flame,
  Droplets,
  Leaf,
  Target,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface FreshnessDashboardProps {
  onStartScan: () => void;
  onBack?: () => void;
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

export function FreshnessDashboard({ onStartScan, onBack }: FreshnessDashboardProps) {
  const [currentStreak, setCurrentStreak] = useState(1);
  const [todayScans, setTodayScans] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(82);
  const [freshItemsLeft, setFreshItemsLeft] = useState(1290);
  
  // Real scan history from localStorage
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [averageFreshness, setAverageFreshness] = useState(0);

  useEffect(() => {
    // Load scan history from localStorage
    try {
      const savedScans = localStorage.getItem('fruitai_scan_history');
      if (savedScans) {
        const scans = JSON.parse(savedScans);
        
        // Sort scans by freshness score (highest first) for ranking
        const sortedScans = scans.sort((a: any, b: any) => b.averageScore - a.averageScore);
        setRecentScans(sortedScans.slice(0, 5)); // Show top 5 freshest scans
        setTotalScans(scans.length);
        
        // Calculate average freshness
        const totalFreshness = scans.reduce((sum: number, scan: any) => sum + scan.averageScore, 0);
        setAverageFreshness(scans.length > 0 ? Math.round(totalFreshness / scans.length) : 0);
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  }, []);

  const freshnessMetrics = [
    {
      title: 'Total Scans',
      value: totalScans.toString(),
      subtitle: 'Items analyzed',
      icon: Apple,
      color: 'text-green-500',
      progress: Math.min(totalScans / 100, 1) // Progress based on scans up to 100
    },
    {
      title: 'Quality Score',
      value: averageFreshness > 0 ? `${averageFreshness}%` : '0%', 
      subtitle: 'Avg freshness',
      icon: Leaf,
      color: averageFreshness >= 80 ? 'text-green-500' : averageFreshness >= 60 ? 'text-yellow-500' : 'text-red-500',
      progress: averageFreshness / 100
    },
    {
      title: 'Recent Activity',
      value: recentScans.length.toString(),
      subtitle: 'Recent scans', 
      icon: Clock,
      color: 'text-blue-500',
      progress: Math.min(recentScans.length / 10, 1) // Progress based on recent activity
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <motion.button
              onClick={onBack}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
          )}
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Apple className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black">FruitAI Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-black">{currentStreak}</span>
        </div>
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
              {totalScans}
            </div>
            <p className="text-lg text-gray-600 mb-4">Total items analyzed</p>
            
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

      {/* Top Freshness Rankings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">🏆 Top Fresh Items</h2>
          <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
            Ranked by freshness
          </span>
        </div>
        
        <div className="space-y-3">
          {recentScans.length > 0 ? (
            recentScans.map((scan, index) => {
              const getRankEmoji = (index: number) => {
                if (index === 0) return '🥇';
                if (index === 1) return '🥈';
                if (index === 2) return '🥉';
                return `#${index + 1}`;
              };
              
              const getRankColor = (score: number) => {
                if (score >= 90) return 'border-l-green-500 bg-green-50';
                if (score >= 80) return 'border-l-emerald-500 bg-emerald-50';
                if (score >= 70) return 'border-l-yellow-500 bg-yellow-50';
                return 'border-l-red-500 bg-red-50';
              };
              
              return (
                <Card key={scan.id} className={`bg-white p-4 border-l-4 ${getRankColor(scan.averageScore)} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {scan.image ? (
                          <img 
                            src={scan.image} 
                            alt={scan.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center">
                            <Apple className="w-6 h-6 text-orange-800" />
                          </div>
                        )}
                      </div>
                      {/* Ranking badge */}
                      <div className="absolute -top-2 -left-2 bg-white border-2 border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm">
                        {getRankEmoji(index)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-black truncate">{scan.title}</h3>
                        <span className="text-sm text-gray-500">{scan.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-green-600" />
                          <span className="text-black font-medium">{scan.averageScore}% fresh</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Apple className="w-3 h-3" />
                          <span>{scan.itemCount} items</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            scan.averageScore >= 80 ? 'bg-green-100 text-green-800' : 
                            scan.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {scan.averageScore >= 80 ? 'Excellent' : 
                             scan.averageScore >= 60 ? 'Good' : 'Fair'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white p-8 text-center">
              <Apple className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No scans yet</h3>
              <p className="text-gray-500 mb-6">Start analyzing fruit freshness to see your history here</p>
              <Button onClick={onStartScan} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Start First Scan
              </Button>
            </Card>
          )}
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

      {/* Simplified Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex justify-center max-w-sm mx-auto">
          <button className="flex flex-col items-center gap-2 p-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium text-black">Dashboard</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}