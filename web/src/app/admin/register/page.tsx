'use client';

import { useForm } from 'react-hook-form';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (data: any) => {
    setError('');
    setSuccess('');
    try {
      await authService.signup(data);
      setSuccess('Kayıt başarıyla tamamlandı. Giriş yapabilirsiniz.');
      setTimeout(() => router.push('/admin/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt işlemi başarısız oldu.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Yönetici Kaydı</h1>
          <p className="text-slate-500 mt-2">Yeni bir yönetim hesabı oluşturun</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kullanıcı Adı</label>
            <Input 
              {...register('username', { required: 'Kullanıcı adı gereklidir' })} 
              placeholder="Kullanıcı adınız" 
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <Input 
              type="password" 
              {...register('password', { required: 'Şifre gereklidir', minLength: { value: 6, message: 'Şifre en az 6 karakter olmalıdır' } })} 
              placeholder="••••••••" 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full py-3 text-lg">Kayıt Ol</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Zaten hesabınız var mı? <Link href="/admin/login" className="text-blue-600 hover:underline font-medium">Giriş Yapın</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
