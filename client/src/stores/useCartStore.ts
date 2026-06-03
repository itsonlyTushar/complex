import { CartStore } from '@/types/cart.types';
import { create } from 'zustand';

export const useCartStore = create<CartStore>((set, get) => ({
  items: {},
  
  addItem: (menu) => set((state) => {
    const existingItem = state.items[menu.id];
    if (existingItem) {
      return {
        items: {
          ...state.items,
          [menu.id]: { ...existingItem, cartQuantity: existingItem.cartQuantity + 1 }
        }
      };
    }
    return {
      items: {
        ...state.items,
        [menu.id]: { ...menu, cartQuantity: 1 }
      }
    };
  }),

  removeItem: (menuId) => set((state) => {
    const { [menuId]: removedItem, ...rest } = state.items;
    return { items: rest };
  }),

  updateQuantity: (menuId, delta) => set((state) => {
    const item = state.items[menuId];
    if (!item) return state;
    
    const newQuantity = item.cartQuantity + delta;
    if (newQuantity <= 0) {
      const { [menuId]: removedItem, ...rest } = state.items;
      return { items: rest };
    }
    
    return {
      items: {
        ...state.items,
        [menuId]: { ...item, cartQuantity: newQuantity }
      }
    };
  }),

  clearCart: () => set({ items: {} }),

  getTotalPrice: () => {
    const { items } = get();
    return Object.values(items).reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return Object.values(items).reduce((total, item) => total + item.cartQuantity, 0);
  }
}));
