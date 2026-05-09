'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import ReportsTable from '@/app/admin/components/ReportsTable';
import { Trophy } from 'lucide-react';

export default function RevenueRankingPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get('/reports/revenue-ranking');
        setRankings(response.data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const columns = [
    { 
      header: 'Sıra', 
      accessor: 'rank',
      render: (_, __, itemIdx) => (
        <div className="flex items-center gap-2">
          {itemIdx === 0 && <Trophy size={16} className="text-yellow-500" />}
          <span className="font-bold text-slate-700">{itemIdx + 1}.</span>
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
      render: (val: number) => (
        <span className="font-bold text-slate-900">₺{val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      )
    },
  ];

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;

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
