'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Star, Zap, Shield } from 'lucide-react';
import { Card } from './ui/Card';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'scanner' | 'waste-reducer' | 'expert' | 'streak';
}

interface UserStats {
  totalScans: number;
  wasteReduction: number;
  streakDays: number;
  averageFreshness: number;
  perfectScans: number;
}

export function UserRewards() {
  const [stats, setStats] = useState<UserStats>({
    totalScans: 0,
    wasteReduction: 0,
    streakDays: 0,
    averageFreshness: 0,
    perfectScans: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-scan',
      title: 'First Scanner',
      description: 'Complete your first scan',
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: 'scanner'
    },
    {
      id: 'waste-warrior',
      title: 'Waste Warrior',
      description: 'Achieve 80% waste reduction',
      icon: <Shield className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 80,
      category: 'waste-reducer'
    },
    {
      id: 'perfect-week',
      title: 'Perfect Week',
      description: 'Scan for 7 consecutive days',
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      category: 'streak'
    },
    {
      id: 'fresh-expert',
      title: 'Freshness Expert',
      description: 'Maintain 90% average freshness score',
      icon: <Star className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 90,
      category: 'expert'
    },
    {
      id: 'century-scanner',
      title: 'Century Scanner',
      description: 'Complete 100 scans',
      icon: <Award className="w-6 h-6" />,
      unlocked: false,
      progress: 0,
      maxProgress: 100,
      category: 'scanner'
    }
  ]);

  useEffect(() => {
    // Calculate stats from localStorage
    const calculateStats = () => {
      let totalScans = 0;
      let totalFreshness = 0;
      let perfectScans = 0;
      const scanDates = new Set<string>();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('session-')) {
          const session = JSON.parse(localStorage.getItem(key) || '{}');
          if (session.items) {
            totalScans += session.items.length;
            const sessionDate = new Date(session.timestamp).toDateString();
            scanDates.add(sessionDate);

            session.items.forEach((item: { freshness: number; }) => {
              totalFreshness += item.freshness;
              if (item.freshness >= 95) perfectScans++;
            });
          }
        }
      }

      const averageFreshness = totalScans > 0 ? Math.round(totalFreshness / totalScans) : 0;
      const wasteReduction = totalScans > 0 ? Math.round((perfectScans / totalScans) * 100) : 0;
      
      // Calculate streak (simplified - just based on scan dates)
      const streakDays = Math.min(scanDates.size, 30); // Cap at 30 days for demo

      setStats({
        totalScans,
        wasteReduction,
        streakDays,
        averageFreshness,
        perfectScans
      });
    };

    calculateStats();
  }, []);

  useEffect(() => {
    // Update achievements based on stats
    setAchievements(prev => prev.map(achievement => {
      let progress = 0;
      let unlocked = false;

      switch (achievement.id) {
        case 'first-scan':
          progress = Math.min(stats.totalScans, 1);
          unlocked = stats.totalScans >= 1;
          break;
        case 'waste-warrior':
          progress = Math.min(stats.wasteReduction, 80);
          unlocked = stats.wasteReduction >= 80;
          break;
        case 'perfect-week':
          progress = Math.min(stats.streakDays, 7);
          unlocked = stats.streakDays >= 7;
          break;
        case 'fresh-expert':
          progress = Math.min(stats.averageFreshness, 90);
          unlocked = stats.averageFreshness >= 90;
          break;
        case 'century-scanner':
          progress = Math.min(stats.totalScans, 100);
          unlocked = stats.totalScans >= 100;
          break;
      }

      return { ...achievement, progress, unlocked };
    }));
  }, [stats]);

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'scanner': return 'from-blue-500 to-blue-600';
      case 'waste-reducer': return 'from-green-500 to-green-600';
      case 'expert': return 'from-purple-500 to-purple-600';
      case 'streak': return 'from-orange-500 to-orange-600';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked && a.progress > 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-2xl font-bold text-blue-700">{stats.totalScans}</div>
            <div className="text-sm text-gray-600">Total Scans</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-2xl font-bold text-green-700">{stats.wasteReduction}%</div>
            <div className="text-sm text-gray-600">Waste Reduced</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="text-2xl font-bold text-orange-700">{stats.streakDays}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-2xl font-bold text-purple-700">{stats.averageFreshness}%</div>
            <div className="text-sm text-gray-600">Avg Freshness</div>
          </Card>
        </motion.div>
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-md">
              {nextAchievement.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{nextAchievement.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{nextAchievement.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(nextAchievement.progress / nextAchievement.maxProgress) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {nextAchievement.progress} / {nextAchievement.maxProgress}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Achievements Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Achievements ({unlockedAchievements.length}/{achievements.length})
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`${achievement.unlocked ? 'opacity-100' : 'opacity-60'}`}
            >
              <Card className={`p-4 ${achievement.unlocked ? 'bg-gradient-to-r ' + getCategoryColor(achievement.category) + ' text-white' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-white/20' : 'bg-gray-200'}`}>
                    <div className={achievement.unlocked ? 'text-white' : 'text-gray-500'}>
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && achievement.progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Award className="w-6 h-6 text-white" />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}