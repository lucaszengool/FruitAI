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
    appSubtitle: 'Smart Shopping Assistant',
    quickScan: 'Scan Produce',
    viewDashboard: 'View Dashboard',
    viewAnalytics: 'View Analytics',
    startScanningNow: 'Start Scanning Now',
    aiPoweredAnalysis: 'Start Scanning Your Fruits and Vegetables',
    smartShopping: 'Never buy spoiled groceries again! Use our AI model to scan fruits and vegetables while shopping to instantly check freshness and get smart recommendations. Perfect for checking what\'s in your refrigerator too.',
    readyToReduce: 'Ready to make smarter grocery choices?',
    startSession: 'Start a scanning session to analyze freshness and get personalized recommendations',
    
    // Camera
    positionFruits: 'Position fruits within the frame',
    ensureGoodLighting: 'Ensure good lighting for best results',
    ready: 'Ready',
    loading: 'Loading...',
    
    // Analysis
    analyzingFruit: 'Analyzing your produce...',
    aiScanning: 'AI is scanning for freshness and quality',
    detectingFruits: 'Detecting individual items',
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
    items: 'items',
    
    // Feature Labels
    smartShoppingFeature: 'Smart Shopping',
    instantCheckFeature: 'Instant Check',
    fridgeHelperFeature: 'Fridge Helper',
    
    // Additional analysis page translations
    analysisComplete: 'Analysis Complete',
    itemAnalyzed: 'item analyzed',
    confidenceLevel: 'confidence',
    nutritionHighlights: 'Nutrition Highlights',
    vitamins: 'Vitamins',
    fiber: 'Fiber',
    minerals: 'Minerals',
    benefits: 'Benefits',
    highInVitaminC: 'High in Vitamin C, Vitamin A',
    fiberContent: '4.4g per medium apple',
    potassiumCalcium: 'Potassium, Calcium',
    heartHealthDigestive: 'Heart health, digestive support',
    storageAdvice: 'Store in refrigerator crisper drawer for up to 2 weeks. Keep away from other fruits that produce ethylene gas.',
    vibrantRed: 'Vibrant red',
    crispFirm: 'Crisp & firm',
    noneVisible: 'None visible',
    perfect: 'Perfect',
    
    // Dashboard specific
    fruitaiDashboard: 'FruitAI Dashboard',
    totalItemsAnalyzed: 'Total items analyzed',
    
    // Specific analysis values
    redWithPatches: 'Red with yellow and brown patches',
    wrinkledSoft: 'Wrinkled and soft', 
    visibleBlemishes: 'Visible blemishes and discoloration',
    overripe: 'Overripe',
    notRecommendedStorage: 'Not recommended for storage',
    storeInRefrigerator: 'Store in refrigerator crisper drawer for up to 2 weeks',
    
    // Common fruit conditions
    ripe: 'Ripe',
    unripe: 'Unripe',
    firm: 'Firm',
    soft: 'Soft',
    crisp: 'Crisp',
    wrinkled: 'Wrinkled',
    smooth: 'Smooth',
    red: 'Red',
    green: 'Green',
    yellow: 'Yellow',
    brown: 'Brown',
    patches: 'patches',
    blemished: 'Blemished',
    unblemished: 'Unblemished',
    
    // Nutrition labels
    netCarbs: 'Net Carbs',
    sugar: 'Sugar',
    sodium: 'Sodium',
    protein: 'Protein',
    carbs: 'Carbs',
    fats: 'Fats',
    
    // Quality descriptions
    goodQuality: 'Good',
    excellentQuality: 'Excellent',
    fairQuality: 'Fair',
    poorQuality: 'Poor',
    veryGood: 'Very Good!',
    decentQuality: 'Decent quality with some beneficial nutrients. Consider consuming soon for best quality.',
    excellentQualityDesc: 'Excellent quality with high nutritional value. Perfect for immediate consumption.',
    fairQualityDesc: 'Fair quality with moderate nutritional value. Use within a few days.',
    poorQualityDesc: 'Poor quality with limited nutritional value. Not recommended for consumption.',
    highNutrients: 'High in beneficial nutrients and very supportive of overall health. It can be a regular part of a healthy diet.',
    
    // Storage recommendations
    storeCoolDry: 'Store in a cool, dry place or refrigerate to extend freshness.',
    
    // Texture combinations
    deepRed: 'Deep red',
    smoothAndFirm: 'Smooth and firm',
    perfectlyRipe: 'Perfectly ripe',
    fullyRipe: 'Fully ripe',
    andGlossy: 'and glossy',
    processed: 'Processed',
    minimalAdditives: 'Contains minimal additives or preservatives, no artificial sweeteners, dyes, or seed oils.',
    smoothAndGlossy: 'Smooth and glossy',
    glossy: 'glossy',
    needsAttention: 'Needs Attention',
    qualityDeclining: 'Quality is declining. Inspect carefully before consuming or consider avoiding.',
    
    // Fruit and vegetable names
    apple: 'Apple',
    banana: 'Banana',
    orange: 'Orange',
    strawberry: 'Strawberry',
    grape: 'Grape',
    carrot: 'Carrot',
    broccoli: 'Broccoli',
    tomato: 'Tomato',
    lettuce: 'Lettuce',
    spinach: 'Spinach',
    
    // Updated UI text to include vegetables
    fruitsAndVegetables: 'Fruits & Vegetables',
    analyzeProduceInstantly: 'Analyze produce instantly',
    fruitVegetableScanning: 'Fruit & Vegetable Scanning',
    scanProduce: 'Scan Produce',
    
    // Scan limit messages
    unlockMoreScans: 'Unlock More Scans!',
    freeScansUsedUp: 'Daily Scans Used Up!',
    remainingScansMessage: 'You have {count} non-user scans remaining. Sign up to get unlimited scans and more features!',
    freeScansUsedMessage: 'You\'ve used all {count} non-user scans. Sign up to continue unlimited scanning and unlock premium features!',
    signUpFree: 'Sign Up - It\'s Free!',
    alreadyHaveAccount: 'Already have an account? Sign In',
    continueWithFreeScans: 'Continue with {count} unlimited scans',
    unlimitedScans: 'Unlimited fruit scans',
    detailedNutrition: 'Detailed nutrition analysis',
    personalHistory: 'Personal scan history & insights',
    
    // Shopping and fridge management
    shoppingDecision: 'Shopping Decision',
    recommendation: 'Recommendation',
    priceValue: 'Price Value',
    goodValue: 'Good Value',
    considerPrice: 'Consider Price',
    perfectForPurchase: 'Perfect quality for purchase. This item will provide excellent value and last well.',
    inspectBeforeBuying: 'Acceptable quality. Inspect carefully and plan to use within a few days.',
    notRecommendedToBuy: 'Quality concerns detected. Consider looking for fresher alternatives.',
    fridgeManagement: 'Fridge Management',
    estimatedShelfLife: 'Estimated Shelf Life',
    consumeBy: 'Best Consumed By',
    consumeSoon: 'Consume soon for best quality',
    healthBenefits: 'Health Benefits',
    
    // Health benefits
    providesAntioxidants: 'Provides antioxidants and nutrients',
    richInVitamins: 'Rich in vitamins and minerals that support immune system and overall health',
    highFiberBenefits: 'High fiber content aids digestion and helps maintain healthy cholesterol levels',
    naturalEnergySource: 'Natural source of energy from healthy sugars and carbohydrates',
    
    // Complex descriptive phrases
    withA: 'with a',
    finish: 'finish',
    deepRedGlossy: 'Deep red with a glossy finish',
    howScoreCalculated: 'Click to see how the freshness score is calculated'
  },
  
  es: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'Asistente de Compras Inteligente',
    quickScan: 'Escanear Productos',
    viewDashboard: 'Ver Panel',
    viewAnalytics: 'Ver Análisis',
    startScanningNow: 'Comenzar Escaneo Ahora',
    aiPoweredAnalysis: 'Compras Inteligentes',
    smartShopping: '¡Nunca más compres productos en mal estado! Escanea frutas y verduras mientras compras para verificar la frescura al instante y obtener recomendaciones inteligentes. Perfecto también para verificar lo que tienes en el refrigerador.',
    readyToReduce: '¿Listo para tomar decisiones de compra más inteligentes?',
    startSession: 'Inicia una sesión de escaneo para analizar la frescura y obtener recomendaciones personalizadas',
    
    // Camera
    positionFruits: 'Posiciona las frutas dentro del marco',
    ensureGoodLighting: 'Asegúrate de tener buena iluminación para mejores resultados',
    ready: 'Listo',
    loading: 'Cargando...',
    
    // Analysis
    analyzingFruit: 'Analizando tu producto...',
    aiScanning: 'La IA está escaneando la frescura y calidad',
    detectingFruits: 'Detectando elementos individuales',
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
    items: 'artículos',
    
    // Feature Labels
    smartShoppingFeature: 'Compras Inteligentes',
    instantCheckFeature: 'Verificación Instantánea',
    fridgeHelperFeature: 'Asistente de Refrigerador',
    
    // Additional analysis page translations
    analysisComplete: 'Análisis Completo',
    itemAnalyzed: 'artículo analizado',
    confidenceLevel: 'confianza',
    nutritionHighlights: 'Destacados Nutricionales',
    vitamins: 'Vitaminas',
    fiber: 'Fibra',
    minerals: 'Minerales',
    benefits: 'Beneficios',
    highInVitaminC: 'Alto en Vitamina C, Vitamina A',
    fiberContent: '4.4g por manzana mediana',
    potassiumCalcium: 'Potasio, Calcio',
    heartHealthDigestive: 'Salud cardíaca, apoyo digestivo',
    storageAdvice: 'Almacenar en el cajón para verduras del refrigerador hasta por 2 semanas. Mantener alejado de otras frutas que producen gas etileno.',
    vibrantRed: 'Rojo vibrante',
    crispFirm: 'Crujiente y firme',
    noneVisible: 'Ninguna visible',
    perfect: 'Perfecto',
    
    // Dashboard specific
    fruitaiDashboard: 'Panel FruitAI',
    totalItemsAnalyzed: 'Total de artículos analizados',
    
    // Specific analysis values
    redWithPatches: 'Rojo con manchas amarillas y marrones',
    wrinkledSoft: 'Arrugado y blando', 
    visibleBlemishes: 'Manchas visibles y decoloración',
    overripe: 'Demasiado maduro',
    notRecommendedStorage: 'No recomendado para almacenamiento',
    storeInRefrigerator: 'Almacenar en el cajón para verduras del refrigerador hasta por 2 semanas',
    
    // Common fruit conditions
    ripe: 'Maduro',
    unripe: 'Verde',
    firm: 'Firme',
    soft: 'Blando',
    crisp: 'Crujiente',
    wrinkled: 'Arrugado',
    smooth: 'Suave',
    red: 'Rojo',
    green: 'Verde',
    yellow: 'Amarillo',
    brown: 'Marrón',
    patches: 'manchas',
    blemished: 'Con manchas',
    unblemished: 'Sin manchas',
    
    // Nutrition labels
    netCarbs: 'Carbohidratos Netos',
    sugar: 'Azúcar',
    sodium: 'Sodio',
    protein: 'Proteína',
    carbs: 'Carbohidratos',
    fats: 'Grasas',
    
    // Quality descriptions
    goodQuality: 'Bueno',
    excellentQuality: 'Excelente',
    fairQuality: 'Regular',
    poorQuality: 'Malo',
    decentQuality: 'Calidad decente con algunos nutrientes beneficiosos. Considere consumir pronto para mejor calidad.',
    excellentQualityDesc: 'Excelente calidad con alto valor nutricional. Perfecto para consumo inmediato.',
    fairQualityDesc: 'Calidad regular con valor nutricional moderado. Usar en pocos días.',
    poorQualityDesc: 'Mala calidad con valor nutricional limitado. No recomendado para consumo.',
    
    // Fruit and vegetable names
    apple: 'Manzana',
    banana: 'Plátano',
    orange: 'Naranja',
    strawberry: 'Fresa',
    grape: 'Uva',
    carrot: 'Zanahoria',
    broccoli: 'Brócoli',
    tomato: 'Tomate',
    lettuce: 'Lechuga',
    spinach: 'Espinaca',
    
    // Updated UI text to include vegetables
    fruitsAndVegetables: 'Frutas y Verduras',
    analyzeProduceInstantly: 'Analizar productos al instante',
    fruitVegetableScanning: 'Escaneo de Frutas y Verduras',
    scanProduce: 'Escanear Productos',
    
    // Scan limit messages  
    unlockMoreScans: '¡Desbloquea Más Escaneos!',
    freeScansUsedUp: '¡Escaneos Gratuitos Agotados!',
    remainingScansMessage: 'Te quedan {count} escaneos gratuitos. ¡Regístrate para obtener escaneos ilimitados y más funciones!',
    freeScansUsedMessage: 'Has usado todos los {count} escaneos gratuitos. ¡Regístrate para continuar escaneando y desbloquear funciones premium!',
    signUpFree: '¡Regístrate - Es Gratis!',
    alreadyHaveAccount: '¿Ya tienes una cuenta? Inicia Sesión',
    continueWithFreeScans: 'Continuar con {count} escaneos gratuitos',
    unlimitedScans: 'Escaneos ilimitados de frutas',
    detailedNutrition: 'Análisis nutricional detallado',
    personalHistory: 'Historial personal de escaneos e información',
    
    // Additional quality scores and storage
    veryGood: '¡Muy Bueno!',
    highNutrients: 'Alto en nutrientes beneficiosos y muy favorable para la salud general. Puede ser parte regular de una dieta saludable.',
    storeCoolDry: 'Almacenar en un lugar fresco y seco o refrigerar para extender la frescura.',
    deepRed: 'Rojo intenso',
    smoothAndFirm: 'Suave y firme',
    perfectlyRipe: 'Perfectamente maduro',
    fullyRipe: 'Completamente maduro',
    andGlossy: 'y brillante',
    processed: 'Procesado',
    minimalAdditives: 'Contiene aditivos o conservantes mínimos, sin edulcorantes artificiales, colorantes o aceites de semillas.',
    smoothAndGlossy: 'Suave y brillante',
    glossy: 'brillante',
    needsAttention: 'Necesita Atención',
    qualityDeclining: 'La calidad está disminuyendo. Inspeccione cuidadosamente antes de consumir o considere evitar.',
    
    // Shopping and fridge management
    shoppingDecision: 'Decisión de Compra',
    recommendation: 'Recomendación',
    priceValue: 'Relación Calidad-Precio',
    goodValue: 'Buen Valor',
    considerPrice: 'Considerar Precio',
    perfectForPurchase: 'Calidad perfecta para comprar. Este artículo proporcionará un excelente valor y durará bien.',
    inspectBeforeBuying: 'Calidad aceptable. Inspeccione cuidadosamente y planee usar dentro de unos días.',
    notRecommendedToBuy: 'Se detectaron problemas de calidad. Considere buscar alternativas más frescas.',
    fridgeManagement: 'Gestión del Refrigerador',
    estimatedShelfLife: 'Vida Útil Estimada',
    consumeBy: 'Mejor Consumir Antes de',
    consumeSoon: 'Consumir pronto para mejor calidad',
    healthBenefits: 'Beneficios para la Salud',
    
    // Health benefits
    providesAntioxidants: 'Proporciona antioxidantes y nutrientes',
    richInVitamins: 'Rico en vitaminas y minerales que apoyan el sistema inmunológico y la salud general',
    highFiberBenefits: 'El alto contenido de fibra ayuda a la digestión y mantiene niveles saludables de colesterol',
    naturalEnergySource: 'Fuente natural de energía de azúcares y carbohidratos saludables',
    
    // Complex descriptive phrases
    withA: 'con un',
    finish: 'acabado',
    deepRedGlossy: 'Rojo intenso con acabado brillante',
    howScoreCalculated: 'Haz clic para ver cómo se calcula la puntuación de frescura'
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
    analyzingFruit: 'Analyse de votre produit...',
    aiScanning: 'L\'IA scanne la fraîcheur et la qualité',
    detectingFruits: 'Détection des éléments individuels',
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
    items: 'articles',
    
    // Feature Labels
    smartShoppingFeature: 'Achat Intelligent',
    instantCheckFeature: 'Vérification Instantanée',
    fridgeHelperFeature: 'Assistant Frigo',
    
    // Additional analysis page translations
    analysisComplete: 'Analyse Terminée',
    itemAnalyzed: 'article analysé',
    confidenceLevel: 'confiance',
    nutritionHighlights: 'Points Nutritionnels',
    vitamins: 'Vitamines',
    fiber: 'Fibres',
    minerals: 'Minéraux',
    benefits: 'Bénéfices',
    highInVitaminC: 'Riche en Vitamine C, Vitamine A',
    fiberContent: '4,4g par pomme moyenne',
    potassiumCalcium: 'Potassium, Calcium',
    heartHealthDigestive: 'Santé cardiaque, soutien digestif',
    storageAdvice: 'Conserver dans le bac à légumes du réfrigérateur jusqu\'à 2 semaines. Tenir éloigné des autres fruits qui produisent du gaz éthylène.',
    vibrantRed: 'Rouge vibrant',
    crispFirm: 'Croquant et ferme',
    noneVisible: 'Aucune visible',
    perfect: 'Parfait',
    
    // Dashboard specific
    fruitaiDashboard: 'Tableau de Bord FruitAI',
    totalItemsAnalyzed: 'Total d\'articles analysés',
    
    // Specific analysis values
    redWithPatches: 'Rouge avec des taches jaunes et brunes',
    wrinkledSoft: 'Ridé et mou', 
    visibleBlemishes: 'Taches visibles et décoloration',
    overripe: 'Trop mûr',
    notRecommendedStorage: 'Non recommandé pour le stockage',
    storeInRefrigerator: 'Conserver dans le bac à légumes du réfrigérateur jusqu\'à 2 semaines',
    
    // Common fruit conditions
    ripe: 'Mûr',
    unripe: 'Pas mûr',
    firm: 'Ferme',
    soft: 'Mou',
    crisp: 'Croquant',
    wrinkled: 'Ridé',
    smooth: 'Lisse',
    red: 'Rouge',
    green: 'Vert',
    yellow: 'Jaune',
    brown: 'Brun',
    patches: 'taches',
    blemished: 'Taché',
    unblemished: 'Sans taches',
    
    // Nutrition labels
    netCarbs: 'Glucides Nets',
    sugar: 'Sucre',
    sodium: 'Sodium',
    protein: 'Protéine',
    carbs: 'Glucides',
    fats: 'Graisses',
    
    // Quality descriptions
    goodQuality: 'Bon',
    excellentQuality: 'Excellent',
    fairQuality: 'Correct',
    poorQuality: 'Mauvais',
    decentQuality: 'Qualité décente avec quelques nutriments bénéfiques. Considérez consommer bientôt pour la meilleure qualité.',
    excellentQualityDesc: 'Excellente qualité avec une haute valeur nutritionnelle. Parfait pour la consommation immédiate.',
    fairQualityDesc: 'Qualité correcte avec une valeur nutritionnelle modérée. À utiliser dans quelques jours.',
    poorQualityDesc: 'Mauvaise qualité avec une valeur nutritionnelle limitée. Non recommandé pour la consommation.',
    
    // Fruit and vegetable names
    apple: 'Pomme',
    banana: 'Banane',
    orange: 'Orange',
    strawberry: 'Fraise',
    grape: 'Raisin',
    carrot: 'Carotte',
    broccoli: 'Brocoli',
    tomato: 'Tomate',
    lettuce: 'Laitue',
    spinach: 'Épinard',
    
    // Updated UI text to include vegetables
    fruitsAndVegetables: 'Fruits et Légumes',
    analyzeProduceInstantly: 'Analyser les produits instantanément',
    fruitVegetableScanning: 'Scan de Fruits et Légumes',
    scanProduce: 'Scanner les Produits',
    
    // Scan limit messages  
    unlockMoreScans: 'Débloquez Plus de Scans!',
    freeScansUsedUp: 'Scans Gratuits Épuisés!',
    remainingScansMessage: 'Il vous reste {count} scans gratuits. Inscrivez-vous pour obtenir des scans illimités et plus de fonctionnalités!',
    freeScansUsedMessage: 'Vous avez utilisé tous les {count} scans gratuits. Inscrivez-vous pour continuer à scanner et débloquer des fonctionnalités premium!',
    signUpFree: 'S\'inscrire - C\'est Gratuit!',
    alreadyHaveAccount: 'Vous avez déjà un compte? Se Connecter',
    continueWithFreeScans: 'Continuer avec {count} scans gratuits',
    unlimitedScans: 'Scans de fruits illimités',
    detailedNutrition: 'Analyse nutritionnelle détaillée',
    personalHistory: 'Historique personnel de scan et informations',
    
    // Additional quality scores and storage
    veryGood: 'Très Bien!',
    highNutrients: 'Riche en nutriments bénéfiques et très favorable à la santé générale. Peut faire partie régulière d\'une alimentation saine.',
    storeCoolDry: 'Conserver dans un endroit frais et sec ou réfrigérer pour prolonger la fraîcheur.',
    deepRed: 'Rouge profond',
    smoothAndFirm: 'Lisse et ferme',
    perfectlyRipe: 'Parfaitement mûr',
    fullyRipe: 'Complètement mûr',
    andGlossy: 'et brillant',
    processed: 'Transformé',
    minimalAdditives: 'Contient un minimum d\'additifs ou de conservateurs, pas d’édulcorants artificiels, de colorants ou d\'huiles de graines.',
    smoothAndGlossy: 'Lisse et brillant',
    glossy: 'brillant',
    needsAttention: 'Nécessite une Attention',
    qualityDeclining: 'La qualité diminue. Inspectez soigneusement avant de consommer ou envisagez d’éviter.',
    
    // Shopping and fridge management
    shoppingDecision: 'Décision d\'Achat',
    recommendation: 'Recommandation',
    priceValue: 'Rapport Qualité-Prix',
    goodValue: 'Bon Rapport',
    considerPrice: 'Considérer le Prix',
    perfectForPurchase: 'Qualité parfaite pour l\'achat. Cet article offrira une excellente valeur et durera bien.',
    inspectBeforeBuying: 'Qualité acceptable. Inspectez soigneusement et prévoyez d\'utiliser dans quelques jours.',
    notRecommendedToBuy: 'Problèmes de qualité détectés. Envisagez de chercher des alternatives plus fraîches.',
    fridgeManagement: 'Gestion du Réfrigérateur',
    estimatedShelfLife: 'Durée de Conservation Estimée',
    consumeBy: 'Meilleur Avant',
    consumeSoon: 'Consommer bientôt pour la meilleure qualité',
    healthBenefits: 'Bénéfices pour la Santé',
    
    // Health benefits
    providesAntioxidants: 'Fournit des antioxydants et des nutriments',
    richInVitamins: 'Riche en vitamines et minéraux qui soutiennent le système immunitaire et la santé générale',
    highFiberBenefits: 'La teneur élevée en fibres aide à la digestion et maintient des niveaux de cholestérol sains',
    naturalEnergySource: 'Source naturelle d\'énergie provenant de sucres et glucides sains',
    
    // Complex descriptive phrases
    withA: 'avec une',
    finish: 'finition',
    deepRedGlossy: 'Rouge profond avec finition brillante',
    howScoreCalculated: 'Cliquez pour voir comment le score de fraîcheur est calculé'
  },
  
  zh: {
    // Main App
    appTitle: 'FruitAI',
    appSubtitle: 'AI驱动的蔬果新鲜度助手',
    quickScan: '快速扫描',
    viewDashboard: '扫描历史',
    viewAnalytics: '查看分析',
    startScanningNow: '现在开始扫描',
    aiPoweredAnalysis: '开始扫描身边的蔬菜和水果',
    smartShopping: '通过我们最新的AI视觉模型判断蔬果新鲜度 做出明智的购物决策并减少浪费',
    readyToReduce: '准备好减少食物浪费并做出更明智的选择了吗？',
    startSession: '开始扫描 分析新鲜度并获得个性化建议',
    
    // Camera
    positionFruits: '将蔬果放在框架内',
    ensureGoodLighting: '确保良好的照明以获得最佳效果',
    ready: '准备好',
    loading: '加载中...',
    
    // Analysis
    analyzingFruit: '正在分析您的产品...',
    aiScanning: 'AI正在蔬果新鲜度和质量',
    detectingFruits: '检测个别项目',
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
    dashboard: '扫描历史',
    totalScans: '总扫描次数',
    itemsAnalyzedShort: '已分析项目',
    qualityScore: '质量分数',
    avgFreshness: '平均新鲜度',
    recentActivity: '最近活动',
    recentScans: '最近扫描',
    topFreshItems: '🏆 最新鲜项目',
    rankedByFreshness: '按新鲜度排名',
    noScansYet: '还没有扫描',
    startAnalyzing: '开始分析蔬果新鲜度以在此查看您的历史记录',
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
    items: '项目',
    
    // Feature Labels
    smartShoppingFeature: '智能购物',
    instantCheckFeature: '即时检查',
    fridgeHelperFeature: '冰箱助手',
    
    // Additional analysis page translations
    analysisComplete: '分析完成',
    itemAnalyzed: '项目已分析',
    confidenceLevel: '置信度',
    nutritionHighlights: '营养亮点',
    vitamins: '维生素',
    fiber: '纤维',
    minerals: '矿物质',
    benefits: '益处',
    highInVitaminC: '富含维生素C、维生素A',
    fiberContent: '每个中等苹果4.4克',
    potassiumCalcium: '钾、钙',
    heartHealthDigestive: '心脏健康，消化支持',
    storageAdvice: '存放在冰箱蔬菜抽屉中最多2周。远离产生乙烯气体的其他水果。',
    vibrantRed: '鲜艳的红色',
    crispFirm: '酥脆结实',
    noneVisible: '无可见',
    perfect: '完美',
    
    // Dashboard specific
    fruitaiDashboard: 'FruitAI 扫描历史',
    totalItemsAnalyzed: '分析的项目总数',
    
    // Specific analysis values
    redWithPatches: '红色带有黄色和棕色斑块',
    wrinkledSoft: '起皱且柔软', 
    visibleBlemishes: '可见斑点和变色',
    overripe: '过熟',
    notRecommendedStorage: '不建议储存',
    storeInRefrigerator: '存放在冰箱蔬菜抽屉中最多2周',
    
    // Common fruit conditions
    ripe: '成熟',
    unripe: '未熟',
    firm: '结实',
    soft: '柔软',
    crisp: '酥脆',
    wrinkled: '起皱',
    smooth: '光滑',
    red: '红色',
    green: '绿色',
    yellow: '黄色',
    brown: '棕色',
    patches: '斑块',
    blemished: '有斑点',
    unblemished: '无斑点',
    
    // Nutrition labels
    netCarbs: '净碳水化合物',
    sugar: '糖',
    sodium: '钠',
    protein: '蛋白质',
    carbs: '碳水化合物',
    fats: '脂肪',
    
    // Quality descriptions
    goodQuality: '良好',
    excellentQuality: '优秀',
    fairQuality: '一般',
    poorQuality: '较差',
    decentQuality: '质量不错，含有一些有益营养素。建议尽快食用以获得最佳品质。',
    excellentQualityDesc: '品质优秀，营养价值高。适合立即食用。',
    fairQualityDesc: '品质一般，营养价值中等。建议几天内食用。',
    poorQualityDesc: '品质较差，营养价值有限。不建议食用。',
    
    // Fruit and vegetable names
    apple: '苹果',
    banana: '香蕉',
    orange: '橙子',
    strawberry: '草莓',
    grape: '葡萄',
    carrot: '胡萝卜',
    broccoli: '西兰花',
    tomato: '番茄',
    lettuce: '生菜',
    spinach: '菠菜',
    
    // Updated UI text to include vegetables
    fruitsAndVegetables: '水果和蔬菜',
    analyzeProduceInstantly: '即时分析农产品',
    fruitVegetableScanning: '水果蔬菜扫描',
    scanProduce: '扫描农产品',
    
    // Scan limit messages
    unlockMoreScans: '解锁更多扫描！',
    freeScansUsedUp: '免费注册继续无限制扫描！',
    remainingScansMessage: '您今日还有 {count} 次扫描。注册获得无限制扫描和更多功能！',
    freeScansUsedMessage: '免费注册继续无限制扫描并解锁高级功能！',
    signUpFree: '免费注册！',
    alreadyHaveAccount: '已有账户？登录',
    continueWithFreeScans: '继续使用 {count} 次扫描',
    unlimitedScans: '无限制水果扫描',
    detailedNutrition: '详细营养分析',
    personalHistory: '个人扫描历史和洞察',
    
    // Additional quality scores and storage
    fullyRipe: '完全成熟',
    andGlossy: '和有光泽',
    processed: '加工度',
    minimalAdditives: '含有最少的添加剂或防腐剂，无人工甜味剂、染料或种子油。',
    smoothAndGlossy: '光滑有光泽',
    glossy: '有光泽',
    needsAttention: '需要注意',
    qualityDeclining: '品质正在下降。请仔细检查后再食用或考虑避免。',
    
    // New additions for Chinese
    veryGood: '非常好！',
    highNutrients: '富含有益营养素，对整体健康非常有利。可以成为健康饮食的常规部分。',
    storeCoolDry: '存放在阴凉干燥的地方或冷藏以延长新鲜度。',
    deepRed: '深红色',
    smoothAndFirm: '光滑紧实',
    perfectlyRipe: '完美成熟',
    
    // Shopping and fridge management
    shoppingDecision: '购买决策',
    recommendation: '推荐',
    priceValue: '性价比',
    goodValue: '物有所值',
    considerPrice: '考虑价格',
    perfectForPurchase: '质量完美，适合购买。这个物品将提供极佳价值并保存良好。',
    inspectBeforeBuying: '质量可接受。仔细检查并计划在几天内使用。',
    notRecommendedToBuy: '检测到质量问题。考虑寻找更新鲜的替代品。',
    fridgeManagement: '冰箱管理',
    estimatedShelfLife: '预计保存期',
    consumeBy: '最佳食用日期',
    consumeSoon: '尽快食用以获得最佳品质',
    healthBenefits: '健康益处',
    
    // Health benefits
    providesAntioxidants: '提供抗氧化剂和营养素',
    richInVitamins: '富含维生素和矿物质，支持免疫系统和整体健康',
    highFiberBenefits: '高纤维含量有助于消化，帮助维持健康的胆固醇水平',
    naturalEnergySource: '来自健康糖分和碳水化合物的天然能量来源',
    
    // Complex descriptive phrases
    withA: '具有',
    finish: '质感',
    deepRedGlossy: '深红色，具有光泽质感',
    howScoreCalculated: '点击查看新鲜度分数是如何计算的'
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
    analyzingFruit: '農産物を分析中...',
    aiScanning: 'AIがフレッシュネスと品質をスキャンしています',
    detectingFruits: '個別のアイテムを検出中',
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
    items: 'アイテム',
    
    // Feature Labels
    smartShoppingFeature: 'スマート買い物',
    instantCheckFeature: '即時チェック',
    fridgeHelperFeature: '冷蔵庫アシスタント',
    
    // Additional analysis page translations
    analysisComplete: '分析完了',
    itemAnalyzed: 'アイテム分析済み',
    confidenceLevel: '信頼度',
    nutritionHighlights: '栄養ハイライト',
    vitamins: 'ビタミン',
    fiber: '食物繊維',
    minerals: 'ミネラル',
    benefits: '効果',
    highInVitaminC: 'ビタミンC、ビタミンAが豊富',
    fiberContent: '中サイズのりんご1個あたり4.4g',
    potassiumCalcium: 'カリウム、カルシウム',
    heartHealthDigestive: '心臓の健康、消化サポート',
    storageAdvice: '冷蔵庫の野菜室で最大2週間保存してください。エチレンガスを発生する他の果物から離してください。',
    vibrantRed: '鮮やかな赤',
    crispFirm: 'サクサクで硬い',
    noneVisible: '見当たらない',
    perfect: '完璧',
    
    // Dashboard specific
    fruitaiDashboard: 'FruitAI ダッシュボード',
    totalItemsAnalyzed: '分析されたアイテムの総数',
    
    // Specific analysis values
    redWithPatches: '黄色と茶色の斑点がある赤',
    wrinkledSoft: 'しわがあり柔らかい', 
    visibleBlemishes: '目に見える汚れと変色',
    overripe: '熟しすぎ',
    notRecommendedStorage: '保存には推奨されません',
    storeInRefrigerator: '冷蔵庫の野菜室で最大2週間保存',
    
    // Common fruit conditions
    ripe: '熟した',
    unripe: '未熟',
    firm: '硬い',
    soft: '柔らかい',
    crisp: 'サクサク',
    wrinkled: 'しわがある',
    smooth: '滑らか',
    red: '赤',
    green: '緑',
    yellow: '黄色',
    brown: '茶色',
    patches: '斑点',
    blemished: '傷がある',
    unblemished: '傷がない',
    
    // Nutrition labels
    netCarbs: '正味炭水化物',
    sugar: '糖質',
    sodium: 'ナトリウム',
    protein: 'タンパク質',
    carbs: '炭水化物',
    fats: '脂質',
    
    // Quality descriptions
    goodQuality: '良い',
    excellentQuality: '優秀',
    fairQuality: '普通',
    poorQuality: '悪い',
    decentQuality: 'まずまずの品質で、いくつかの有益な栄養素を含んでいます。最高の品質のために早めに摂取することを検討してください。',
    excellentQualityDesc: '高い栄養価を持つ優秀な品質。即座の摂取に最適です。',
    fairQualityDesc: '中程度の栄養価を持つ普通の品質。数日以内に使用してください。',
    poorQualityDesc: '限られた栄養価を持つ悪い品質。摂取は推奨されません。',
    
    // Fruit and vegetable names
    apple: 'りんご',
    banana: 'バナナ',
    orange: 'オレンジ',
    strawberry: 'いちご',
    grape: 'ぶどう',
    carrot: 'にんじん',
    broccoli: 'ブロッコリー',
    tomato: 'トマト',
    lettuce: 'レタス',
    spinach: 'ほうれん草',
    
    // Updated UI text to include vegetables
    fruitsAndVegetables: '果物と野菜',
    analyzeProduceInstantly: '農産物を即座に分析',
    fruitVegetableScanning: '果物・野菜スキャン',
    scanProduce: '農産物をスキャン',
    
    // Scan limit messages
    unlockMoreScans: 'もっとスキャンをアンロック！',
    freeScansUsedUp: '無料スキャンを使い切りました！',
    remainingScansMessage: '残り{count}回の無料スキャンがあります。サインアップして無制限スキャンと更なる機能を取得！',
    freeScansUsedMessage: 'すべての{count}回の無料スキャンを使用しました。サインアップしてスキャンを続け、プレミアム機能をアンロック！',
    signUpFree: 'サインアップ - 無料！',
    alreadyHaveAccount: '既にアカウントをお持ちですか？サインイン',
    continueWithFreeScans: '{count}回の無料スキャンで続ける',
    unlimitedScans: '無制限のフルーツスキャン',
    detailedNutrition: '詳細な栄養分析',
    personalHistory: '個人のスキャン履歴と洞察',
    
    // Additional quality scores and storage
    veryGood: 'とても良い！',
    highNutrients: '有益な栄養素が豊富で、全体的な健康を強くサポートします。健康的な食事の定期的な一部になることができます。',
    storeCoolDry: '涼しく乾燥した場所に保管するか、冷蔵して新鮮さを延長する。',
    deepRed: '深い赤',
    smoothAndFirm: '滑らかで硬い',
    perfectlyRipe: '完璧に熟した',
    fullyRipe: '完全に熟した',
    andGlossy: 'と光沢のある',
    processed: '加工度',
    minimalAdditives: '添加物や保存料が最小限で、人工甘味料、染料、種子油が含まれていません。',
    smoothAndGlossy: '滑らかで光沢のある',
    glossy: '光沢のある',
    needsAttention: '注意が必要',
    qualityDeclining: '品質が低下しています。消費前に注意深く検査するか、避けることを検討してください。',
    
    // Shopping and fridge management
    shoppingDecision: '買い物の判断',
    recommendation: '推奨',
    priceValue: '価格対価値',
    goodValue: '良い価値',
    considerPrice: '価格を考慮',
    perfectForPurchase: '購入に最適な品質。この商品は優れた価値を提供し、長持ちします。',
    inspectBeforeBuying: '許容できる品質。注意深く検査し、数日以内に使用する予定。',
    notRecommendedToBuy: '品質の問題が検出されました。より新鮮な代替品を探すことを検討してください。',
    fridgeManagement: '冷蔵庫管理',
    estimatedShelfLife: '推定保存期間',
    consumeBy: '消費期限',
    consumeSoon: '最高の品質のためにすぐに消費する',
    healthBenefits: '健康効果',
    
    // Health benefits
    providesAntioxidants: '抗酸化物質と栄養素を提供',
    richInVitamins: '免疫システムと全体的な健康をサポートするビタミンとミネラルが豊富',
    highFiberBenefits: '高い食物繊維含有量が消化を助け、健康的なコレステロールレベルを維持',
    naturalEnergySource: '健康的な糖分と炭水化物からの自然なエネルギー源',
    
    // Complex descriptive phrases
    withA: 'と',
    finish: '仕上がり',
    deepRedGlossy: '深い赤色で光沢のある仕上がり',
    howScoreCalculated: 'フレッシュネススコアの計算方法を見るにはクリック'
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

// Translate dynamic analysis content
export function translateAnalysisValue(language: string, value: string): string {
  if (!value) return value;
  
  // Create a mapping of English values to translation keys
  const valueMap: { [key: string]: string } = {
    'Red with yellow and brown patches': 'redWithPatches',
    'Wrinkled and soft': 'wrinkledSoft',
    'Visible blemishes and discoloration': 'visibleBlemishes',
    'Overripe': 'overripe',
    'Not recommended for storage': 'notRecommendedStorage',
    'Store in refrigerator crisper drawer for up to 2 weeks': 'storeInRefrigerator',
    'Ripe': 'ripe',
    'Unripe': 'unripe',
    'Firm': 'firm',
    'Soft': 'soft',
    'Crisp': 'crisp',
    'Wrinkled': 'wrinkled',
    'Smooth': 'smooth',
    'Red': 'red',
    'Green': 'green',
    'Yellow': 'yellow',
    'Brown': 'brown',
    'Perfect': 'perfect',
    'Vibrant red': 'vibrantRed',
    'Crisp & firm': 'crispFirm',
    'None visible': 'noneVisible',
    
    // Nutrition labels
    'Fiber': 'fiber',
    'Net Carbs': 'netCarbs',
    'Sugar': 'sugar',
    'Sodium': 'sodium',
    'Protein': 'protein',
    'Carbs': 'carbs',
    'Fats': 'fats',
    
    // Quality descriptions
    'Good': 'goodQuality',
    'Excellent': 'excellentQuality',
    'Fair': 'fairQuality',
    'Poor': 'poorQuality',
    'Decent quality with some beneficial nutrients. Consider consuming soon for best quality.': 'decentQuality',
    'Excellent quality with high nutritional value. Perfect for immediate consumption.': 'excellentQualityDesc',
    'Fair quality with moderate nutritional value. Use within a few days.': 'fairQualityDesc',
    'Poor quality with limited nutritional value. Not recommended for consumption.': 'poorQualityDesc',
    
    // Fruit and vegetable names
    'Apple': 'apple',
    'Banana': 'banana',
    'Orange': 'orange',
    'Strawberry': 'strawberry',
    'Grape': 'grape',
    'Carrot': 'carrot',
    'Broccoli': 'broccoli',
    'Tomato': 'tomato',
    'Lettuce': 'lettuce',
    'Spinach': 'spinach',
    
    // Additional quality scores and storage
    'Very Good!': 'veryGood',
    'High in beneficial nutrients and very supportive of overall health. It can be a regular part of a healthy diet.': 'highNutrients',
    'Store in a cool, dry place or refrigerate to extend freshness.': 'storeCoolDry',
    'Deep red': 'deepRed',
    'Smooth and firm': 'smoothAndFirm',
    'Perfectly ripe': 'perfectlyRipe',
    'Fully ripe': 'fullyRipe',
    'and glossy': 'andGlossy',
    'Processed': 'processed',
    'Contains minimal additives or preservatives, no artificial sweeteners, dyes, or seed oils.': 'minimalAdditives',
    
    // Compound phrases that might be partially translated
    'Smooth and glossy': 'smoothAndGlossy',
    'glossy': 'glossy',
    'Needs Attention': 'needsAttention',
    'Quality is declining. Inspect carefully before consuming or consider avoiding.': 'qualityDeclining'
  };
  
  // Check if we have a translation key for this value
  const translationKey = valueMap[value];
  if (translationKey) {
    return getTranslation(language, translationKey);
  }
  
  // Handle compound phrases more carefully
  // First try to match longer phrases before individual words
  const sortedEntries = Object.entries(valueMap).sort((a, b) => b[0].length - a[0].length);
  
  let translatedValue = value;
  for (const [englishPhrase, key] of sortedEntries) {
    // Use case-insensitive matching and word boundaries where appropriate
    const regex = new RegExp(`\\b${englishPhrase.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'gi');
    if (regex.test(translatedValue)) {
      const translatedPhrase = getTranslation(language, key);
      translatedValue = translatedValue.replace(regex, translatedPhrase);
    }
  }
  
  return translatedValue;
}