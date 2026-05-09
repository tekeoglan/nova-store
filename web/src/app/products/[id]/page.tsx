'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Heart, Star, Truck, ShieldCheck, Plus, Minus, Search, Play } from 'lucide-react';
import { MOCK_PRODUCT_DETAILS } from '@/data/mockProducts';
import { useCartStore } from '@/store/cartStore';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const product = MOCK_PRODUCT_DETAILS;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          {product.breadcrumb.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className={idx === product.breadcrumb.length - 1 ? 'text-on-surface font-medium' : 'hover:text-primary cursor-pointer'}>
                {item}
              </span>
              {idx < product.breadcrumb.length - 1 && <span>&gt;</span>}
            </React.Fragment>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Media Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-muted group">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <button className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-on-surface hover:text-primary transition-colors shadow-sm">
                <Search size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-outline'}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <button className="aspect-square rounded-lg border-2 border-outline-variant flex items-center justify-center bg-surface-muted text-outline hover:text-primary transition-colors">
                <Play size={24} />
              </button>
            </div>
          </div>

          {/* Right: Config Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-headline-lg font-bold text-on-surface">{product.name}</h1>
              <button className="p-2 text-outline hover:text-primary transition-colors">
                <Heart size={24} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm text-text-secondary">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-headline-md font-bold text-on-surface">${product.price.toFixed(2)}</span>
              <span className="text-body-sm text-text-secondary line-through">${product.oldPrice?.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 text-status-success text-sm font-medium mb-6">
              <ShieldCheck size={16} />
              {product.stockStatus}
            </div>

            <p className="text-body-md text-text-secondary mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <span className="text-label-lg font-semibold text-on-surface block mb-3">
                Color: <span className="text-text-secondary font-normal">{product.colors.find(c => c.value === selectedColor)?.name}</span>
              </span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button 
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.value ? 'border-primary scale-110' : 'border-transparent hover:border-outline'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-outline rounded-default px-2 py-1 bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 text-outline hover:text-primary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 text-outline hover:text-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <Button 
                variant="primary" 
                className="flex-1 py-3 text-base gap-2"
                onClick={() => addItem({ ...product, quantity })}
              >
                Add to Cart
              </Button>
            </div>

            <div className="bg-surface-muted rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Truck size={18} className="text-outline" />
                Free expedited shipping on orders over $100
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <ShieldCheck size={18} className="text-outline" />
                2-year comprehensive global warranty
              </div>
            </div>
          </div>
        </div>

        <hr className="border-outline-variant mb-16" />

        {/* Bottom Section: Why You'll Love It & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h2 className="text-headline-md font-bold text-on-surface">Why You'll Love It</h2>
            <div className="space-y-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface mb-1">{feature.title}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-muted rounded-xl p-8">
            <h2 className="text-headline-md font-bold text-on-surface mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-outline-variant last:border-0">
                  <span className="text-sm text-text-secondary">{key}</span>
                  <span className="text-sm font-medium text-on-surface">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-outline-variant mb-16" />

        {/* Recommendations */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-headline-md font-bold text-on-surface">Complete Your Setup</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-outline-variant text-outline hover:text-primary transition-colors">
                <Minus size={20} className="rotate-90" />
              </button>
              <button className="p-2 rounded-full border border-outline-variant text-outline hover:text-primary transition-colors">
                <Plus size={20} className="rotate-90" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <div key={rel.id} className="flex flex-col">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-muted mb-4">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-on-surface">{rel.name}</h4>
                <p className="text-sm text-text-secondary mb-2">{rel.category}</p>
                <span className="text-body-md font-bold text-on-surface">${rel.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
