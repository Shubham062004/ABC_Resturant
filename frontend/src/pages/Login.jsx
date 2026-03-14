import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'customer@email.com',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(data);
      setLogin(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 font-display text-slate-900 dark:text-slate-100 min-h-screen relative overflow-x-hidden bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] space-y-8 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">restaurant</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">ABC Restaurant</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Savor the moment</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email/Phone Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium px-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              <input
                {...register('email', { required: 'Email is required' })}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                } bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none`}
                placeholder="customer@email.com"
                type="email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 px-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium">Password</label>
              <a className="text-sm font-semibold text-primary hover:opacity-80" href="#">Forgot?</a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input
                {...register('password', { required: 'Password is required' })}
                className={`w-full pl-12 pr-12 py-4 rounded-xl border ${
                  error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none`}
                type={showPassword ? "text" : "password"}
                placeholder="********"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1 px-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-2 disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="relative py-4 flex items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          {/* OTP Login Option */}
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined">sms</span>
            Login with OTP
          </button>
        </form>

        {/* Footer Signup */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
          Don't have an account? 
          <Link to="/signup" className="text-primary font-bold ml-1">Sign up</Link>
        </p>
import React from 'react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input className="border rounded w-full py-2 px-3 text-gray-700" type="email" placeholder="Email" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input className="border rounded w-full py-2 px-3 text-gray-700" type="password" placeholder="Password" />
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" type="button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
