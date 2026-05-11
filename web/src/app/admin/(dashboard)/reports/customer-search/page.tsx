'use client';

import { useState } from 'react';
import api from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface OrderDetail {
  Product: { ProductName: string };
  Quantity: number;
}

interface CustomerOrder {
  OrderID: number;
  OrderDate: string;
  TotalAmount: number;
  OrderDetails: OrderDetail[];
}

interface Customer {
  FullName: string;
  City: string;
  Orders: CustomerOrder[];
}

export default function CustomerSearchPage() {
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');
    setCustomer(null);
    try {
      const response = await api.get(`/reports/customer-purchases/${encodeURIComponent(query)}`);
      setCustomer(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Müşteri bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Müşteri Detayları</h1>
        <p className="text-slate-500">Müşteri ismiyle arama yaparak satın alma geçmişini görüntüleyin</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-12 max-w-2xl">
        <Input 
          placeholder="Müşteri adı giriniz..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Aranıyor...' : 'Ara'}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-8">
          {error}
        </div>
      )}

      {customer && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{customer.FullName}</h2>
              <p className="text-slate-500">{customer.City}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 uppercase font-semibold">Sipariş Sayısı</p>
              <p className="text-2xl font-bold text-slate-900">{customer.Orders?.length || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customer.Orders?.map((order, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-sm font-medium text-slate-500">Sipariş #{order.OrderID}</span>
                  <span className="text-sm text-slate-400">{order.OrderDate}</span>
                </div>
                <div className="space-y-2">
                  {order.OrderDetails?.map((detail, dIdx) => (
                    <div key={dIdx} className="flex justify-between text-sm">
                      <span className="text-slate-600">{detail.Product?.ProductName}</span>
                      <span className="font-medium text-slate-900">x{detail.Quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">Toplam</span>
                  <span className="text-lg font-bold text-slate-900">₺{order.TotalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
