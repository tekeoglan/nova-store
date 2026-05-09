'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Hero = () => {
  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-surface-container-high mb-12 relative">
      <div className="grid md:grid-cols-2 gap-0 items-center">
        <div className="p-8 md:p-16 z-10">
          <span className="text-accent-energy font-bold text-xs uppercase tracking-widest mb-4 block">
            New Arrival
          </span>
          <h1 className="text-headline-lg md:text-headline-xl font-bold text-on-surface mb-6 leading-tight">
            Elevate Your Setup with <br /> Next-Gen Tech
          </h1>
          <p className="text-body-md text-text-secondary mb-8 max-w-md">
            Discover frictionless utility with our latest collection of premium devices designed for modern clarity and performance.
          </p>
          <Button variant="primary" className="px-8 py-4 text-base gap-2">
            Shop Collection <ArrowRight size={20} />
          </Button>
        </div>
        <div className="relative h-full min-h-[400px]">
          {/* Mock Image Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1471&auto=format&fit=crop" 
            alt="Hero Tech" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
