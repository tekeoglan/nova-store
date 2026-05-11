import { create } from 'zustand';

type PriceRange = 'all' | '0-500' | '500-2000' | '2000-10000' | '10000+';

interface FilterState {
  category: string;
  priceRange: PriceRange;
  sortBy: string;
  searchQuery: string;
  setCategory: (category: string) => void;
  setPriceRange: (range: PriceRange) => void;
  setSortBy: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  getPriceParams: () => { minPrice?: number; maxPrice?: number };
}

export const useFilterStore = create<FilterState>((set, get) => ({
  category: 'All',
  priceRange: 'all',
  sortBy: 'Recommended',
  searchQuery: '',
  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set({ category: 'All', priceRange: 'all', sortBy: 'Recommended', searchQuery: '' }),
  getPriceParams: () => {
    const range = get().priceRange;
    switch (range) {
      case '0-500': return { minPrice: 0, maxPrice: 500 };
      case '500-2000': return { minPrice: 500, maxPrice: 2000 };
      case '2000-10000': return { minPrice: 2000, maxPrice: 10000 };
      case '10000+': return { minPrice: 10000 };
      default: return {};
    }
  },
}));
