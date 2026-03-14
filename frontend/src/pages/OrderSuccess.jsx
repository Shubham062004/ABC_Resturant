import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import orderService from '../services/orderService';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      orderService.getOrder(orderId).then(res => {
        if (res.success) setOrder(res.data);
      });
    }
  }, [orderId]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden max-w-md mx-auto shadow-sm">
        <div className="flex items-center p-4 pb-2 justify-between">
          <Link to="/" className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-2xl">close</span>
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Order Status</h2>
        </div>

        <div className="px-4 py-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-full scale-110"></div>
              <div className="absolute inset-0 bg-primary/20 rounded-full scale-125 opacity-50"></div>
              <div className="z-10 bg-primary text-white w-24 h-24 rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="material-symbols-outlined text-5xl font-bold">celebration</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-slate-900 dark:text-slate-100 tracking-tight text-3xl font-bold leading-tight">Order Placed Successfully!</h1>
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">Your delicious meal is being prepared at ABC Restaurant.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-primary/10 dark:bg-primary/20 border border-primary/5">
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal uppercase tracking-wider">Order NUMBER</p>
              <p className="text-primary tracking-light text-2xl font-bold leading-tight truncate">{order?.orderId || "..."}</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal uppercase tracking-wider">Arrive in</p>
              <p className="text-slate-900 dark:text-slate-100 tracking-light text-2xl font-bold leading-tight">{order?.estimatedTime || 30} min</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-xl min-h-[160px] relative border border-slate-200 dark:border-slate-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDIyWpJSsmH6VRPrHS4Ox6qbrfnheZKA6nBXkbc_M8uluZrs4jbYCsL02hp-wrl3l8M92CQiqfqYHQlT8MqL5BBd2WjjHlfU5OrLz20IekLcVfT2ALzXPgjKk8rfiwmk3_ftvxAOmAcZ5kMqh0RlNT12LpugiHVd-9MJg_Tr1P8jzWaBuc89diTuDw4fP3bWgB1FE0r1uPSKRhtlZNtPXeRvnl2Z5Rg_3bw87fPmJavrGD8U9kN_0kjPM-tvCV0y3JOM27oK29Mjp2h')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="relative p-4 flex items-center gap-3">
              <div className="bg-primary p-2 rounded-full shadow-md">
                <span className="material-symbols-outlined text-white text-sm">restaurant</span>
              </div>
              <div className="bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs font-semibold">Kitchen is busy!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 space-y-3">
          <Link to={`/order-tracking?id=${order?._id}`} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">local_shipping</span>
            Track Order
          </Link>
          <Link to="/" className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-center">
            Continue Browsing
          </Link>
        </div>
        <div className="h-8 bg-background-light dark:bg-background-dark"></div>
      </div>
    </div>
  );
};

export default OrderSuccess;
