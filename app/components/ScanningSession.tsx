'use client';

import { useState } from 'react';
import { FullScreenScanner } from './FullScreenScanner';
import { ScanResultSummary } from './ScanResultSummary';

interface ScanResult {
  screenshot: string;
  items: Array<{
    id: string;
    item: string;
    freshness: number;
    recommendation: 'buy' | 'avoid' | 'check';
    details: string;
    confidence: number;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    storageRecommendation?: string;
    daysRemaining?: number;
  }>;
  timestamp: Date;
  averageFreshness: number;
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
}

interface ScanningSessionProps {
  sessionType: 'shopping' | 'fridge-check' | 'pantry-check';
  onClose: () => void;
}

export function ScanningSession({ sessionType, onClose }: ScanningSessionProps) {
  const [currentView, setCurrentView] = useState<'scanner' | 'summary'>('scanner');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setCurrentView('summary');
  };

  const handleNewScan = () => {
    setScanResult(null);
    setCurrentView('scanner');
  };

  if (currentView === 'summary' && scanResult) {
    return (
      <ScanResultSummary
        result={scanResult}
        onClose={onClose}
        onNewScan={handleNewScan}
      />
    );
  }

  return (
    <FullScreenScanner
      sessionType={sessionType}
      onClose={onClose}
      onComplete={handleScanComplete}
    />
  );
}