'use client';

import { useForm } from 'react-hook-form';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { staffAuth, isLoading } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && staffAuth.isAuthenticated) {
      router.push('/admin');
    }
  }, [staffAuth.isAuthenticated, isLoading, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      const response = await authService.staffLogin(data);
      const token = response.token;
      staffAuth.setAuth({ id: '1', email: data.email, role: 'admin' }, token);
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Yönetici Girişi</h1>
          <p className="text-slate-500 mt-2">NovaStore yönetim paneline hoş geldiniz</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <Input
              type="email"
              {...register('email', { required: 'E-posta gereklidir' })}
              placeholder="admin@novastore.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <Input
              type="password"
              {...register('password', { required: 'Şifre gereklidir' })}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3 text-lg">Giriş Yap</Button>
        </form>
      </div>
    </div>
  );
}