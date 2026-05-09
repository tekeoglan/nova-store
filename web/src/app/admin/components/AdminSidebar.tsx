import Link from 'next/link';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  History, 
  UserSearch, 
  PieChart, 
  Trophy, 
  Clock, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Düşük Stok', href: '/admin/reports/low-stock', icon: AlertTriangle },
  { name: 'Sipariş Geçmişi', href: '/admin/reports/order-history', icon: History },
  { name: 'Müşteri Detayları', href: '/admin/reports/customer-search', icon: UserSearch },
  { name: 'Kategori İstatistikleri', href: '/admin/reports/category-stats', icon: PieChart },
  { name: 'Ciro Sıralaması', href: '/admin/reports/revenue-ranking', icon: Trophy },
  { name: 'Sipariş Yaşlandırma', href: '/admin/reports/order-timing', icon: Clock },
];

export default function AdminSidebar() {
  const { logout } = useAuthStore();

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        NovaStore Admin
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
