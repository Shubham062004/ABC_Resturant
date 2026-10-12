import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const Cart = () => {
  const { cartItems, removeItem, updateQuantity, totalPrice } = useCartStore();

  const discount = cartItems.length > 0 ? 5.00 : 0;
  const deliveryFee = cartItems.length > 0 ? 2.50 : 0;
  const total = cartItems.length > 0 ? totalPrice + deliveryFee - discount : 0;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold">Your Cart</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <span className="material-symbols-outlined text-6xl mb-4">shopping_basket</span>
            <p className="text-lg font-medium">Your cart is empty</p>
            <Link to="/" className="text-primary font-bold mt-2">Go add some tasty food!</Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-800/50 p-3 rounded-xl shadow-sm border border-primary/5 flex gap-4 items-center">
              <div className="size-20 rounded-lg overflow-hidden shrink-0 bg-primary/10">
                <img alt={item.name} className="w-full h-full object-cover" src={item.img} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base truncate">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <p className="text-primary font-medium text-sm mt-1">${item.price.toFixed(2)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-primary/5 rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="size-7 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-sm text-primary"
                    >
                      <span className="material-symbols-outlined text-base">remove</span>
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="size-7 flex items-center justify-center rounded-full bg-primary text-white shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {cartItems.length > 0 && (
          <>
            <div className="mt-8">
              <p className="text-sm font-semibold mb-2">Have a coupon code?</p>
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-white dark:bg-slate-800 border border-primary/20 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary" 
                  placeholder="Enter code" 
                  type="text" 
                />
                <button className="bg-primary/10 text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary/20 transition-colors">Apply</button>
              </div>
            </div>

            <div className="mt-8 space-y-3 bg-white dark:bg-slate-800/30 p-4 rounded-xl border border-primary/5">
              <h2 className="text-base font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm">Discount</span>
                <span className="text-sm font-medium">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span className="text-sm">Delivery Fee</span>
                <span className="text-sm font-medium">${deliveryFee.toFixed(2)}</span>
              </div>
              <hr className="border-primary/10 my-2" />
              <div className="flex justify-between items-center text-slate-900 dark:text-slate-100">
                <span className="text-lg font-bold">Total Price</span>
                <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </main>

      {cartItems.length > 0 && (
        <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 border-t border-primary/10">
          <Link to="/checkout" className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform">
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </footer>
      )}

      <div className="flex gap-2 border-t border-primary/10 bg-background-light dark:bg-background-dark px-4 pb-6 pt-2">
        <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400">
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined">home</span>
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wide">Home</p>
        </Link>
        <Link to="/" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400">
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined">search</span>
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wide">Search</p>
        </Link>
        <Link to="/cart" className="flex flex-1 flex-col items-center justify-end gap-1 text-primary">
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wide">Cart</p>
        </Link>
        <Link to="/profile" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-400">
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined">person</span>
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wide">Profile</p>
        </Link>
      </div>
    </div>
  );
};

export default Cart;

