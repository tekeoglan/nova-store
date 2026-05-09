import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-outline-variant py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-headline-md font-bold text-primary">
          NovaStore
        </div>
        
        <div className="flex gap-6 text-sm text-text-secondary">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>
        
        <div className="text-sm text-text-secondary">
          © 2024 NovaStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
