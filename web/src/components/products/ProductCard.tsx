'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

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

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="group bg-white rounded-xl border border-surface-container-low overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-surface-muted">
        {product.isSale && (
          <span className="absolute top-3 left-3 bg-accent-energy text-white text-xs font-bold px-2 py-1 rounded-sm z-10">
            Sale
          </span>
        )}
        <button 
          onClick={handleHeartClick}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-outline hover:text-primary rounded-full transition-colors z-10 shadow-sm"
        >
          <Heart size={18} />
        </button>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
          {product.category}
        </span>
        <h3 className="text-body-md font-semibold text-on-surface mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-4">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-on-surface">{product.rating}</span>
          <span className="text-xs text-text-secondary">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-headline-md font-bold text-on-surface">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-text-secondary line-through">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button 
            variant="outline" 
            className="px-3 py-1 text-xs gap-1"
            onClick={() => addItem(product)}
          >
            Add <ShoppingCart size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
