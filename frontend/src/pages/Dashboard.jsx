import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getAllOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let newStatus = '';
    if (currentStatus === 'ORDER_RECEIVED') newStatus = 'PREPARING';
    else if (currentStatus === 'PREPARING') newStatus = 'READY';
    else if (currentStatus === 'READY') newStatus = 'DELIVERED';
    
    if (!newStatus) return;

    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    if (filter === 'NEW') return order.status === 'ORDER_RECEIVED';
    if (filter === 'PREPARING') return order.status === 'PREPARING';
    if (filter === 'READY') return order.status === 'READY';
    if (filter === 'DELIVERED') return order.status === 'DELIVERED';
    return true;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ORDER_RECEIVED':
        return { 
          label: 'New', 
          color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
          action: 'Accept',
          icon: 'check_circle',
          btnClass: 'bg-primary hover:bg-primary/90'
        };
      case 'PREPARING':
        return { 
          label: 'Preparing', 
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          action: 'Mark Ready',
          icon: 'soup_kitchen',
          btnClass: 'bg-blue-600'
        };
      case 'READY':
        return { 
          label: 'Ready', 
          color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
          action: 'Mark Delivered',
          icon: 'delivery_dining',
          btnClass: 'bg-green-600'
        };
      case 'DELIVERED':
        return { 
          label: 'Delivered', 
          color: 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-slate-200',
          action: 'Completed',
          icon: 'verified',
          btnClass: 'bg-slate-400 opacity-50 cursor-not-allowed'
        };
      default:
        return { label: status, color: 'bg-slate-100', action: 'None', icon: 'info' };
    }
  };

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => curr.status === 'DELIVERED' ? acc + curr.total : acc, 0),
    activeOrders: orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length,
    newOrders: orders.filter(o => o.status === 'ORDER_RECEIVED').length
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">ABC Restaurant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Order Manager Dashboard</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
             <div className="hidden md:flex gap-6">
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Revenue</p>
                   <p className="text-sm font-bold text-emerald-600">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Active</p>
                   <p className="text-sm font-bold text-primary">{stats.activeOrders}</p>
                </div>
             </div>
             <button className="relative p-2 rounded-full hover:bg-primary/10 transition-colors">
               <span className="material-symbols-outlined">notifications</span>
               {stats.newOrders > 0 && (
                 <span className="absolute top-2 right-2 flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                 </span>
               )}
             </button>
          </div>
        </div>
      </header>

      <div className="sticky top-[72px] z-40 bg-background-light dark:bg-background-dark py-3 overflow-x-auto no-scrollbar border-b border-primary/5">
        <div className="flex gap-3 px-4 max-w-4xl mx-auto">
          {['ALL', 'NEW', 'PREPARING', 'READY', 'DELIVERED'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-semibold transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-primary/20 text-slate-700 dark:text-slate-200'}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
              {f === 'NEW' && stats.newOrders > 0 && (
                <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full ml-1">{stats.newOrders}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 space-y-4 max-w-4xl mx-auto pb-24">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">No orders found for this category.</div>
        ) : (
          filteredOrders.map((order) => {
            const config = getStatusConfig(order.status);
            return (
              <div key={order._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{order.customer?.name || "Guest"}</p>
                        <p className="text-xs text-slate-500">Order #{order.orderId}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-700/50">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{item.quantity}x {item.name}</span>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
                      <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateStatus(order._id, order.status)}
                      disabled={order.status === 'DELIVERED'}
                      className={`${config.btnClass} text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:active:scale-100`}
                    >
                      <span className="material-symbols-outlined text-sm">{config.icon}</span>
                      {config.action}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 pb-6 pt-2 px-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-slate-400">
          <Link to="/management/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>
          </Link>
          <Link to="/" className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">restaurant_menu</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
          </Link>
          <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Analytics</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
