'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export function useScanLimit() {
  const { isSignedIn, userId } = useAuth();

  // App is now completely free - no scan limits
  return {
    isSignedIn,
    userId,
    guestScanCount: 0,
    hasExceededLimit: false, // Never exceeded since it's free
    remainingScans: -1, // Unlimited
    incrementScanCount: () => 0, // No-op since no limits
    resetScanCount: () => {}, // No-op since no limits
    scanLimit: -1 // Unlimited
  };
}