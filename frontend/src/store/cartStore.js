import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.cartItems.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            cartItems: state.cartItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
      }),
      
      removeItem: (id) => set((state) => ({
        cartItems: state.cartItems.filter((i) => i.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity < 1) return state;
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        };
      }),
      
      clearCart: () => set({ cartItems: [] }),
      
      get totalPrice() {
        return get().cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
