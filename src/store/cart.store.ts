export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantKey: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const KEY = 'mo_cart';

const read = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
};

export const cartStore = {
  getItems: read,

  addItem(incoming: CartItem) {
    const items = read();
    const existing = items.find((i) => i.variantId === incoming.variantId);
    if (existing) {
      existing.quantity += incoming.quantity;
    } else {
      items.push(incoming);
    }
    write(items);
  },

  removeItem(variantId: string) {
    write(read().filter((i) => i.variantId !== variantId));
  },

  updateQuantity(variantId: string, qty: number) {
    const items = read();
    const found = items.find((i) => i.variantId === variantId);
    if (found) {
      found.quantity = qty;
      write(items);
    }
  },

  clear() {
    write([]);
  },

  totalCount() {
    return read().reduce((sum, i) => sum + i.quantity, 0);
  },
};