'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Trash2, Minus, Plus, ShoppingBag, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();
  const { userAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const SUBTOTAL = totalPrice();
  const SHIPPING = items.length > 0 ? 12.50 : 0;
  const TAX = SUBTOTAL * 0.08;
  const TOTAL = SUBTOTAL + SHIPPING + TAX;

  const handleCheckout = async () => {
    if (!userAuth.isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await orderService.createOrder(orderItems);
      setSuccess(true);
      clearCart();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place order';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-24 flex flex-col items-center justify-center text-center">
          {success && (
            <div className="mb-6 w-full max-w-md p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg text-center font-medium">
              Order placed successfully! Thank you for your purchase.
            </div>
          )}
          <div className="w-24 h-24 bg-surface-muted rounded-full flex items-center justify-center text-outline mb-6">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-4">Your cart is empty</h1>
          <p className="text-body-md text-text-secondary mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet. Start exploring our latest tech collections!
          </p>
          <Link href="/">
            <Button variant="primary" className="px-8 py-3 text-base">
              Back to Shopping
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-headline-lg font-bold text-on-surface mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-xl border border-surface-container-low shadow-sm group">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-surface-muted shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                  <div className="space-y-1">
                    <h3 className="text-body-md font-semibold text-on-surface">{item.name}</h3>
                    <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-outline rounded-default px-2 py-1 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-outline hover:text-primary transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-outline hover:text-primary transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-headline-md font-bold text-on-surface">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-outline hover:text-status-critical transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-outline-variant p-8 sticky top-24 shadow-sm">
              <h2 className="text-headline-md font-bold text-on-surface mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-on-surface">${SUBTOTAL.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Shipping estimate</span>
                  <span className="font-medium text-on-surface">${SHIPPING.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Tax estimate</span>
                  <span className="font-medium text-on-surface">${TAX.toFixed(2)}</span>
                </div>
                <div className="h-px bg-outline-variant my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-body-md font-bold text-on-surface">Total</span>
                  <span className="text-headline-lg font-bold text-primary">${TOTAL.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-status-critical/10 text-status-critical text-sm rounded-lg">
                  {error}
                </div>
              )}

              <Button
                variant="primary"
                className="w-full py-4 text-base font-bold mb-4"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
                <Lock size={12} />
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
