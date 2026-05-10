'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/services/authService';
import ReportsTableComp from '@/app/admin/components/ReportsTable';
import { Input } from '@/components/ui/Input';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    customer: '',
    date: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/reports/order-history');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (filters.customer) {
      filtered = filtered.filter((o: any) => 
        o.Customer?.FullName?.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }
    if (filters.date) {
      filtered = filtered.filter((o: any) => o.OrderDate?.includes(filters.date));
    }
    return filtered;
  }, [filters, orders]);

  const columns = [
    { header: 'Sipariş Tarihi', accessor: 'OrderDate' },
    { 
      header: 'Müşteri', 
      accessor: 'Customer', 
      render: (_, item: any) => item.Customer?.FullName 
    },
    { 
      header: 'Şehir', 
      accessor: 'Customer', 
      render: (_, item: any) => item.Customer?.City 
    },
    { 
      header: 'Toplam Tutar', 
      accessor: 'TotalAmount',
      render: (val: number) => `₺${val.toFixed(2)}`
    },
  ];

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Sipariş Geçmişi</h1>
        <p className="text-slate-500">Tüm siparişlerin tarihsel dökümü</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Input 
          placeholder="Müşteri adına göre ara..." 
          value={filters.customer}
          onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
        />
        <Input 
          type="date" 
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>

      <ReportsTableComp 
        columns={columns} 
        data={filteredOrders} 
        emptyMessage="Sipariş bulunamadı." 
      />
    </div>
  );
}
