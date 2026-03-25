// lib/CartContext.js
import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      if (action.quantity <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      );
    case 'CLEAR':
      return [];
    case 'REPLACE':
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('toystore-cart') || '[]');
      if (stored.length > 0) dispatch({ type: 'REPLACE', items: stored });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('toystore-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty = (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
