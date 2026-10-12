import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrder(id).then(res => {
      if (res.success) {
        setOrder(res.data);
      }
      setLoading(false);
    });
  }, [id]);

  const handleReorder = async () => {
    try {
      const res = await orderService.reorder(order._id);
      if (res.success) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Reorder failed:', err);
      alert('Failed to reorder. Please try manual ordering.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  if (!order) return <div className="p-8 text-center text-slate-500">Order not found.</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
        <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-primary/10">
          <Link to="/my-orders" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Order Details</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          <section className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  {order.status.replace('_', ' ')}
                </span>
                <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold pt-1">#{order.orderId}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10">
                 <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
              </div>
            </div>
            {['ORDER_RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(order.status) && (
               <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
                 <div className="h-full bg-primary w-2/3 rounded-full"></div>
               </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold px-1">Items List</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-primary/5">
                  <div className="bg-primary/5 aspect-square rounded-lg size-12 shrink-0 flex items-center justify-center">
                     <span className="material-symbols-outlined text-primary/40">fastfood</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-slate-100 text-base font-semibold truncate">{item.name}</p>
                    <p className="text-primary text-sm font-medium">x{item.quantity}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-slate-900 dark:text-slate-100 text-base font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-primary/5 space-y-3">
            <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold mb-1">Payment Summary</h3>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-sm">
                <span>Discounts</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-slate-900 dark:text-slate-100 font-bold">Total</span>
              <span className="text-primary text-xl font-extrabold">${order.total.toFixed(2)}</span>
            </div>
          </section>
          <div className="h-24"></div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-primary/10 max-w-md mx-auto">
          <button 
            onClick={handleReorder}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">reorder</span>
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
