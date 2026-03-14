import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    orderService.getOrder(id).then(res => {
      if (res.success) {
        setOrder(res.data);
        setStatus(res.data.status);
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      const res = await orderService.updateOrderStatus(order._id, status);
      if (res.success) {
        alert('Status updated successfully!');
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderService.cancelOrder(order._id);
      if (res.success) {
        setOrder(prev => ({ ...prev, status: 'CANCELLED' }));
        setStatus('CANCELLED');
        alert('Order cancelled.');
      }
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading order...</div>;
  if (!order) return <div className="p-8 text-center text-slate-500">Order not found.</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pb-24">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-lg font-bold leading-tight">Order #{order.orderId}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-1">Customer Information</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-primary/5 flex items-start gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{order.customer?.name || "Guest"}</p>
              <p className="text-primary font-medium text-sm flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm">call</span>
                {order.customer?.phone || "N/A"}
              </p>
              <div className="mt-3 flex items-start gap-2 text-slate-600 dark:text-slate-300 text-sm">
                <span className="material-symbols-outlined text-sm mt-0.5 text-primary">location_on</span>
                <div>
                   <p>{order.address.street}</p>
                   <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-primary/5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Manage Order Status</h2>
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-medium text-slate-400 mb-1 ml-1" htmlFor="order-status">Current Status</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-background-light dark:bg-slate-800 border border-primary/10 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-slate-100 font-medium" 
                  id="order-status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ORDER_RECEIVED">New</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  expand_more
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={handleUpdateStatus}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined">update</span>
                Update Status
              </button>
              <button 
                onClick={handleCancelOrder}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <span className="material-symbols-outlined">cancel</span>
                Cancel Order
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-1">Order Items</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 divide-y divide-primary/5">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center gap-4">
                <div className="size-14 rounded-lg bg-primary/5 flex items-center justify-center text-primary overflow-hidden">
                   <span className="material-symbols-outlined text-primary/30">fastfood</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                    <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-primary/5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Payment Summary</h2>
          <div className="flex items-center gap-3 p-3 bg-background-light dark:bg-slate-800 rounded-lg mb-4">
            <span className="material-symbols-outlined text-slate-400">payments</span>
            <p className="text-sm font-medium">Payment Method: <span className="font-bold uppercase">{order.paymentMethod}</span></p>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded uppercase ${order.paymentStatus === 'PAID' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>
              {order.paymentStatus}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <hr className="border-primary/10 my-2" />
            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-slate-100">
              <span>Total Amount</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-900 border-t border-primary/10 px-4 pb-6 pt-3">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined fill-[1]">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Orders</span>
          </Link>
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">restaurant_menu</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminOrderDetails;
