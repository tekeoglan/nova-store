'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-outline-variant px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href="/" className="text-headline-md font-bold text-primary">
          NovaStore
        </Link>

        <div className="flex-1 max-w-2xl relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-surface-muted rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-primary transition-all text-on-surface"
          />
        </div>

        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative p-2 text-on-surface hover:text-primary transition-colors">
            <ShoppingCart size={24} />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-accent-energy text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/profile" className="p-2 text-on-surface hover:text-primary transition-colors">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
