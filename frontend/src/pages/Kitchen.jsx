import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchKitchenOrders = async () => {
    try {
      const res = await orderService.getOrdersForKitchen();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Kitchen fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let newStatus = '';
    if (currentStatus === 'ORDER_RECEIVED') newStatus = 'PREPARING';
    else if (currentStatus === 'PREPARING') newStatus = 'READY';
    else if (currentStatus === 'READY') newStatus = 'OUT_FOR_DELIVERY'; // For pickup orders it might be different, but keeping it simple
    
    if (!newStatus) return;

    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        fetchKitchenOrders();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    if (filter === 'NEW') return order.status === 'ORDER_RECEIVED';
    if (filter === 'PREPARING') return order.status === 'PREPARING';
    if (filter === 'READY') return order.status === 'READY';
    return true;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ORDER_RECEIVED':
        return { label: 'New', color: 'bg-primary/20 text-primary', border: 'border-primary', action: 'START PREPARING', icon: 'play_arrow', btnColor: 'bg-primary' };
      case 'PREPARING':
        return { label: 'Preparing', color: 'bg-amber-100 text-amber-700', border: 'border-amber-500', action: 'MARK READY', icon: 'check_circle', btnColor: 'bg-emerald-600' };
      case 'READY':
        return { label: 'Ready', color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-500', action: 'DISPATCH', icon: 'local_shipping', btnColor: 'bg-blue-600' };
      default:
        return { label: status, color: 'bg-slate-100', border: 'border-slate-300', action: 'DONE', icon: 'done', btnColor: 'bg-slate-500' };
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-primary/20 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">restaurant_menu</span>
          <h1 className="text-2xl font-bold tracking-tight">Kitchen Queue</h1>
        </div>
        <div className="bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full border border-primary/30">
          <span className="text-primary font-bold text-lg">{orders.length} Active</span>
        </div>
      </header>

      <nav className="bg-background-light dark:bg-background-dark border-b border-primary/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex px-4 gap-6">
          {['ALL', 'NEW', 'PREPARING', 'READY'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`py-4 px-2 font-bold text-base transition-all border-b-4 ${filter === f ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 space-y-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading kitchen...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No orders in this queue.</div>
        ) : (
          filteredOrders.map((order) => {
            const config = getStatusConfig(order.status);
            return (
              <div key={order._id} className={`bg-white dark:bg-slate-800/50 rounded-xl border-l-8 ${config.border} shadow-lg p-5 flex flex-col gap-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.color} uppercase tracking-wider mb-2`}>
                      {config.label}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">#{order.orderId}</h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-primary font-bold text-lg">
                      <span className="material-symbols-outlined text-xl">timer</span>
                      <span>{Math.floor((new Date() - new Date(order.createdAt)) / 60000)}m</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Mins elapsed</p>
                  </div>
                </div>
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg text-slate-800 dark:text-slate-200">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-bold text-xl text-primary shrink-0">{item.quantity}x</span>
                      <p className="text-lg font-medium">
                        {item.name} 
                      </p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleUpdateStatus(order._id, order.status)}
                  className={`w-full h-14 ${config.btnColor} text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-colors active:scale-[0.98]`}
                >
                  <span className="material-symbols-outlined">{config.icon}</span>
                  {config.action}
                </button>
              </div>
            );
          })
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-primary/20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          <Link to="/kitchen" className="flex flex-col items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">Orders</span>
          </Link>
          <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-2xl">history</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">History</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">Stock</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-2xl">settings</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">Settings</span>
          </button>
        </div>
      </footer>
      <div className="h-24"></div>
    </div>
  );
};

export default Kitchen;
