import { NutritionalInfo, StorageTips } from './storage';

interface ProduceData {
  nutrition: NutritionalInfo;
  storage: StorageTips;
  recipes: string[];
}

export const produceData: Record<string, ProduceData> = {
  'apple': {
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      vitamins: {
        'Vitamin C': 14,
        'Vitamin K': 3,
        'Potassium': 6
      }
    },
    storage: {
      optimal: 'Refrigerator crisper drawer',
      avoid: 'Near bananas or other ethylene-producing fruits',
      duration: '4-6 weeks refrigerated',
      tips: [
        'Store in a plastic bag with holes for air circulation',
        'Keep away from strong-smelling foods',
        'Check regularly and remove any spoiled apples'
      ]
    },
    recipes: [
      'Apple Pie',
      'Apple Crisp',
      'Waldorf Salad',
      'Apple Sauce',
      'Baked Apples'
    ]
  },
  'banana': {
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      vitamins: {
        'Vitamin B6': 33,
        'Vitamin C': 15,
        'Potassium': 10
      }
    },
    storage: {
      optimal: 'Room temperature until ripe, then refrigerate',
      avoid: 'Refrigerating green bananas',
      duration: '2-7 days at room temp, 5-9 days refrigerated when ripe',
      tips: [
        'Separate bananas to slow ripening',
        'Wrap stems in plastic to extend life',
        'Freeze overripe bananas for smoothies'
      ]
    },
    recipes: [
      'Banana Bread',
      'Banana Smoothie',
      'Banana Pancakes',
      'Banana Foster',
      'Banana Ice Cream'
    ]
  },
  'orange': {
    nutrition: {
      calories: 62,
      protein: 1.2,
      carbs: 15.4,
      fat: 0.2,
      fiber: 3.1,
      vitamins: {
        'Vitamin C': 116,
        'Folate': 10,
        'Thiamine': 7
      }
    },
    storage: {
      optimal: 'Refrigerator for longer storage',
      avoid: 'Sealed plastic bags (causes mold)',
      duration: '1 week at room temp, 3-4 weeks refrigerated',
      tips: [
        'Store in mesh bag for air circulation',
        'Keep away from direct sunlight',
        'Can freeze juice for later use'
      ]
    },
    recipes: [
      'Orange Marmalade',
      'Orange Chicken',
      'Orange Salad',
      'Orange Juice',
      'Candied Orange Peel'
    ]
  },
  'strawberry': {
    nutrition: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      fiber: 2,
      vitamins: {
        'Vitamin C': 98,
        'Manganese': 19,
        'Folate': 6
      }
    },
    storage: {
      optimal: 'Refrigerator in original container',
      avoid: 'Washing before storage',
      duration: '3-7 days refrigerated',
      tips: [
        'Remove any moldy berries immediately',
        'Store unwashed and hull just before eating',
        'Can be frozen for up to 6 months'
      ]
    },
    recipes: [
      'Strawberry Shortcake',
      'Strawberry Jam',
      'Strawberry Smoothie',
      'Strawberry Salad',
      'Chocolate-Covered Strawberries'
    ]
  },
  'avocado': {
    nutrition: {
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      fiber: 6.7,
      vitamins: {
        'Vitamin K': 26,
        'Folate': 20,
        'Vitamin C': 17
      }
    },
    storage: {
      optimal: 'Room temperature until ripe, then refrigerate',
      avoid: 'Refrigerating unripe avocados',
      duration: '2-4 days at room temp, 3-5 days refrigerated when ripe',
      tips: [
        'Store with pit to reduce browning',
        'Sprinkle with lemon juice when cut',
        'Can freeze mashed avocado'
      ]
    },
    recipes: [
      'Guacamole',
      'Avocado Toast',
      'Avocado Smoothie',
      'Avocado Salad',
      'Avocado Chocolate Mousse'
    ]
  },
  'tomato': {
    nutrition: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2,
      vitamins: {
        'Vitamin C': 28,
        'Vitamin K': 10,
        'Potassium': 5
      }
    },
    storage: {
      optimal: 'Room temperature until ripe',
      avoid: 'Refrigerating unripe tomatoes',
      duration: '3-5 days at room temp, 5-7 days refrigerated when ripe',
      tips: [
        'Store stem-side down',
        'Keep out of direct sunlight',
        'Separate from other produce'
      ]
    },
    recipes: [
      'Caprese Salad',
      'Tomato Sauce',
      'Bruschetta',
      'Gazpacho',
      'Tomato Soup'
    ]
  },
  'lettuce': {
    nutrition: {
      calories: 15,
      protein: 1.4,
      carbs: 2.9,
      fat: 0.2,
      fiber: 1.3,
      vitamins: {
        'Vitamin K': 174,
        'Vitamin A': 148,
        'Folate': 10
      }
    },
    storage: {
      optimal: 'Refrigerator crisper in plastic bag',
      avoid: 'Storing near ethylene-producing fruits',
      duration: '7-10 days refrigerated',
      tips: [
        'Wash and dry thoroughly before storing',
        'Wrap in paper towels to absorb moisture',
        'Store in airtight container'
      ]
    },
    recipes: [
      'Caesar Salad',
      'Garden Salad',
      'Lettuce Wraps',
      'BLT Sandwich',
      'Green Smoothie'
    ]
  },
  'broccoli': {
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fat: 0.4,
      fiber: 2.6,
      vitamins: {
        'Vitamin C': 149,
        'Vitamin K': 128,
        'Folate': 16
      }
    },
    storage: {
      optimal: 'Refrigerator crisper in perforated bag',
      avoid: 'Washing before storage',
      duration: '7-14 days refrigerated',
      tips: [
        'Store unwashed in perforated plastic bag',
        'Can blanch and freeze for longer storage',
        'Use yellowing florets first'
      ]
    },
    recipes: [
      'Broccoli Soup',
      'Stir-fried Broccoli',
      'Broccoli Salad',
      'Roasted Broccoli',
      'Broccoli Cheddar Casserole'
    ]
  }
};

// Helper function to get data for any produce item
export function getProduceData(item: string): ProduceData | null {
  const normalizedItem = item.toLowerCase().trim();
  
  // Try exact match first
  if (produceData[normalizedItem]) {
    return produceData[normalizedItem];
  }
  
  // Try partial match
  for (const [key, data] of Object.entries(produceData)) {
    if (normalizedItem.includes(key) || key.includes(normalizedItem)) {
      return data;
    }
  }
  
  // Return default data for unknown items
  return {
    nutrition: {
      calories: 50,
      protein: 1,
      carbs: 12,
      fat: 0.5,
      fiber: 2,
      vitamins: {
        'Vitamin C': 20,
        'Vitamin A': 10,
        'Potassium': 5
      }
    },
    storage: {
      optimal: 'Cool, dry place or refrigerator',
      avoid: 'Direct sunlight and moisture',
      duration: 'Varies by item',
      tips: [
        'Check regularly for spoilage',
        'Store away from ethylene producers',
        'Use within recommended timeframe'
      ]
    },
    recipes: []
  };
}