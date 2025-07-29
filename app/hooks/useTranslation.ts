'use client';

import { useState, useEffect } from 'react';
import { getTranslations, Translations } from '../lib/i18n';
import { translateText } from '../lib/translator';

export function useTranslation() {
  const [t, setT] = useState<Translations>(getTranslations());
  
  useEffect(() => {
    // Update translations when component mounts or language changes
    setT(getTranslations());
  }, []);

  // Function to translate any text dynamically
  const translate = async (text: string): Promise<string> => {
    return await translateText(text);
  };

  return { t, translate };
}