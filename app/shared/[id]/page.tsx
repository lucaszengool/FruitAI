'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DetailedResultsPage } from '../../components/DetailedResultsPage';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';

interface ShareData {
  id: string;
  results: any[];
  capturedImage?: string;
  timestamp: string;
  expiresAt: string;
}

export default function SharedResultsPage() {
  const params = useParams();
  const shareId = params.id as string;
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) return;

    const fetchSharedData = async () => {
      try {
        const response = await fetch(`/api/share?id=${shareId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load shared results');
        }
        
        const data = await response.json();
        setShareData(data);
      } catch (err) {
        console.error('Error fetching shared data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shared results');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedData();
  }, [shareId]);

  const handleBack = () => {
    window.location.href = '/';
  };

  const handleScanAnother = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Loading Shared Results</h2>
          <p className="text-gray-600">Please wait while we retrieve the analysis...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Results</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            {error.includes('expired') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">This shared link has expired</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Shared results are only available for 7 days for privacy and security.
                </p>
              </div>
            )}
            
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start New Analysis
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Shared Results Banner */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          <span>
            Shared analysis from {new Date(shareData.timestamp).toLocaleDateString()} 
            • Expires {new Date(shareData.expiresAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Render the detailed results page */}
      <DetailedResultsPage
        results={shareData.results}
        capturedImage={shareData.capturedImage}
        onBack={handleBack}
        onScanAnother={handleScanAnother}
      />
    </div>
  );
}