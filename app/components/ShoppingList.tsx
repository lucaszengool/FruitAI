'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, AlertTriangle, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ShoppingItem {
  id: string;
  item: string;
  reason: 'expired' | 'running-low' | 'needed';
  urgency: 'high' | 'medium' | 'low';
  addedDate: Date;
  completed: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Load shopping list from localStorage
    const saved = localStorage.getItem('shopping-list');
    if (saved) {
      const parsed = JSON.parse(saved);
      setItems(parsed.map((item: { id: string; item: string; reason: 'expired' | 'running-low' | 'needed'; urgency: 'high' | 'medium' | 'low'; addedDate: string; completed: boolean; }) => ({
        ...item,
        addedDate: new Date(item.addedDate)
      })));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever items change
    localStorage.setItem('shopping-list', JSON.stringify(items));
  }, [items]);

  const addItem = (item: string, reason: ShoppingItem['reason'] = 'needed', urgency: ShoppingItem['urgency'] = 'medium') => {
    const newShoppingItem: ShoppingItem = {
      id: `${Date.now()}-${Math.random()}`,
      item,
      reason,
      urgency,
      addedDate: new Date(),
      completed: false
    };
    setItems(prev => [newShoppingItem, ...prev]);
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      addItem(newItem.trim());
      setNewItem('');
    }
  };

  // Auto-generate items based on fridge check history
  useEffect(() => {
    const checkForAutoAdd = () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('session-')) {
          const session = JSON.parse(localStorage.getItem(key) || '{}');
          if (session.type === 'fridge-check' && session.items) {
            session.items.forEach((item: { item: string; freshness: number; daysRemaining?: number; }) => {
              if (item.freshness < 30 && !items.find(existing => existing.item === item.item)) {
                addItem(item.item, 'expired', 'high');
              } else if (item.daysRemaining && item.daysRemaining <= 2 && !items.find(existing => existing.item === item.item)) {
                addItem(item.item, 'running-low', 'medium');
              }
            });
          }
        }
      }
    };

    checkForAutoAdd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUrgencyColor = (urgency: ShoppingItem['urgency']) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
    }
  };

  const getReasonIcon = (reason: ShoppingItem['reason']) => {
    switch (reason) {
      case 'expired': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'running-low': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'needed': return <Plus className="w-4 h-4 text-gray-500" />;
    }
  };

  const completedItems = items.filter(item => item.completed);
  const pendingItems = items.filter(item => !item.completed);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">🛒 Smart Shopping List</h3>
        <div className="text-sm text-gray-600">
          {pendingItems.length} pending, {completedItems.length} completed
        </div>
      </div>

      {/* Add New Item */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add item to shopping list..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handleAddItem} disabled={!newItem.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {pendingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Button
                onClick={() => toggleComplete(item.id)}
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-500 transition-colors">
                  {item.completed && <Check className="w-3 h-3 text-green-600" />}
                </div>
              </Button>
              
              <div className="flex items-center gap-2">
                {getReasonIcon(item.reason)}
              </div>

              <div className="flex-1">
                <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.item}
                </span>
              </div>

              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(item.urgency)}`}>
                {item.urgency}
              </div>

              <Button
                onClick={() => removeItem(item.id)}
                variant="ghost"
                size="sm"
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Completed ({completedItems.length})</h4>
            {completedItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-500" />
                <span className="line-through">{item.item}</span>
              </div>
            ))}
          </div>
        )}

        {pendingItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Your shopping list is empty!</p>
            <p className="text-sm mt-1">Items will be automatically added based on your fridge checks.</p>
          </div>
        )}
      </div>
    </Card>
  );
}