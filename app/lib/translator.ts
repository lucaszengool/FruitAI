import { getLanguageCode } from './languageDetector';

// Translation function that works on both client and server
export async function translateText(text: string, targetLanguage?: string, userAgent?: string): Promise<string> {
  let language = targetLanguage;
  
  // If no target language specified, try to detect from user agent or default to browser detection
  if (!language) {
    if (userAgent) {
      // Simple language detection from user agent
      if (userAgent.includes('zh-CN') || userAgent.includes('zh')) {
        language = 'zh';
      } else if (userAgent.includes('es')) {
        language = 'es';
      } else if (userAgent.includes('fr')) {
        language = 'fr';
      } else {
        language = 'en';
      }
    } else {
      language = getLanguageCode();
    }
  }
  
  // If already in target language or English, return as is
  if (language === 'en' || !text) {
    return text;
  }

  // Common fruit/vegetable analysis terms translation
  const translations: Record<string, Record<string, string>> = {
    'zh': {
      // Fruits and vegetables
      'Apple': '苹果', 'Pear': '梨', 'Banana': '香蕉', 'Orange': '橙子', 'Grape': '葡萄',
      'Strawberry': '草莓', 'Blueberry': '蓝莓', 'Mango': '芒果', 'Pineapple': '菠萝',
      'Watermelon': '西瓜', 'Cantaloupe': '哈密瓜', 'Peach': '桃子', 'Plum': '李子',
      'Cherry': '樱桃', 'Kiwi': '猕猴桃', 'Avocado': '牛油果', 'Lemon': '柠檬', 'Lime': '青柠',
      'Tomato': '西红柿', 'Cucumber': '黄瓜', 'Carrot': '胡萝卜', 'Potato': '土豆',
      'Onion': '洋葱', 'Garlic': '大蒜', 'Broccoli': '西兰花', 'Spinach': '菠菜',
      'Lettuce': '生菜', 'Cabbage': '卷心菜', 'Bell Pepper': '彩椒', 'Eggplant': '茄子',
      
      // Colors
      'green': '绿色', 'red': '红色', 'yellow': '黄色', 'orange': '橙色', 'purple': '紫色',
      'brown': '棕色', 'white': '白色', 'pink': '粉色', 'golden': '金色', 'dark': '深色',
      'light': '浅色', 'bright': '鲜艳', 'vibrant': '鲜明', 'pale': '淡色',
      
      // Texture descriptions
      'smooth': '光滑', 'rough': '粗糙', 'soft': '柔软', 'firm': '结实', 'crisp': '脆嫩',
      'juicy': '多汁', 'dry': '干燥', 'tender': '嫩滑', 'tough': '坚韧', 'wrinkled': '起皱',
      'glossy': '有光泽', 'matte': '无光泽', 'waxy': '蜡质', 'fuzzy': '毛茸茸',
      
      // Quality indicators
      'fresh': '新鲜', 'ripe': '成熟', 'overripe': '过熟', 'unripe': '未熟', 'spoiled': '变质',
      'excellent': '优秀', 'good': '良好', 'fair': '一般', 'poor': '较差', 'bad': '很差',
      'perfect': '完美', 'high quality': '高品质', 'premium': '优质', 'organic': '有机',
      
      // Recommendations
      'buy': '购买', 'check': '检查', 'avoid': '避免', 'recommended': '推荐', 'not recommended': '不推荐',
      'best choice': '最佳选择', 'good option': '好选择', 'consider': '考虑', 'skip': '跳过',
      
      // Storage and timing
      'Store in refrigerator': '冷藏保存', 'Keep at room temperature': '室温保存',
      'Store in cool, dry place': '存放在阴凉干燥处', 'Use within': '请在...内使用',
      'Best consumed within': '最好在...内食用', 'days': '天', 'weeks': '周',
      'Refrigerate after opening': '开封后冷藏', 'Do not freeze': '请勿冷冻',
      
      // Nutrition terms
      'calories': '卡路里', 'vitamin': '维生素', 'fiber': '纤维', 'protein': '蛋白质',
      'carbohydrates': '碳水化合物', 'fat': '脂肪', 'minerals': '矿物质', 'antioxidants': '抗氧化剂',
      'potassium': '钾', 'vitamin C': '维生素C', 'vitamin A': '维生素A', 'iron': '铁',
      'calcium': '钙', 'magnesium': '镁', 'folate': '叶酸',
      
      // Health benefits
      'Boosts immune system': '增强免疫系统', 'Rich in antioxidants': '富含抗氧化剂',
      'Good for heart health': '有益心脏健康', 'Supports digestion': '促进消化',
      'High in fiber': '富含纤维', 'Low in calories': '低卡路里', 'Natural source of': '天然来源',
      'Helps reduce inflammation': '有助减少炎症', 'Supports eye health': '有益眼部健康',
      
      // Common phrases
      'This fruit': '这个水果', 'This vegetable': '这个蔬菜', 'appears to be': '似乎是',
      'shows signs of': '显示出...迹象', 'is in': '处于', 'condition': '状态', 'with': '具有',
      'The texture is': '质地是', 'The color indicates': '颜色表明', 'Overall': '总体而言',
      'Perfect for': '非常适合', 'Great for': '很适合', 'Can be used for': '可用于',
      'Ideal for': '理想用于', 'Best eaten': '最好...食用', 'cooking': '烹饪', 'eating fresh': '新鲜食用'
    },
    
    'es': {
      // Fruits and vegetables
      'Apple': 'Manzana', 'Pear': 'Pera', 'Banana': 'Plátano', 'Orange': 'Naranja',
      'Grape': 'Uva', 'Strawberry': 'Fresa', 'Mango': 'Mango', 'Pineapple': 'Piña',
      'Watermelon': 'Sandía', 'Peach': 'Durazno', 'Cherry': 'Cereza', 'Kiwi': 'Kiwi',
      'Avocado': 'Aguacate', 'Lemon': 'Limón', 'Tomato': 'Tomate', 'Cucumber': 'Pepino',
      'Carrot': 'Zanahoria', 'Potato': 'Papa', 'Onion': 'Cebolla', 'Garlic': 'Ajo',
      
      // Colors
      'green': 'verde', 'red': 'rojo', 'yellow': 'amarillo', 'orange': 'naranja',
      'purple': 'morado', 'brown': 'marrón', 'white': 'blanco',
      
      // Quality
      'fresh': 'fresco', 'ripe': 'maduro', 'excellent': 'excelente', 'good': 'bueno',
      'buy': 'comprar', 'check': 'revisar', 'avoid': 'evitar',
      
      // Storage
      'Store in refrigerator': 'Guardar en refrigerador', 'days': 'días'
    },
    
    'fr': {
      // Fruits and vegetables
      'Apple': 'Pomme', 'Pear': 'Poire', 'Banana': 'Banane', 'Orange': 'Orange',
      'Grape': 'Raisin', 'Strawberry': 'Fraise', 'Mango': 'Mangue', 'Pineapple': 'Ananas',
      'Watermelon': 'Pastèque', 'Peach': 'Pêche', 'Cherry': 'Cerise', 'Kiwi': 'Kiwi',
      'Avocado': 'Avocat', 'Lemon': 'Citron', 'Tomato': 'Tomate', 'Cucumber': 'Concombre',
      'Carrot': 'Carotte', 'Potato': 'Pomme de terre', 'Onion': 'Oignon', 'Garlic': 'Ail',
      
      // Colors
      'green': 'vert', 'red': 'rouge', 'yellow': 'jaune', 'orange': 'orange',
      'purple': 'violet', 'brown': 'marron', 'white': 'blanc',
      
      // Quality
      'fresh': 'frais', 'ripe': 'mûr', 'excellent': 'excellent', 'good': 'bon',
      'buy': 'acheter', 'check': 'vérifier', 'avoid': 'éviter',
      
      // Storage
      'Store in refrigerator': 'Conserver au réfrigérateur', 'days': 'jours'
    }
  };

  // Get translation map for target language
  const translationMap = translations[language];
  if (!translationMap) return text;

  // Replace words/phrases with translations
  let translatedText = text;
  
  // Sort by length (longest first) to handle phrases before individual words
  const sortedKeys = Object.keys(translationMap).sort((a, b) => b.length - a.length);
  
  for (const englishTerm of sortedKeys) {
    const translatedTerm = translationMap[englishTerm];
    // Use word boundaries and case-insensitive matching
    const regex = new RegExp(`\\b${englishTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translatedTerm);
  }

  return translatedText;
}

// Translate an entire object's string values
export async function translateObject(obj: any, targetLanguage?: string): Promise<any> {
  const language = targetLanguage || 'en';
  
  if (language === 'en') return obj;
  
  if (typeof obj === 'string') {
    return await translateText(obj, language);
  }
  
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, language)));
  }
  
  if (obj && typeof obj === 'object') {
    const translated: any = {};
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = await translateObject(value, language);
    }
    return translated;
  }
  
  return obj;
}

// Translate fruit analysis result
export async function translateAnalysisResult(result: any, targetLanguage?: string): Promise<any> {
  const language = targetLanguage || 'en';
  
  if (language === 'en') return result;
  
  // Translate the entire result object
  return await translateObject(result, language);
}