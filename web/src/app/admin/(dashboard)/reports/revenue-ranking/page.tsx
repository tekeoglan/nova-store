'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import { useRouter } from 'next/navigation';
import ReportsTable from '@/app/admin/components/ReportsTable';
import { Trophy } from 'lucide-react';

interface RevenueRanking {
  FullName: string;
  totalRevenue: number;
}

export default function RevenueRankingPage() {
  const [rankings, setRankings] = useState<RevenueRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get('/reports/revenue-ranking');
        setRankings(response.data);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 403) {
          setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
        } else if (err.response?.status === 401) {
          router.push('/admin/login');
        } else {
          setError('Veriler yüklenirken bir hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [router]);

  const columns = [
    { 
      header: 'Sıra', 
      accessor: 'rank',
      render: (_: unknown, _item: RevenueRanking, index: number) => (
        <div className="flex items-center gap-2">
          {index === 0 && <Trophy size={16} className="text-yellow-500" />}
          <span className="font-bold text-slate-700">{index + 1}.</span>
        </div>
      )
    },
    { 
      header: 'Müşteri', 
      accessor: 'FullName' 
    },
    { 
      header: 'Toplam Harcama', 
      accessor: 'totalRevenue',
      render: (val: number | null | undefined) => (
        <span className="font-bold text-slate-900">₺{(val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      )
    },
  ];

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ciro Sıralaması</h1>
        <p className="text-slate-500">En yüksek harcama yapan değerli müşteriler</p>
      </div>

      <ReportsTable 
        columns={columns} 
        data={rankings} 
        emptyMessage="Sıralama verisi bulunamadı." 
      />
    </div>
  );
}
