import { Menu } from './menu.types'

export interface CartItem extends Menu {
  cartQuantity: number;
}

export interface CartStore {
  items: Record<number, CartItem>;
  addItem: (menu: Menu) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
