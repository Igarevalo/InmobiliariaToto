import { create } from 'zustand';

interface FilterState {
  operation: string;
  type: string;
  city: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  setFilter: (key: keyof Omit<FilterState, 'setFilter' | 'resetFilters'>, value: any) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  operation: '',
  type: '',
  city: '',
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
  resetFilters: () => set({
    operation: '',
    type: '',
    city: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
  }),
}));
