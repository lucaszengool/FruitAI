'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

const GUEST_SCAN_LIMIT = 2;

export function useScanLimit() {
  const { isSignedIn, userId } = useAuth();
  const [guestScanCount, setGuestScanCount] = useState(0);

  // Load guest scan count from localStorage on mount
  useEffect(() => {
    if (!isSignedIn) {
      const savedCount = localStorage.getItem('guest_scan_count');
      setGuestScanCount(savedCount ? parseInt(savedCount, 10) : 0);
    }
  }, [isSignedIn]);

  // Calculate remaining scans and limit status
  const remainingScans = isSignedIn ? -1 : Math.max(0, GUEST_SCAN_LIMIT - guestScanCount);
  const hasExceededLimit = !isSignedIn && guestScanCount >= GUEST_SCAN_LIMIT;

  const incrementScanCount = () => {
    if (!isSignedIn) {
      const newCount = guestScanCount + 1;
      setGuestScanCount(newCount);
      localStorage.setItem('guest_scan_count', newCount.toString());
      return newCount;
    }
    return 0;
  };

  const resetScanCount = () => {
    if (!isSignedIn) {
      setGuestScanCount(0);
      localStorage.removeItem('guest_scan_count');
    }
  };

  return {
    isSignedIn,
    userId,
    guestScanCount,
    hasExceededLimit,
    remainingScans,
    incrementScanCount,
    resetScanCount,
    scanLimit: GUEST_SCAN_LIMIT
  };
}