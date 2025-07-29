'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, Calendar, Package } from 'lucide-react';
import { Card } from './ui/Card';

interface HistoryItem {
  id: string;
  item: string;
  freshness: number;
  timestamp: Date;
  location: 'store' | 'fridge' | 'pantry';
}

interface UserHistoryProps {
  userId?: string;
}

export function UserHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [insights, setInsights] = useState({
    avgFreshness: 0,
    frequentItems: [] as string[],
    freshnessTrajectory: 'stable' as 'improving' | 'declining' | 'stable',
    wasteReduction: 0
  });

  useEffect(() => {
    // Load history from localStorage
    const loadHistory = () => {
      const items: HistoryItem[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('session-')) {
          const session = JSON.parse(localStorage.getItem(key) || '{}');
          if (session.items) {
            items.push(...session.items.map((item: { id: string; item: string; freshness: number; timestamp: string; location: string; }) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            })));
          }
        }
      }
      setHistory(items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    loadHistory();
  }, []);

  useEffect(() => {
    // Calculate insights
    if (history.length > 0) {
      const avgFreshness = Math.round(
        history.reduce((sum, item) => sum + item.freshness, 0) / history.length
      );

      // Find frequent items
      const itemCounts = history.reduce((acc, item) => {
        acc[item.item] = (acc[item.item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const frequentItems = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([item]) => item);

      // Calculate trajectory
      const recentAvg = history.slice(0, 5).reduce((sum, item) => sum + item.freshness, 0) / 5;
      const olderAvg = history.slice(5, 10).reduce((sum, item) => sum + item.freshness, 0) / 5 || recentAvg;
      const freshnessTrajectory = recentAvg > olderAvg + 5 ? 'improving' : 
                                  recentAvg < olderAvg - 5 ? 'declining' : 'stable';

      // Estimate waste reduction
      const highFreshness = history.filter(item => item.freshness >= 80).length;
      const wasteReduction = Math.round((highFreshness / history.length) * 100);

      setInsights({
        avgFreshness,
        frequentItems,
        freshnessTrajectory,
        wasteReduction
      });
    }
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Freshness</p>
                <p className="text-2xl font-bold text-green-700">{insights.avgFreshness}%</p>
              </div>
              {insights.freshnessTrajectory === 'improving' ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : insights.freshnessTrajectory === 'declining' ? (
                <TrendingDown className="w-8 h-8 text-red-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items Scanned</p>
                <p className="text-2xl font-bold text-blue-700">{history.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waste Reduction</p>
                <p className="text-2xl font-bold text-purple-700">{insights.wasteReduction}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Frequent Items</p>
                <p className="text-sm font-semibold text-orange-700">
                  {insights.frequentItems[0] || 'No data'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
        <div className="space-y-3">
          {insights.freshnessTrajectory === 'improving' && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                Great job! Your produce selection is getting fresher. Keep using the scanner before purchasing.
              </p>
            </div>
          )}
          
          {insights.frequentItems.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800">
                You frequently buy {insights.frequentItems.join(', ')}. Consider checking these items first when shopping.
              </p>
            </div>
          )}

          {insights.wasteReduction > 70 && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              <p className="text-purple-800">
                You&apos;re reducing food waste by {insights.wasteReduction}%! Consider sharing your tips with the community.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Recent History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Scans</h3>
        <div className="space-y-2">
          {history.slice(0, 5).map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.freshness >= 80 ? 'bg-green-500' :
                  item.freshness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-medium">{item.item}</span>
                <span className="text-sm text-gray-500">
                  {item.location === 'store' ? '🛒' : item.location === 'fridge' ? '🥶' : '🏠'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{item.freshness}%</span>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}