'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useFilterStore } from '@/store/filterStore';

export const SidebarFilters = () => {
  const { category, setCategory, priceRange, setPriceRange, searchQuery, resetFilters } = useFilterStore();

  const categories = ['All', 'Elektronik', 'Giyim', 'Ev ve Yaşam', 'Kozmetik', 'Kitap'];
  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: '0-500', label: 'Under 500' },
    { id: '500-2000', label: '500 - 2000' },
    { id: '2000-10000', label: '2000 - 10000' },
    { id: '10000+', label: 'Over 10000' },
  ];

  const hasActiveFilters = category !== 'All' || priceRange !== 'all' || searchQuery !== '';

  return (
    <div className="w-full md:w-64 space-y-6">
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-text-secondary border border-outline hover:bg-surface-muted hover:text-on-surface rounded-lg transition-colors mb-4"
        >
          <X size={16} />
          Clear All Filters
        </button>
      )}

      <div className="bg-white rounded-xl border border-surface-container-low p-6">
        <h3 className="text-body-md font-bold text-on-surface mb-4">Categories</h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                text-left px-3 py-2 rounded-md text-sm transition-all
                ${category === cat 
                  ? 'bg-surface-container-low text-primary font-semibold' 
                  : 'text-text-secondary hover:bg-surface-muted hover:text-on-surface'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-container-low p-6">
        <h3 className="text-body-md font-bold text-on-surface mb-4">Price Range</h3>
        <div className="flex flex-col gap-3">
          {priceRanges.map((range) => (
            <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={priceRange === range.id}
                onChange={() => setPriceRange(range.id)}
                className="w-4 h-4 rounded border-outline text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-text-secondary group-hover:text-on-surface transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
