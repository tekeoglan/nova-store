'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useFilterStore } from '@/store/filterStore';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  isSale?: boolean;
}

// Mock data for demonstration
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aura Pro Wireless Headphones',
    category: 'Audio',
    price: 299.00,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Chronos Smartwatch Series 7',
    category: 'Wearables',
    price: 149.00,
    oldPrice: 199.00,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399&auto=format&fit=crop',
    isSale: true,
  },
  {
    id: '3',
    name: 'RetroSnap Instant Camera',
    category: 'Photography',
    price: 89.99,
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Lumina Desk Lamp Pro',
    category: 'Home & Living',
    price: 59.00,
    rating: 4.5,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1534073828943-f801d1d77fBf?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Zenith Mechanical Keyboard',
    category: 'Electronics',
    price: 129.00,
    rating: 4.7,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c376758?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Velvet Sound Earbuds',
    category: 'Audio',
    price: 79.00,
    oldPrice: 99.00,
    rating: 4.3,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf127f0d675?q=80&w=1470&auto=format&fit=crop',
    isSale: true,
  },
];

export const ProductGrid = () => {
  const { sortBy, setSortBy } = useFilterStore();

  const sortedProducts = React.useMemo(() => {
    const products = [...MOCK_PRODUCTS];
    
    switch (sortBy) {
      case 'Price Low to High':
        return products.sort((a, b) => a.price - b.price);
      case 'Price High to Low':
        return products.sort((a, b) => b.price - a.price);
      case 'Popularity':
        return products.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      case 'Recommended':
      default:
        return products;
    }
  }, [sortBy]);

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-headline-md font-bold text-on-surface">
          Featured Products
        </h2>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Sort by:</span>
          <div className="relative group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-outline-variant rounded-default text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="Recommended">Recommended</option>
              <option value="Price Low to High">Price Low to High</option>
              <option value="Price High to Low">Price High to Low</option>
              <option value="Popularity">Popularity</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
