'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { setAuth, setLoading } = useAuthStore();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await authService.login({ email, password, rememberMe });
      setAuth(data.user, data.token);
      // Redirect to home or dashboard
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-surface-container-high">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Store size={28} />
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-2">
            Welcome Back
          </h1>
          <p className="text-body-md text-text-secondary">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              required
            />
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-label-lg font-semibold text-on-surface">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-outline text-primary focus:ring-primary"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer select-none">
              Remember for 30 days
            </label>
          </div>

          {error && (
            <div className="p-3 text-sm text-status-critical bg-status-critical/10 rounded-default border border-status-critical/20 text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full py-3 text-base"
          >
            Login <ArrowRight size={18} />
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <a href="#" className="text-primary font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
