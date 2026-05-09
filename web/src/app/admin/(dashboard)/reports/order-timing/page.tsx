'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import ReportsTable from '@/app/admin/components/ReportsTable';

export default function OrderTimingPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiming = async () => {
      try {
        const response = await api.get('/reports/order-timing');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching timing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiming();
  }, []);

  const getAgeColor = (days: number) => {
    if (days <= 7) return 'bg-green-100 text-green-700 border-green-200';
    if (days <= 30) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const columns = [
    { header: 'Sipariş ID', accessor: 'OrderID' },
    { header: 'Sipariş Tarihi', accessor: 'OrderDate' },
    { 
      header: 'Geçen Gün Sayısı', 
      accessor: 'daysPassed',
      render: (val: number) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getAgeColor(val)}`}>
          {val} Gün
        </span>
      )
    },
  ];

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Sipariş Yaşlandırma</h1>
        <p className="text-slate-500">Siparişlerin üzerinden geçen süreye göre analiz</p>
      </div>

      <ReportsTable 
        columns={columns} 
        data={orders} 
        emptyMessage="Sipariş verisi bulunamadı." 
      />
    </div>
  );
}
