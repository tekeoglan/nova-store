'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const userAuth = useAuthStore((state) => state.userAuth);

  useEffect(() => {
    if (userAuth.isAuthenticated) {
      router.push('/');
    }
  }, [userAuth.isAuthenticated, router]);

  if (redirecting) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await authService.signup({ username, password, fullName, email });
      const loginResponse = await authService.login({ username, password });
      useAuthStore.getState().userAuth.setAuth(
        { id: username, email: username },
        loginResponse.token
      );
      setRedirecting(true);
      router.push('/');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
            <h1 className="text-headline-md font-bold text-on-surface text-center mb-2">
              Create Account
            </h1>
            <p className="text-body-md text-text-secondary text-center mb-8">
              Sign up to start shopping
            </p>

            {error && (
              <div className="mb-6 p-3 bg-status-critical/10 text-status-critical text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-muted border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-muted border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-muted border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
                  placeholder="johndoe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-muted border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-muted border border-outline rounded-lg text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Repeat your password"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
