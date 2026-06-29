const { create } = require('zustand');

// Recreate minimal cartStore behavior and test it
const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product, qty = 1) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: qty }] };
    }),
  increase: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),
  decrease: (id) =>
    set((state) => ({
      cart: state.cart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    })),
  remove: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
}));

// Test sequence
const productA = { id: 1, name: 'Test Product', price: 9.99 };
const productB = { id: 2, name: 'Another Product', price: 5.0 };

console.log('Initial cart:', useCartStore.getState().cart);
useCartStore.getState().addToCart(productA);
console.log('After adding productA x1:', useCartStore.getState().cart);
useCartStore.getState().addToCart(productA, 2);
console.log('After adding productA x2 more (should be qty 3):', useCartStore.getState().cart);
useCartStore.getState().addToCart(productB, 5);
console.log('After adding productB x5:', useCartStore.getState().cart);
useCartStore.getState().increase(1);
console.log('After increase id=1 (qty should be 4):', useCartStore.getState().cart);
useCartStore.getState().decrease(2);
console.log('After decrease id=2 (qty should be 4):', useCartStore.getState().cart);
useCartStore.getState().decrease(2);
useCartStore.getState().decrease(2);
useCartStore.getState().decrease(2);
useCartStore.getState().decrease(2);
console.log('After decreasing id=2 to zero (should be removed):', useCartStore.getState().cart);
useCartStore.getState().remove(1);
console.log('After removing id=1 (should be empty):', useCartStore.getState().cart);

console.log('All cartStore tests completed.');
