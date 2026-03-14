import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderService from '../services/orderService';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    if (orderId) {
      try {
        const res = await orderService.getOrder(orderId);
        if (res.success) setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      }
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const statusSteps = [
    { key: 'ORDER_RECEIVED', label: 'Order Received', icon: 'check', desc: '12:30 PM' },
    { key: 'PREPARING', label: 'Preparing your food', icon: 'restaurant', desc: 'Chef is working on it' },
    { key: 'READY', label: 'Ready for Pickup', icon: 'inventory_2', desc: 'Packaged and ready' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'delivery_dining', desc: 'On the way' },
    { key: 'DELIVERED', label: 'Delivered', icon: 'home', desc: 'Enjoy your meal!' }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.key === order?.status);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <Link to="/" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Order Tracking</h2>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-24">
        {!order ? (
          <div className="p-8 text-center text-slate-500">Loading tracking data...</div>
        ) : (
          <>
            <section className="p-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Map" 
                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-3 rounded-lg shadow-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <span className="material-symbols-outlined text-primary">delivery_dining</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Estimated Arrival</p>
                      <p className="text-lg font-bold text-primary">{order.estimatedTime || 30} mins</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">ABC Restaurant</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Order #{order.orderId}</p>
                    </div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold animate-pulse uppercase">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 py-2">
              <h3 className="text-base font-bold mb-4 px-2">Delivery Progress</h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-primary/5">
                <div className="space-y-0">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx < currentStatusIndex || order.status === 'DELIVERED';
                    const isActive = idx === currentStatusIndex;
                    const isLast = idx === statusSteps.length - 1;

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`rounded-full p-1 text-white transition-colors ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                            <span className="material-symbols-outlined text-sm">{isCompleted ? 'check' : step.icon}</span>
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-10 transition-colors ${isCompleted ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`font-semibold ${isActive ? 'text-primary' : isCompleted ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            {step.label}
                          </p>
                          {(isActive || isCompleted) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="px-4 py-4">
              <h3 className="text-base font-bold mb-4 px-2">Order Summary</h3>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center">
                      <div className="flex gap-3">
                        <span className="text-primary font-bold">{item.quantity}x</span>
                        <div>
                          <p className="font-medium">{item.name}</p>
                        </div>
                      </div>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <p className="text-slate-500">Subtotal</p>
                    <p>${order.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <p className="text-slate-500">Delivery Fee</p>
                    <p>${order.deliveryFee.toFixed(2)}</p>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between items-center text-sm mb-1 text-green-600">
                      <p>Discount</p>
                      <p>-${order.discount.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="font-bold">Total</p>
                    <p className="font-bold text-primary text-lg">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-primary/10">
          <div className="max-w-md mx-auto">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">support_agent</span>
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
