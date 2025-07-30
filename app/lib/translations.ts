// Translation system with auto-detection based on user location

export interface TranslationData {
  [key: string]: string;
}

export interface Translations {
  [language: string]: TranslationData;
}

export const translations: Translations = {
  en: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'AI-Powered Freshness Scanner',
    quickScan: 'Quick Scan',
    viewDashboard: 'View Dashboard',
    viewAnalytics: 'View Analytics',
    startScanningNow: 'Start Scanning Now',
    aiPoweredAnalysis: 'AI-Powered Freshness Analysis',
    smartShopping: 'Smart shopping decisions and waste reduction through AI scanning',
    readyToReduce: 'Ready to reduce food waste and make smarter choices?',
    startSession: 'Start a scanning session to analyze freshness and get personalized recommendations',
    
    // Camera
    positionFruits: 'Position fruits within the frame',
    ensureGoodLighting: 'Ensure good lighting for best results',
    ready: 'Ready',
    loading: 'Loading...',
    
    // Analysis
    analyzingFruit: 'Analyzing your fruit...',
    aiScanning: 'AI is scanning for freshness and quality',
    detectingFruits: 'Detecting individual fruits',
    analyzingColor: 'Analyzing color and texture',
    calculatingFreshness: 'Calculating freshness scores',
    thisMayTake: 'This may take 10-30 seconds',
    
    // Results
    freshnessAnalysis: 'Freshness Analysis',
    itemsAnalyzed: 'Items Analyzed',
    fresh: 'Fresh',
    freshnessScore: 'Freshness Score',
    tapForDetails: 'Tap for detailed breakdown',
    analyzedItems: 'Analyzed Items',
    addMore: 'Add More',
    scanAnother: 'Scan Another',
    backToMain: 'Back to Main',
    storageTips: 'Storage Tips',
    qualityAssessment: 'Quality Assessment',
    color: 'Color',
    texture: 'Texture',
    blemishes: 'Blemishes',
    ripeness: 'Ripeness',
    
    // Dashboard
    dashboard: 'Dashboard',
    totalScans: 'Total Scans',
    itemsAnalyzedShort: 'Items analyzed',
    qualityScore: 'Quality Score',
    avgFreshness: 'Avg freshness',
    recentActivity: 'Recent Activity',
    recentScans: 'Recent scans',
    topFreshItems: '🏆 Top Fresh Items',
    rankedByFreshness: 'Ranked by freshness',
    noScansYet: 'No scans yet',
    startAnalyzing: 'Start analyzing fruit freshness to see your history here',
    startFirstScan: 'Start First Scan',
    
    // Quality levels
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    
    // Recommendations
    buy: 'Buy',
    check: 'Check',
    avoid: 'Avoid',
    
    // Time
    daysLeft: 'days left',
    items: 'items'
  },
  
  es: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'Escáner de Frescura con IA',
    quickScan: 'Escaneo Rápido',
    viewDashboard: 'Ver Panel',
    viewAnalytics: 'Ver Análisis',
    startScanningNow: 'Comenzar Escaneo Ahora',
    aiPoweredAnalysis: 'Análisis de Frescura con IA',
    smartShopping: 'Decisiones inteligentes de compra y reducción de desperdicios mediante escaneo con IA',
    readyToReduce: '¿Listo para reducir el desperdicio de alimentos y tomar decisiones más inteligentes?',
    startSession: 'Inicia una sesión de escaneo para analizar la frescura y obtener recomendaciones personalizadas',
    
    // Camera
    positionFruits: 'Posiciona las frutas dentro del marco',
    ensureGoodLighting: 'Asegúrate de tener buena iluminación para mejores resultados',
    ready: 'Listo',
    loading: 'Cargando...',
    
    // Analysis
    analyzingFruit: 'Analizando tu fruta...',
    aiScanning: 'La IA está escaneando la frescura y calidad',
    detectingFruits: 'Detectando frutas individuales',
    analyzingColor: 'Analizando color y textura',
    calculatingFreshness: 'Calculando puntuaciones de frescura',
    thisMayTake: 'Esto puede tomar 10-30 segundos',
    
    // Results
    freshnessAnalysis: 'Análisis de Frescura',
    itemsAnalyzed: 'Artículos Analizados',
    fresh: 'Fresco',
    freshnessScore: 'Puntuación de Frescura',
    tapForDetails: 'Toca para desglose detallado',
    analyzedItems: 'Artículos Analizados',
    addMore: 'Agregar Más',
    scanAnother: 'Escanear Otro',
    backToMain: 'Volver al Principal',
    storageTips: 'Consejos de Almacenamiento',
    qualityAssessment: 'Evaluación de Calidad',
    color: 'Color',
    texture: 'Textura',
    blemishes: 'Manchas',
    ripeness: 'Madurez',
    
    // Dashboard
    dashboard: 'Panel',
    totalScans: 'Escaneos Totales',
    itemsAnalyzedShort: 'Artículos analizados',
    qualityScore: 'Puntuación de Calidad',
    avgFreshness: 'Frescura promedio',
    recentActivity: 'Actividad Reciente',
    recentScans: 'Escaneos recientes',
    topFreshItems: '🏆 Artículos Más Frescos',
    rankedByFreshness: 'Clasificado por frescura',
    noScansYet: 'Aún no hay escaneos',
    startAnalyzing: 'Comienza a analizar la frescura de las frutas para ver tu historial aquí',
    startFirstScan: 'Comenzar Primer Escaneo',
    
    // Quality levels
    excellent: 'Excelente',
    good: 'Bueno',
    fair: 'Regular',
    
    // Recommendations
    buy: 'Comprar',
    check: 'Verificar',
    avoid: 'Evitar',
    
    // Time
    daysLeft: 'días restantes',
    items: 'artículos'
  },
  
  fr: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'Scanner de Fraîcheur IA',
    quickScan: 'Scan Rapide',
    viewDashboard: 'Voir Tableau de Bord',
    viewAnalytics: 'Voir Analyses',
    startScanningNow: 'Commencer le Scan Maintenant',
    aiPoweredAnalysis: 'Analyse de Fraîcheur par IA',
    smartShopping: 'Décisions d\'achat intelligentes et réduction des déchets grâce au scan IA',
    readyToReduce: 'Prêt à réduire le gaspillage alimentaire et faire des choix plus intelligents?',
    startSession: 'Démarrez une session de scan pour analyser la fraîcheur et obtenir des recommandations personnalisées',
    
    // Camera
    positionFruits: 'Positionnez les fruits dans le cadre',
    ensureGoodLighting: 'Assurez-vous d\'avoir un bon éclairage pour de meilleurs résultats',
    ready: 'Prêt',
    loading: 'Chargement...',
    
    // Analysis
    analyzingFruit: 'Analyse de votre fruit...',
    aiScanning: 'L\'IA scanne la fraîcheur et la qualité',
    detectingFruits: 'Détection des fruits individuels',
    analyzingColor: 'Analyse de la couleur et de la texture',
    calculatingFreshness: 'Calcul des scores de fraîcheur',
    thisMayTake: 'Cela peut prendre 10-30 secondes',
    
    // Results
    freshnessAnalysis: 'Analyse de Fraîcheur',
    itemsAnalyzed: 'Articles Analysés',
    fresh: 'Frais',
    freshnessScore: 'Score de Fraîcheur',
    tapForDetails: 'Touchez pour les détails',
    analyzedItems: 'Articles Analysés',
    addMore: 'Ajouter Plus',
    scanAnother: 'Scanner un Autre',
    backToMain: 'Retour au Principal',
    storageTips: 'Conseils de Stockage',
    qualityAssessment: 'Évaluation de Qualité',
    color: 'Couleur',
    texture: 'Texture',
    blemishes: 'Taches',
    ripeness: 'Maturité',
    
    // Dashboard
    dashboard: 'Tableau de Bord',
    totalScans: 'Scans Totaux',
    itemsAnalyzedShort: 'Articles analysés',
    qualityScore: 'Score de Qualité',
    avgFreshness: 'Fraîcheur moyenne',
    recentActivity: 'Activité Récente',
    recentScans: 'Scans récents',
    topFreshItems: '🏆 Articles les Plus Frais',
    rankedByFreshness: 'Classé par fraîcheur',
    noScansYet: 'Aucun scan encore',
    startAnalyzing: 'Commencez à analyser la fraîcheur des fruits pour voir votre historique ici',
    startFirstScan: 'Commencer le Premier Scan',
    
    // Quality levels
    excellent: 'Excellent',
    good: 'Bon',
    fair: 'Correct',
    
    // Recommendations
    buy: 'Acheter',
    check: 'Vérifier',
    avoid: 'Éviter',
    
    // Time
    daysLeft: 'jours restants',
    items: 'articles'
  },
  
  zh: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'AI驱动的新鲜度扫描器',
    quickScan: '快速扫描',
    viewDashboard: '查看仪表板',
    viewAnalytics: '查看分析',
    startScanningNow: '现在开始扫描',
    aiPoweredAnalysis: 'AI驱动的新鲜度分析',
    smartShopping: '通过AI扫描做出明智的购物决策并减少浪费',
    readyToReduce: '准备好减少食物浪费并做出更明智的选择了吗？',
    startSession: '开始扫描会话以分析新鲜度并获得个性化建议',
    
    // Camera
    positionFruits: '将水果放在框架内',
    ensureGoodLighting: '确保良好的照明以获得最佳效果',
    ready: '准备好',
    loading: '加载中...',
    
    // Analysis
    analyzingFruit: '正在分析您的水果...',
    aiScanning: 'AI正在扫描新鲜度和质量',
    detectingFruits: '检测个别水果',
    analyzingColor: '分析颜色和质地',
    calculatingFreshness: '计算新鲜度分数',
    thisMayTake: '这可能需要10-30秒',
    
    // Results
    freshnessAnalysis: '新鲜度分析',
    itemsAnalyzed: '已分析项目',
    fresh: '新鲜',
    freshnessScore: '新鲜度分数',
    tapForDetails: '点击查看详细分解',
    analyzedItems: '已分析项目',
    addMore: '添加更多',
    scanAnother: '扫描另一个',
    backToMain: '返回主页',
    storageTips: '存储提示',
    qualityAssessment: '质量评估',
    color: '颜色',
    texture: '质地',
    blemishes: '瑕疵',
    ripeness: '成熟度',
    
    // Dashboard
    dashboard: '仪表板',
    totalScans: '总扫描次数',
    itemsAnalyzedShort: '已分析项目',
    qualityScore: '质量分数',
    avgFreshness: '平均新鲜度',
    recentActivity: '最近活动',
    recentScans: '最近扫描',
    topFreshItems: '🏆 最新鲜项目',
    rankedByFreshness: '按新鲜度排名',
    noScansYet: '还没有扫描',
    startAnalyzing: '开始分析水果新鲜度以在此查看您的历史记录',
    startFirstScan: '开始第一次扫描',
    
    // Quality levels
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    
    // Recommendations
    buy: '购买',
    check: '检查',
    avoid: '避免',
    
    // Time
    daysLeft: '剩余天数',
    items: '项目'
  },
  
  ja: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'AI駆動フレッシュネススキャナー',
    quickScan: 'クイックスキャン',
    viewDashboard: 'ダッシュボードを見る',
    viewAnalytics: '分析を見る',
    startScanningNow: '今すぐスキャンを開始',
    aiPoweredAnalysis: 'AI駆動フレッシュネス分析',
    smartShopping: 'AIスキャンによるスマートな買い物決定と廃棄物削減',
    readyToReduce: '食品廃棄物を減らし、より賢い選択をする準備はできていますか？',
    startSession: 'フレッシュネスを分析し、パーソナライズされた推奨事項を取得するためにスキャンセッションを開始してください',
    
    // Camera  
    positionFruits: 'フレーム内に果物を配置してください',
    ensureGoodLighting: '最良の結果を得るために良い照明を確保してください',
    ready: '準備完了',
    loading: '読み込み中...',
    
    // Analysis
    analyzingFruit: '果物を分析中...',
    aiScanning: 'AIがフレッシュネスと品質をスキャンしています',
    detectingFruits: '個別の果物を検出中',
    analyzingColor: '色と質感を分析中',
    calculatingFreshness: 'フレッシュネススコアを計算中',
    thisMayTake: 'これには10-30秒かかる場合があります',
    
    // Results
    freshnessAnalysis: 'フレッシュネス分析',
    itemsAnalyzed: '分析済みアイテム',
    fresh: 'フレッシュ',
    freshnessScore: 'フレッシュネススコア',
    tapForDetails: '詳細な内訳をタップ',
    analyzedItems: '分析済みアイテム',
    addMore: '追加',
    scanAnother: '別のスキャン',
    backToMain: 'メインに戻る',
    storageTips: '保存のヒント',
    qualityAssessment: '品質評価',
    color: '色',
    texture: '質感',
    blemishes: 'しみ',
    ripeness: '熟度',
    
    // Dashboard
    dashboard: 'ダッシュボード',
    totalScans: '総スキャン数',
    itemsAnalyzedShort: '分析済みアイテム',
    qualityScore: '品質スコア',
    avgFreshness: '平均フレッシュネス',
    recentActivity: '最近のアクティビティ',
    recentScans: '最近のスキャン',
    topFreshItems: '🏆 最もフレッシュなアイテム',
    rankedByFreshness: 'フレッシュネス順にランク付け',
    noScansYet: 'まだスキャンがありません',
    startAnalyzing: '果物のフレッシュネス分析を開始して、ここで履歴を確認してください',
    startFirstScan: '最初のスキャンを開始',
    
    // Quality levels
    excellent: '優秀',
    good: '良い',
    fair: '普通',
    
    // Recommendations
    buy: '購入',
    check: 'チェック',
    avoid: '避ける',
    
    // Time
    daysLeft: '残り日数',
    items: 'アイテム'
  }
};

// Enhanced language detection based on browser locale, timezone, and geolocation
export async function detectUserLanguage(): Promise<string> {
  if (typeof window === 'undefined') return 'en';
  
  // Get browser language
  const browserLang = navigator.language.toLowerCase();
  
  // Get timezone to help with region detection
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Enhanced language mapping
  const languageMap: { [key: string]: string } = {
    // English variants
    'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-ca': 'en', 'en-au': 'en', 'en-nz': 'en', 'en-za': 'en',
    
    // Spanish variants - covers more regions
    'es': 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es', 'es-co': 'es', 'es-pe': 'es', 
    'es-cl': 'es', 'es-ve': 'es', 'es-ec': 'es', 'es-uy': 'es', 'es-py': 'es', 'es-bo': 'es',
    'es-cr': 'es', 'es-pa': 'es', 'es-gt': 'es', 'es-ni': 'es', 'es-hn': 'es', 'es-sv': 'es',
    
    // French variants
    'fr': 'fr', 'fr-fr': 'fr', 'fr-ca': 'fr', 'fr-be': 'fr', 'fr-ch': 'fr', 'fr-lu': 'fr', 'fr-mc': 'fr',
    
    // Chinese variants
    'zh': 'zh', 'zh-cn': 'zh', 'zh-tw': 'zh', 'zh-hk': 'zh', 'zh-sg': 'zh', 'zh-mo': 'zh',
    
    // Japanese
    'ja': 'ja', 'ja-jp': 'ja'
  };
  
  // First try exact match
  if (languageMap[browserLang]) {
    console.log(`Language detected from browser: ${browserLang} -> ${languageMap[browserLang]}`);
    return languageMap[browserLang];
  }
  
  // Try language code only (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0];
  if (languageMap[langCode]) {
    console.log(`Language detected from browser code: ${langCode} -> ${languageMap[langCode]}`);
    return languageMap[langCode];
  }
  
  // Enhanced timezone-based region detection
  const timezoneMap: { [key: string]: string } = {
    // Americas - Spanish speaking countries
    'America/Mexico_City': 'es', 'America/Cancun': 'es', 'America/Merida': 'es',
    'America/Bogota': 'es', 'America/Lima': 'es', 'America/Santiago': 'es',
    'America/Buenos_Aires': 'es', 'America/Cordoba': 'es', 'America/Mendoza': 'es',
    'America/Caracas': 'es', 'America/Montevideo': 'es', 'America/Asuncion': 'es',
    'America/La_Paz': 'es', 'America/Quito': 'es', 'America/Guayaquil': 'es',
    'America/Panama': 'es', 'America/Costa_Rica': 'es', 'America/Guatemala': 'es',
    'America/Tegucigalpa': 'es', 'America/Managua': 'es', 'America/El_Salvador': 'es',
    'America/Havana': 'es', 'America/Santo_Domingo': 'es',
    
    // Europe - French speaking regions
    'Europe/Paris': 'fr', 'Europe/Brussels': 'fr', 'Europe/Luxembourg': 'fr',
    'Europe/Zurich': 'fr', 'Europe/Geneva': 'fr', 'Europe/Monaco': 'fr',
    
    // Asia-Pacific - Chinese speaking regions
    'Asia/Shanghai': 'zh', 'Asia/Beijing': 'zh', 'Asia/Chongqing': 'zh', 'Asia/Urumqi': 'zh',
    'Asia/Hong_Kong': 'zh', 'Asia/Macau': 'zh', 'Asia/Taipei': 'zh',
    'Asia/Singapore': 'zh', // Singapore has multiple languages but Chinese is common
    
    // Asia - Japanese
    'Asia/Tokyo': 'ja', 'Asia/Osaka': 'ja'
  };
  
  if (timezoneMap[timezone]) {
    console.log(`Language detected from timezone: ${timezone} -> ${timezoneMap[timezone]}`);
    return timezoneMap[timezone];
  }
  
  // Try to get more precise location using Geolocation API (optional, with user permission)
  try {
    const position = await getCurrentPosition();
    const language = await detectLanguageFromCoordinates(position.coords.latitude, position.coords.longitude);
    if (language) {
      console.log(`Language detected from geolocation: ${language}`);
      return language;
    }
  } catch (error) {
    console.log('Geolocation not available or permission denied');
  }
  
  console.log('Using default language: en');
  return 'en';
}

// Helper function to promisify geolocation
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 5000,
      maximumAge: 300000, // 5 minutes
      enableHighAccuracy: false
    });
  });
}

// Detect language based on approximate geographic coordinates
async function detectLanguageFromCoordinates(lat: number, lng: number): Promise<string | null> {
  // Rough geographic boundaries for language detection
  // This is a simplified approach - in production, you'd use a proper geocoding service
  
  // Spanish-speaking regions (rough boundaries)
  if (
    // Mexico
    (lat >= 14.5 && lat <= 32.7 && lng >= -118.4 && lng <= -86.7) ||
    // Central America
    (lat >= 7.2 && lat <= 18.5 && lng >= -92.2 && lng <= -77.2) ||
    // South America (Spanish-speaking countries)
    (lat >= -56.0 && lat <= 12.5 && lng >= -81.3 && lng <= -34.8)
  ) {
    return 'es';
  }
  
  // French-speaking regions
  if (
    // France
    (lat >= 41.3 && lat <= 51.1 && lng >= -5.1 && lng <= 9.6) ||
    // Quebec, Canada (rough)
    (lat >= 45.0 && lat <= 62.6 && lng >= -79.8 && lng <= -57.1) ||
    // Belgium/Luxembourg area
    (lat >= 49.4 && lat <= 51.5 && lng >= 2.5 && lng <= 6.4)
  ) {
    return 'fr';
  }
  
  // Chinese-speaking regions
  if (
    // Mainland China
    (lat >= 18.2 && lat <= 53.6 && lng >= 73.5 && lng <= 135.1) ||
    // Taiwan
    (lat >= 21.9 && lat <= 25.3 && lng >= 120.0 && lng <= 122.0) ||
    // Hong Kong
    (lat >= 22.1 && lat <= 22.6 && lng >= 113.8 && lng <= 114.4) ||
    // Singapore
    (lat >= 1.2 && lat <= 1.5 && lng >= 103.6 && lng <= 104.0)
  ) {
    return 'zh';
  }
  
  // Japanese regions
  if (lat >= 24.0 && lat <= 46.0 && lng >= 123.0 && lng <= 146.0) {
    return 'ja';
  }
  
  return null;
}

// Synchronous version for backward compatibility
export function detectUserLanguageSync(): string {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const languageMap: { [key: string]: string } = {
    'en': 'en', 'en-us': 'en', 'en-gb': 'en', 'en-ca': 'en', 'en-au': 'en',
    'es': 'es', 'es-es': 'es', 'es-mx': 'es', 'es-ar': 'es', 'es-co': 'es',
    'fr': 'fr', 'fr-fr': 'fr', 'fr-ca': 'fr', 'fr-be': 'fr', 'fr-ch': 'fr',
    'zh': 'zh', 'zh-cn': 'zh', 'zh-tw': 'zh', 'zh-hk': 'zh', 'zh-sg': 'zh',
    'ja': 'ja', 'ja-jp': 'ja'
  };
  
  if (languageMap[browserLang]) return languageMap[browserLang];
  
  const langCode = browserLang.split('-')[0];
  if (languageMap[langCode]) return languageMap[langCode];
  
  const timezoneMap: { [key: string]: string } = {
    'America/Mexico_City': 'es', 'America/Bogota': 'es', 'America/Lima': 'es',
    'Europe/Paris': 'fr', 'Europe/Brussels': 'fr', 'Europe/Zurich': 'fr',
    'Asia/Shanghai': 'zh', 'Asia/Beijing': 'zh', 'Asia/Hong_Kong': 'zh',
    'Asia/Tokyo': 'ja', 'Asia/Osaka': 'ja'
  };
  
  return timezoneMap[timezone] || 'en';
}

// Get translation function
export function getTranslation(language: string, key: string): string {
  const lang = translations[language] || translations.en;
  return lang[key] || translations.en[key] || key;
}

// Create translation hook-like function
export function createTranslator(language: string) {
  return (key: string): string => getTranslation(language, key);
}