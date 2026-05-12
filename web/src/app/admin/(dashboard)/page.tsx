'use client';

import { useEffect, useState } from 'react';
import api from '@/services/authService';
import MetricCard from '@/app/admin/components/MetricCard';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we'd have a /api/reports/summary endpoint
        // For now, we'll fetch low-stock and other available data to simulate
        const [productsRes, lowStockRes, orderHistoryRes] = await Promise.all([
          api.get('/products'),
          api.get('/reports/low-stock'),
          api.get('/reports/order-history')
        ]);

        const products = productsRes.data;
        const lowStock = lowStockRes.data;
        const orders = orderHistoryRes.data;
        const totalRevenue = orders.reduce((acc: number, order: { TotalAmount: number }) => acc + (order.TotalAmount || 0), 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          lowStockCount: lowStock.length,
        });
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-8 text-slate-500">Yükleniyor...</div>;

  const quickLinks = [
    { name: 'Düşük Stok Raporu', href: '/admin/reports/low-stock', icon: AlertTriangle, color: 'text-red-600' },
    { name: 'Sipariş Geçmişi', href: '/admin/reports/order-history', icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Ciro Sıralaması', href: '/admin/reports/revenue-ranking', icon: DollarSign, color: 'text-green-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Genel Bakış</h1>
        <p className="text-slate-500">Mağazanızın güncel durumu ve kritik metrikler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          title="Toplam Ürün" 
          value={stats.totalProducts} 
          icon={Package} 
          color="blue" 
        />
        <MetricCard 
          title="Toplam Sipariş" 
          value={stats.totalOrders} 
          icon={ShoppingCart} 
          color="green" 
        />
        <MetricCard 
          title="Toplam Ciro" 
          value={`₺${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="amber" 
        />
        <MetricCard 
          title="Kritik Stok" 
          value={stats.lowStockCount} 
          icon={AlertTriangle} 
          color="red" 
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-50 ${link.color}`}>
                  <link.icon size={20} />
                </div>
                <span className="font-medium text-slate-700">{link.name}</span>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
