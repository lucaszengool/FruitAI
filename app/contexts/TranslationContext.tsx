'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectUserLanguage, detectUserLanguageSync, getTranslation } from '../lib/translations';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<string>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize language on client side only
    if (typeof window !== 'undefined' && !isInitialized) {
      // Check if user has a saved language preference
      const savedLanguage = localStorage.getItem('fruitai_language');
      
      if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
        console.log(`Using saved language preference: ${savedLanguage}`);
        setLanguageState(savedLanguage);
        setIsInitialized(true);
      } else {
        // Auto-detect language based on browser, timezone, and location
        console.log('No saved language preference, auto-detecting...');
        
        // First use synchronous detection for immediate result
        const syncDetected = detectUserLanguageSync();
        setLanguageState(syncDetected);
        console.log(`Initial language set to: ${syncDetected}`);
        
        // Then try enhanced async detection with geolocation
        detectUserLanguage().then(detectedLanguage => {
          if (detectedLanguage !== syncDetected) {
            console.log(`Enhanced detection found better match: ${detectedLanguage}`);
            setLanguageState(detectedLanguage);
            localStorage.setItem('fruitai_language', detectedLanguage);
          } else {
            localStorage.setItem('fruitai_language', syncDetected);
          }
        }).catch(error => {
          console.log('Enhanced language detection failed, using sync result:', error);
          localStorage.setItem('fruitai_language', syncDetected);
        });
        
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fruitai_language', lang);
    }
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t,
    availableLanguages
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}