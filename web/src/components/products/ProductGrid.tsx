'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useFilterStore } from '@/store/filterStore';
import { productService, Product } from '@/services/productService';

export const ProductGrid = () => {
  const { category, priceRange, sortBy, setSortBy, getPriceParams, searchQuery, resetFilters } = useFilterStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevSearchQuery = useRef(searchQuery);

  useEffect(() => {
    if (prevSearchQuery.current && !searchQuery) {
      resetFilters();
    }
    prevSearchQuery.current = searchQuery;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const priceParams = getPriceParams();
        const data = await productService.getProducts(
          category === 'All' ? undefined : category,
          priceParams.minPrice,
          priceParams.maxPrice,
          searchQuery || undefined
        );
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, priceRange, searchQuery]);

  const sortedProducts = React.useMemo(() => {
    const productsCopy = [...products];
    
    switch (sortBy) {
      case 'Price Low to High':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'Price High to Low':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'Popularity':
        return productsCopy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      case 'Recommended':
      default:
        return productsCopy;
    }
  }, [sortBy, products]);

  if (loading) {
    return (
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-headline-md font-bold text-on-surface">
            Featured Products
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-headline-md font-bold text-on-surface">
            Featured Products
          </h2>
        </div>
        <div className="text-center py-12 text-text-secondary">
          {error}
        </div>
      </div>
    );
  }

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