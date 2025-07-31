'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState, createContext, useContext } from "react";
import { detectUserLanguageSync } from "../lib/translations";
import { enUS, zhCN, esES, frFR, jaJP } from '@clerk/localizations';

interface LocalizedClerkProviderProps {
  children: React.ReactNode;
}

// Create a context to share language changes between our translation system and Clerk
const LanguageContext = createContext<{
  clerkLocale: string;
  updateLocale: (language: string) => void;
}>({
  clerkLocale: 'en-US',
  updateLocale: () => {}
});

export function LocalizedClerkProvider({ children }: LocalizedClerkProviderProps) {
  const [localization, setLocalization] = useState(enUS);

  // Map our language codes to Clerk localizations
  const languageToLocalizationMap = {
    'en': enUS,
    'zh': zhCN,
    'es': esES,
    'fr': frFR,
    'ja': jaJP
  };

  useEffect(() => {
    // Detect user's language and map to Clerk localization
    const detectedLanguage = detectUserLanguageSync();
    const clerkLocalization = languageToLocalizationMap[detectedLanguage as keyof typeof languageToLocalizationMap] || enUS;
    setLocalization(clerkLocalization);
    
    console.log(`🌐 Clerk localized to: ${detectedLanguage}`);
    
    // Listen for language changes from our translation context
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail.language;
      const newClerkLocalization = languageToLocalizationMap[newLanguage as keyof typeof languageToLocalizationMap] || enUS;
      setLocalization(newClerkLocalization);
      console.log(`🌐 Clerk locale updated to: ${newLanguage}`);
    };
    
    // Add event listener for language changes
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const updateLocale = (language: string) => {
    const clerkLocalization = languageToLocalizationMap[language as keyof typeof languageToLocalizationMap] || enUS;
    setLocalization(clerkLocalization);
    console.log(`🌐 Clerk locale updated to: ${language}`);
  };

  return (
    <LanguageContext.Provider value={{ clerkLocale: localization.locale || 'en-US', updateLocale }}>
      <ClerkProvider localization={localization}>
        {children}
      </ClerkProvider>
    </LanguageContext.Provider>
  );
}

// Hook to use language context (if needed in other components)
export function useClerkLanguage() {
  return useContext(LanguageContext);
}