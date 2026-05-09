'use client';

import { useForm } from 'react-hook-form';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    setError('');
    try {
      const response = await authService.login(data);
      setAuth({ id: '1', email: data.username, name: data.username }, response.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Adı</label>
            <Input 
              {...register('username', { required: 'Kullanıcı adı gereklidir' })} 
              placeholder="Admin kullanıcı adınız" 
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <Input 
              type="password" 
              {...register('password', { required: 'Şifre gereklidir' })} 
              placeholder="••••••••" 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3 text-lg">Giriş Yap</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Hesabınız yok mu? <Link href="/admin/register" className="text-blue-600 hover:underline font-medium">Kayıt Olun</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
