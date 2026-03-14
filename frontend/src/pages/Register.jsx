import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // data contains: name, email, phone, password, confirmPassword, terms
      const { confirmPassword, terms, ...registerData } = data;
      const res = await registerUser(registerData);
      setLogin(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="flex items-center p-4 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
          <Link to="/login" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 cursor-pointer">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
          </Link>
          <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10">Sign Up</h2>
        </header>

        <main className="flex-1 px-6 pb-12">
          {/* Hero Header */}
          <div className="pt-6 pb-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-4xl">restaurant</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Join ABC Restaurant for exclusive offers and faster ordering.</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                <input
                  {...register('name', { required: 'Full name is required' })}
                  className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">call</span>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="+91 98765-43210"
                  type="tel"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="example@mail.com"
                  type="email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full pl-10 pr-10 py-3.5 bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="mt-1">
                <div className="flex gap-1 h-1.5 w-full">
                  <div className={`flex-1 rounded-full ${password.length > 0 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                  <div className={`flex-1 rounded-full ${password.length > 4 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                  <div className={`flex-1 rounded-full ${password.length > 7 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                  <div className={`flex-1 rounded-full ${password.length > 10 ? 'bg-primary' : 'bg-primary/20'}`}></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Password strength: <span className="text-primary font-medium">
                    {password.length === 0 ? 'None' : password.length < 5 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong'}
                  </span>
                </p>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_reset</span>
                <input
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="Repeat your password"
                  type="password"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 pt-2">
              <input
                {...register('terms', { required: 'You must agree to the terms' })}
                className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary focus:ring-offset-0 bg-white dark:bg-slate-800"
                id="terms"
                type="checkbox"
              />
              <label className="text-sm text-slate-600 dark:text-slate-400 leading-tight" htmlFor="terms">
                I agree to the <a className="text-primary font-medium" href="#">Terms of Service</a> and <a className="text-primary font-medium" href="#">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

            {/* Create Account Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Already have an account */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account? <Link to="/login" className="text-primary font-bold">Log In</Link>
            </p>
          </div>

          {/* Social Signup */}
          <div className="mt-10">
            <div className="relative flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Or Sign up with</span>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwU-z-u206aihSZpuF8tWZzAycDfMDyT_IR6JdvFsFZCxC53OUJez5FrDd7QZFvU0BzURHzP4gXibj6eIPqO2Mr1eo7k5UwAkh_0t82ZytNFC3poDFU5gzBVynxQhgNDyEvkqMn8Wr51ikQDW89pB9HTDQnXcU3nXnqBxGpOeT9GU1P09sPTJsHKGWqvUDIDgDncPPq86hnamjmA7NvioL3y6SAy9FZ_WLfIzl8hsOcHd5bNGCbdcYoQ0cDJMhxHE9MF4IsF3nGgmd"/>
                <span className="text-sm font-semibold">Google</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;
