'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

interface CategoryStat {
  CategoryName: string;
  productCount: number;
}

export default function CategoryStatsPage() {
  const [data, setData] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/category-stats');
        setData(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 403) {
          setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
        } else if (error.response?.status === 401) {
          router.push('/admin/login');
        } else {
          setError('Veriler yüklenirken bir hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Kategori İstatistikleri</h1>
        <p className="text-slate-500">Kategorilere göre ürün dağılımı</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-[500px] flex flex-col items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="productCount"
              nameKey="CategoryName"
            >
              {data.map((_entry, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
