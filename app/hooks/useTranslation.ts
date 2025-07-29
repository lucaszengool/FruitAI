'use client';

import { useState, useEffect } from 'react';
import { getTranslations, Translations } from '../lib/i18n';
import { translateText } from '../lib/translator';

export function useTranslation() {
  const [t, setT] = useState<Translations>(() => {
    // Initialize with a stable default to avoid hydration mismatch
    if (typeof window === 'undefined') {
      // Server-side: return English translations
      return getTranslations('en');
    }
    return getTranslations();
  });
  
  useEffect(() => {
    // Update translations when component mounts or language changes
    // This only runs on client side
    const translations = getTranslations();
    setT(translations);
  }, []);

  // Function to translate any text dynamically
  const translate = async (text: string): Promise<string> => {
    return await translateText(text);
  };

  return { t, translate };
}