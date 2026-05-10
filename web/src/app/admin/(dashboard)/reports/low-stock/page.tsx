'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import ReportsTable from '@/app/admin/components/ReportsTable';
import { Button } from '@/components/ui/Button';

export default function LowStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await api.get('/reports/low-stock');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching low stock:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const columns = [
    { 
      header: 'Ürün Adı', 
      accessor: 'ProductName' 
    },
    { 
      header: 'Kategori', 
      accessor: 'Category', 
      render: (_, item: { Category?: { CategoryName: string } }) => item.Category?.CategoryName || 'Belirtilmemiş' 
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
      accessor: 'UnitPrice',
      render: (val: number) => val === undefined ? '-' : `₺${val.toFixed(2)}`
    },
    { 
      header: 'Aksiyon', 
      accessor: 'id',
      render: (_, item: { ProductName: string }) => (
        <Button size="sm" onClick={() => alert(`${item.ProductName} için sipariş oluşturuluyor...`)}>
          Siparişe Dönüştür
        </Button>
      )
    },
  ];

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;

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
