'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import ReportsTable from '@/app/admin/components/ReportsTable';
import { useRouter } from 'next/navigation';

export default function LowStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await api.get('/reports/low-stock');
        setProducts(response.data);
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

    fetchLowStock();
  }, [router]);

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
    </div>
  );

  const columns = [
    { 
      header: 'Ürün Adı', 
      accessor: 'ProductName' 
    },
    { 
      header: 'Stok Miktarı', 
      accessor: 'Stock',
      render: (val: number) => val === undefined ? '-' : (
        <span className={`font-bold ${val < 10 ? 'text-red-600' : 'text-amber-600'}`}>
          {val}
        </span>
      )
    },
    { 
      header: 'Birim Fiyat', 
      accessor: 'Price',
      render: (val: number) => val === undefined ? '-' : `₺${val.toFixed(2)}`
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Düşük Stok Listesi</h1>
        <p className="text-slate-500">Stok miktarı 20&apos;nin altına düşen kritik ürünler</p>
      </div>

      <ReportsTable 
        columns={columns} 
        data={products} 
        emptyMessage="Kritik stok seviyesinde ürün bulunamadı." 
      />
    </div>
  );
}
