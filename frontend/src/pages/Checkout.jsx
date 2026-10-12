import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import orderService from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const [deliveryType, setDeliveryType] = useState('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [loading, setLoading] = useState(false);

  const deliveryFee = deliveryType === 'DELIVERY' ? 2.50 : 0;
  const discount = cartItems.length > 0 ? 5.00 : 0;
  const total = totalPrice + deliveryFee - discount;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        address: {
          street: "123 Orange Street",
          city: "Minimal City",
          zip: "10001"
        },
        paymentMethod,
        deliveryType,
        subtotal: totalPrice,
        deliveryFee,
        discount,
        total
      };

      const response = await orderService.createOrder(orderData);
      if (response.success) {
        clearCart();
        navigate(`/order-success?id=${response.data._id}`);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <Link to="/cart" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Checkout</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-32">
        <section className="mt-6">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 px-1">Delivery Information</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                  <span className="material-symbols-outlined">home</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-slate-900 dark:text-slate-100 text-base font-semibold">Home</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-snug line-clamp-2">123 Orange Street, Minimal City, 10001</p>
                </div>
              </div>
              <button className="flex shrink-0 items-center justify-center rounded-lg h-8 px-4 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                Change
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button className="flex items-center text-primary gap-2 text-sm font-bold hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add new address</span>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 px-1">Delivery Options</h2>
          <div className="flex gap-3 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
            <button 
              onClick={() => setDeliveryType('DELIVERY')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${deliveryType === 'DELIVERY' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary font-bold' : 'text-slate-600 dark:text-slate-400 font-semibold'}`}
            >
              <span className="material-symbols-outlined">delivery_dining</span>
              Delivery
            </button>
            <button 
              onClick={() => setDeliveryType('TAKEAWAY')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${deliveryType === 'TAKEAWAY' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary font-bold' : 'text-slate-600 dark:text-slate-400 font-semibold'}`}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Takeaway
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 px-1">Payment Method</h2>
          <div className="space-y-3">
            <label 
              onClick={() => setPaymentMethod('ONLINE')}
              className={`relative flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border-2 shadow-sm cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center rounded-lg size-10 ${paymentMethod === 'ONLINE' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className={`font-semibold ${paymentMethod === 'ONLINE' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>Online Payment</span>
              </div>
              <input checked={paymentMethod === 'ONLINE'} readOnly className="w-5 h-5 text-primary border-slate-300" name="payment" type="radio" />
            </label>
            <label 
              onClick={() => setPaymentMethod('COD')}
              className={`relative flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border-2 shadow-sm cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center rounded-lg size-10 ${paymentMethod === 'COD' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <span className="material-symbols-outlined">handyman</span>
                </div>
                <span className={`font-semibold ${paymentMethod === 'COD' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>Cash on Delivery</span>
              </div>
              <input checked={paymentMethod === 'COD'} readOnly className="w-5 h-5 text-primary border-slate-300" name="payment" type="radio" />
            </label>
          </div>
        </section>

        <section className="mt-8 mb-8">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold mb-3 px-1">Order Summary</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Fee</span>
              <span className="font-medium">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-500">
              <span>Discount</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total Price</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 pb-8 z-50">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handlePlaceOrder}
            disabled={loading || cartItems.length === 0}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : (
              <>
                <span>Place Order</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">By placing order you agree to our Terms & Conditions</p>
        </div>
      </div>
    </div>
  );
};


export default Checkout;
