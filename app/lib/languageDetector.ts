export function getLanguageCode(): string {
  if (typeof window === 'undefined') {
    return 'en';
  }
  
  const locale = navigator.language.toLowerCase();
  
  if (locale.startsWith('zh')) {
    return 'zh';
  } else if (locale.startsWith('es')) {
    return 'es';
  } else if (locale.startsWith('fr')) {
    return 'fr';
  } else if (locale.startsWith('ja')) {
    return 'ja';
  } else if (locale.startsWith('ko')) {
    return 'ko';
  }
  
  return 'en';
}

export function shouldTranslateResponse(text: string): boolean {
  const lang = getLanguageCode();
  if (lang === 'en') return false;
  
  // Check if text contains English content
  const englishPatterns = [
    /\b(freshness|recommendation|confidence|storage|shelf life|days|calories|vitamins|benefits)\b/i,
    /\b(buy|check|avoid|store|refrigerate|cool|dry)\b/i,
    /\b(green|red|yellow|brown|color|texture|smooth|rough)\b/i,
    /\b(ripe|unripe|overripe|fresh|spoiled)\b/i
  ];
  
  return englishPatterns.some(pattern => pattern.test(text));
}