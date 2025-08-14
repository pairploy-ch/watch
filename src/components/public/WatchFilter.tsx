'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Watch } from '@/lib/types';
import { cn } from '@/lib/utils';
import { X as ResetIcon } from 'lucide-react';

export interface Filters {
  brand: string;
  condition: string; // Maps to product_type
  minPrice: number;
  maxPrice: number;
}

interface WatchFilterProps {
  watches: Watch[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function WatchFilter({ watches, filters, setFilters }: WatchFilterProps) {
  const brands = [...new Set(watches.map((w) => w.brand).filter(Boolean))].sort();
  const productTypes = ['New', 'Used', 'Vintage', 'NOS'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value === '' ? 0 : parseInt(value, 10) || 0 }));
  };

  const handleSelectChange = (name: 'brand' | 'condition') => (value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value === 'all' ? '' : value }));
  };

  const clearFilters = () => {
    setFilters({ brand: '', condition: '', minPrice: 0, maxPrice: 0 });
  };

  const isFiltered = filters.brand !== '' || filters.condition !== '' || filters.minPrice > 0 || filters.maxPrice > 0;

  return (
    <div className="bg-[#121212] p-3 md:p-4 rounded-lg border border-gray-800 mb-6 md:mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="brand-filter" className="text-gray-400 text-sm md:text-base">
            Brand
          </Label>
          <Select value={filters.brand || 'all'} onValueChange={handleSelectChange('brand')}>
            <SelectTrigger id="brand-filter" className="bg-gray-800 border-gray-700 text-sm md:text-base">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-type-filter" className="text-gray-400 text-sm md:text-base">
            Product Type
          </Label>
          <Select value={filters.condition || 'all'} onValueChange={handleSelectChange('condition')}>
            <SelectTrigger id="product-type-filter" className="bg-gray-800 border-gray-700 text-sm md:text-base">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-price" className="text-gray-400 text-sm md:text-base">
            Min Price (THB)
          </Label>
          <Input
            id="min-price"
            name="minPrice"
            type="number"
            placeholder="0"
            value={filters.minPrice === 0 ? '' : filters.minPrice}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-sm md:text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-price" className="text-gray-400 text-sm md:text-base">
            Max Price (THB)
          </Label>
          <Input
            id="max-price"
            name="maxPrice"
            type="number"
            placeholder="Any"
            value={filters.maxPrice === 0 ? '' : filters.maxPrice}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-sm md:text-base"
          />
        </div>

        <div className="w-full">
          <Button
            onClick={clearFilters}
            variant="outline"
            className={cn('w-full transition-opacity text-sm md:text-base', isFiltered ? 'opacity-100' : 'opacity-50 pointer-events-none')}
            disabled={!isFiltered}
          >
            <ResetIcon className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
}