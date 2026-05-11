import { create } from 'zustand';

interface FilterState {
  category: string;
  priceRange: 'under-50' | '50-200' | 'over-200' | 'all';
  sortBy: string;
  setCategory: (category: string) => void;
  setPriceRange: (range: FilterState['priceRange']) => void;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: 'All',
  priceRange: 'all',
  sortBy: 'Recommended',
  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({ category: 'All', priceRange: 'all', sortBy: 'Recommended' }),
}));
