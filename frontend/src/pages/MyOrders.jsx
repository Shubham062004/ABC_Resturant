import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import useCartStore from '../store/cartStore';

const MyOrders = () => {
  const navigate = useNavigate();
  const { cartItems, addItem } = useCartStore();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders().then(res => {
      if (res.success) {
        setOrders(res.data);
      }
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    if (filter === 'ONGOING') return ['ORDER_RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(order.status);
    if (filter === 'COMPLETED') return order.status === 'DELIVERED';
    if (filter === 'CANCELLED') return order.status === 'CANCELLED';
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ORDER_RECEIVED': return "text-blue-500 bg-blue-50 dark:bg-blue-950/30";
      case 'PREPARING': return "text-orange-500 bg-orange-50 dark:bg-orange-950/30";
      case 'READY': return "text-purple-500 bg-purple-50 dark:bg-purple-950/30";
      case 'OUT_FOR_DELIVERY': return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30";
      case 'DELIVERED': return "text-green-600 bg-green-50 dark:bg-green-950/30";
      case 'CANCELLED': return "text-red-500 bg-red-100 dark:bg-red-900/30";
      default: return "text-slate-500 bg-slate-100 dark:bg-slate-700";
    }
  };

  const handleReorder = async (order) => {
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

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">My Orders</h1>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-primary">person</span>
        </div>
      </header>

      <nav className="flex px-4 py-2 gap-4 overflow-x-auto no-scrollbar border-b border-primary/5">
        {['ALL', 'ONGOING', 'COMPLETED', 'CANCELLED'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap pb-2 border-b-2 text-sm transition-all ${filter === f ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 dark:text-slate-400 font-medium'}`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4 space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading your history...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
             <span className="material-symbols-outlined text-6xl mb-4">history</span>
             <p className="text-lg font-medium">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className={`bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm border border-primary/5 ${order.status === 'CANCELLED' ? 'opacity-80' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full w-fit mb-1 ${getStatusStyle(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Order #{order.orderId}</p>
                </div>
                <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-primary/5 flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary/40 text-3xl">restaurant</span>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm font-medium line-clamp-1 text-slate-700 dark:text-slate-200 mt-1">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/order-tracking?id=${order._id}`} className="py-2 px-4 rounded-lg border border-primary/30 text-primary font-bold text-sm hover:bg-primary/5 transition-colors text-center">
                  Track
                </Link>
                <button 
                  onClick={() => handleReorder(order)}
                  className="py-2 px-4 rounded-lg bg-primary text-white font-bold text-sm hover:brightness-110 transition-all"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-primary/10 px-4 pt-2 pb-6 flex justify-around">
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-medium">Search</span>
        </Link>
        <Link to="/my-orders" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
          <span className="text-[10px] font-bold">Orders</span>
        </Link>
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-[10px] font-medium">Favorites</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </footer>
    </div>
  );
};

export default MyOrders;
