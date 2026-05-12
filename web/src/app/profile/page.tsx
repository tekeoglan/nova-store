'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { orderService, OrderResponse } from '@/services/orderService';
import { LogOut, Package, User, Mail, MapPin, UserCircle, ShoppingBag } from 'lucide-react';

interface UserProfile {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  city: string | null;
  customerId: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const userAuth = useAuthStore((state) => state.userAuth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userAuth.isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [profileData, ordersData] = await Promise.all([
          authService.getProfile(),
          orderService.getOrders(),
        ]);
        setProfile(profileData);
        setOrders(ordersData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load profile';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userAuth.isAuthenticated, router]);

  const handleLogout = () => {
    userAuth.logout();
    router.push('/');
  };

  if (!userAuth.isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-status-critical mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        <h1 className="text-headline-lg font-bold text-on-surface">My Profile</h1>

        {profile && (
          <section className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle size={36} className="text-primary" />
              </div>
              <div>
                <h2 className="text-headline-md font-bold text-on-surface">{profile.fullName}</h2>
                <p className="text-sm text-text-secondary">@{profile.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg">
                <User size={20} className="text-text-secondary shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Full Name</p>
                  <p className="text-sm font-medium text-on-surface">{profile.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg">
                <Mail size={20} className="text-text-secondary shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="text-sm font-medium text-on-surface">{profile.email}</p>
                </div>
              </div>
              {profile.city && (
                <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-lg">
                  <MapPin size={20} className="text-text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-text-secondary">City</p>
                    <p className="text-sm font-medium text-on-surface">{profile.city}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package size={22} className="text-primary" />
              <h2 className="text-headline-md font-bold text-on-surface">Order History</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-outline mb-4" />
              <p className="text-text-secondary mb-4">No orders yet</p>
              <Button onClick={() => router.push('/')}>Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.orderId} className="border border-outline-variant rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">Order #{order.orderId}</p>
                      <p className="text-xs text-text-secondary">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <p className="text-headline-sm font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-on-surface">{item.productName}</span>
                        <span className="text-text-secondary">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-center pb-8">
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-8 py-3"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Log Out
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
