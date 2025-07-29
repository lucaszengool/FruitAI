export interface Translations {
  // Common
  loading: string;
  error: string;
  close: string;
  back: string;
  next: string;
  complete: string;
  
  // Main App
  appTitle: string;
  appSubtitle: string;
  
  // Modes
  storeSession: string;
  fridgeCheck: string;
  pantryCheck: string;
  dashboard: string;
  
  // Mode Descriptions
  storeSessionDesc: string;
  fridgeCheckDesc: string;
  pantryCheckDesc: string;
  
  // Scanning
  scanningTitle: string;
  stabilizeCamera: string;
  detectingItems: string;
  analyzing: string;
  foundItems: string;
  tapToCapture: string;
  autoCapturing: string;
  
  // Results
  freshness: string;
  recommendation: string;
  buy: string;
  check: string;
  avoid: string;
  confidence: string;
  
  // Summary
  sessionSummary: string;
  itemsScanned: string;
  averageFreshness: string;
  recommendations: string;
  
  // Actions
  startSession: string;
  completeSession: string;
  clearAll: string;
  viewHistory: string;
  
  // Recommendations
  buyRecommended: string;
  checkCarefully: string;
  avoidItem: string;
}

const translations: Record<string, Translations> = {
  'en': {
    // Common
    loading: 'Loading...',
    error: 'Error',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    complete: 'Complete',
    
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'AI-Powered Freshness Scanner',
    
    // Modes
    storeSession: 'Store Session',
    fridgeCheck: 'Fridge Check',
    pantryCheck: 'Pantry Scan',
    dashboard: 'Dashboard',
    
    // Mode Descriptions
    storeSessionDesc: 'Scan multiple items while shopping to compare freshness and make the best choices',
    fridgeCheckDesc: 'Monitor what needs to be used soon and track freshness of stored produce',
    pantryCheckDesc: 'Keep track of stored items and get alerts when they need attention',
    
    // Scanning
    scanningTitle: 'Scanning Session',
    stabilizeCamera: 'Hold camera steady to detect items',
    detectingItems: 'Detecting items...',
    analyzing: 'Analyzing freshness...',
    foundItems: 'Found {count} items',
    tapToCapture: 'Tap to capture',
    autoCapturing: 'Auto-capturing in {seconds}s',
    
    // Results
    freshness: 'Freshness',
    recommendation: 'Recommendation',
    buy: 'Buy',
    check: 'Check',
    avoid: 'Avoid',
    confidence: 'Confidence',
    
    // Summary
    sessionSummary: 'Session Summary',
    itemsScanned: 'Items Scanned',
    averageFreshness: 'Average Freshness',
    recommendations: 'Recommendations',
    
    // Actions
    startSession: 'Start Session',
    completeSession: 'Complete Session',
    clearAll: 'Clear All',
    viewHistory: 'View History',
    
    // Recommendations
    buyRecommended: 'Recommended to Buy',
    checkCarefully: 'Check Carefully',
    avoidItem: 'Avoid This Item',
  },
  
  'zh': {
    // Common
    loading: '加载中...',
    error: '错误',
    close: '关闭',
    back: '返回',
    next: '下一步',
    complete: '完成',
    
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'AI智能新鲜度扫描器',
    
    // Modes
    storeSession: '商店扫描',
    fridgeCheck: '冰箱检查',
    pantryCheck: '储藏室扫描',
    dashboard: '仪表板',
    
    // Mode Descriptions
    storeSessionDesc: '购物时扫描多个商品，比较新鲜度，做出最佳选择',
    fridgeCheckDesc: '监控需要尽快使用的物品，跟踪储存农产品的新鲜度',
    pantryCheckDesc: '跟踪储存物品，在需要注意时获得提醒',
    
    // Scanning
    scanningTitle: '扫描会话',
    stabilizeCamera: '保持相机稳定以检测物品',
    detectingItems: '正在检测物品...',
    analyzing: '正在分析新鲜度...',
    foundItems: '发现 {count} 个物品',
    tapToCapture: '点击拍摄',
    autoCapturing: '{seconds}秒后自动拍摄',
    
    // Results
    freshness: '新鲜度',
    recommendation: '建议',
    buy: '购买',
    check: '检查',
    avoid: '避免',
    confidence: '置信度',
    
    // Summary
    sessionSummary: '会话摘要',
    itemsScanned: '已扫描物品',
    averageFreshness: '平均新鲜度',
    recommendations: '建议',
    
    // Actions
    startSession: '开始会话',
    completeSession: '完成会话',
    clearAll: '清除全部',
    viewHistory: '查看历史',
    
    // Recommendations
    buyRecommended: '推荐购买',
    checkCarefully: '仔细检查',
    avoidItem: '避免此物品',
  },
  
  'es': {
    // Common
    loading: 'Cargando...',
    error: 'Error',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    complete: 'Completar',
    
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'Escáner de Frescura con IA',
    
    // Modes
    storeSession: 'Sesión de Tienda',
    fridgeCheck: 'Revisar Nevera',
    pantryCheck: 'Escanear Despensa',
    dashboard: 'Panel',
    
    // Mode Descriptions
    storeSessionDesc: 'Escanea múltiples artículos mientras compras para comparar frescura y hacer las mejores elecciones',
    fridgeCheckDesc: 'Monitorea lo que necesita usarse pronto y rastrea la frescura de productos almacenados',
    pantryCheckDesc: 'Mantén registro de artículos almacenados y recibe alertas cuando necesiten atención',
    
    // Scanning
    scanningTitle: 'Sesión de Escaneo',
    stabilizeCamera: 'Mantén la cámara estable para detectar artículos',
    detectingItems: 'Detectando artículos...',
    analyzing: 'Analizando frescura...',
    foundItems: 'Se encontraron {count} artículos',
    tapToCapture: 'Toca para capturar',
    autoCapturing: 'Auto-capturando en {seconds}s',
    
    // Results
    freshness: 'Frescura',
    recommendation: 'Recomendación',
    buy: 'Comprar',
    check: 'Revisar',
    avoid: 'Evitar',
    confidence: 'Confianza',
    
    // Summary
    sessionSummary: 'Resumen de Sesión',
    itemsScanned: 'Artículos Escaneados',
    averageFreshness: 'Frescura Promedio',
    recommendations: 'Recomendaciones',
    
    // Actions
    startSession: 'Iniciar Sesión',
    completeSession: 'Completar Sesión',
    clearAll: 'Limpiar Todo',
    viewHistory: 'Ver Historial',
    
    // Recommendations
    buyRecommended: 'Recomendado Comprar',
    checkCarefully: 'Revisar Cuidadosamente',
    avoidItem: 'Evitar Este Artículo',
  },
  
  'fr': {
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    complete: 'Terminer',
    
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'Scanner de Fraîcheur IA',
    
    // Modes
    storeSession: 'Session Magasin',
    fridgeCheck: 'Vérifier Frigo',
    pantryCheck: 'Scanner Garde-manger',
    dashboard: 'Tableau de bord',
    
    // Mode Descriptions
    storeSessionDesc: 'Scannez plusieurs articles en faisant vos courses pour comparer la fraîcheur et faire les meilleurs choix',
    fridgeCheckDesc: 'Surveillez ce qui doit être utilisé bientôt et suivez la fraîcheur des produits stockés',
    pantryCheckDesc: 'Gardez une trace des articles stockés et recevez des alertes quand ils ont besoin d\'attention',
    
    // Scanning
    scanningTitle: 'Session de Scan',
    stabilizeCamera: 'Tenez la caméra stable pour détecter les articles',
    detectingItems: 'Détection d\'articles...',
    analyzing: 'Analyse de la fraîcheur...',
    foundItems: '{count} articles trouvés',
    tapToCapture: 'Toucher pour capturer',
    autoCapturing: 'Auto-capture dans {seconds}s',
    
    // Results
    freshness: 'Fraîcheur',
    recommendation: 'Recommandation',
    buy: 'Acheter',
    check: 'Vérifier',
    avoid: 'Éviter',
    confidence: 'Confiance',
    
    // Summary
    sessionSummary: 'Résumé de Session',
    itemsScanned: 'Articles Scannés',
    averageFreshness: 'Fraîcheur Moyenne',
    recommendations: 'Recommandations',
    
    // Actions
    startSession: 'Commencer Session',
    completeSession: 'Terminer Session',
    clearAll: 'Tout Effacer',
    viewHistory: 'Voir Historique',
    
    // Recommendations
    buyRecommended: 'Recommandé d\'Acheter',
    checkCarefully: 'Vérifier Soigneusement',
    avoidItem: 'Éviter Cet Article',
  }
};

// Get browser locale and return corresponding translations
export function getTranslations(): Translations {
  if (typeof window === 'undefined') {
    return translations['en']; // Default for SSR
  }
  
  const locale = navigator.language.toLowerCase();
  
  // Match primary language code
  if (locale.startsWith('zh')) {
    return translations['zh'];
  } else if (locale.startsWith('es')) {
    return translations['es'];
  } else if (locale.startsWith('fr')) {
    return translations['fr'];
  }
  
  return translations['en']; // Default fallback
}

// Format translation strings with parameters
export function formatTranslation(template: string, params: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}