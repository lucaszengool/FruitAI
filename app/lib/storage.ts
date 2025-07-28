export interface AnalysisHistory {
  id: string;
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  characteristics: {
    color: string;
    texture: string;
    blemishes: string;
    ripeness: string;
  };
  timestamp: string;
  image?: string;
}

export interface ShoppingListItem {
  id: string;
  item: string;
  quantity: number;
  notes?: string;
  addedAt: string;
  checked: boolean;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
}

export interface StorageTips {
  optimal: string;
  avoid: string;
  duration: string;
  tips: string[];
}

const HISTORY_KEY = 'fruitai_analysis_history';
const SHOPPING_LIST_KEY = 'fruitai_shopping_list';

export const storage = {
  // Analysis History
  getHistory(): AnalysisHistory[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  addToHistory(analysis: AnalysisHistory) {
    const history = this.getHistory();
    history.unshift(analysis); // Add to beginning
    // Keep only last 50 items
    if (history.length > 50) {
      history.pop();
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  },

  // Shopping List
  getShoppingList(): ShoppingListItem[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SHOPPING_LIST_KEY);
    return data ? JSON.parse(data) : [];
  },

  addToShoppingList(item: Omit<ShoppingListItem, 'id' | 'addedAt' | 'checked'>) {
    const list = this.getShoppingList();
    const newItem: ShoppingListItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
      checked: false
    };
    list.push(newItem);
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
    return newItem;
  },

  toggleShoppingItem(id: string) {
    const list = this.getShoppingList();
    const item = list.find(i => i.id === id);
    if (item) {
      item.checked = !item.checked;
      localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
    }
  },

  removeFromShoppingList(id: string) {
    const list = this.getShoppingList().filter(item => item.id !== id);
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
  },

  clearShoppingList() {
    localStorage.removeItem(SHOPPING_LIST_KEY);
  }
};