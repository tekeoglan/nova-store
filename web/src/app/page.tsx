import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { SidebarFilters } from '@/components/home/SidebarFilters';
import { ProductGrid } from '@/components/products/ProductGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Hero />
        
        <div className="flex flex-col md:flex-row gap-8">
          <SidebarFilters />
          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
