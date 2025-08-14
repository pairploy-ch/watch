'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Watch } from '@/lib/types';
import WatchCard from '@/components/public/WatchCard';
import WatchListItem from '@/components/public/WatchListItem';
import WatchFilter, { Filters } from '@/components/public/WatchFilter';
import Pagination from '@/components/public/Pagination';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventorySectionProps {
  initialWatches: Watch[];
}

const ITEMS_PER_PAGE = 20;

export default function InventorySection({ initialWatches }: InventorySectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    brand: '',
    condition: '',
    minPrice: 0,
    maxPrice: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log('Initial Watches on Client:', initialWatches);
  }, [initialWatches]);

  const filteredWatches = useMemo(() => {
    if (!initialWatches || !isMounted) return [];
    return initialWatches.filter((watch) => {
      const { brand, condition, minPrice, maxPrice } = filters;
      const sellingPrice = watch.selling_price ?? 0;

      const brandMatch = brand ? watch.brand.toLowerCase().includes(brand.toLowerCase()) : true;
      const conditionMatch = condition ? watch.product_type === condition : true;
      const minPriceMatch = minPrice ? sellingPrice >= minPrice : true;
      const maxPriceMatch = maxPrice ? sellingPrice <= maxPrice : true;

      return brandMatch && conditionMatch && minPriceMatch && maxPriceMatch;
    });
  }, [initialWatches, filters, isMounted]);

  const totalPages = Math.ceil(filteredWatches.length / ITEMS_PER_PAGE);
  const paginatedWatches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredWatches.slice(startIndex, endIndex);
  }, [filteredWatches, currentPage]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.05 },
    }),
  };

  return (
    <motion.section
      id="inventory"
      className="container mx-auto px-2 py-8 md:py-14 scroll-mt-20"
      initial="hidden"
      animate={isMounted ? 'visible' : 'hidden'}
      variants={sectionVariants}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="section-title text-center md:text-left">Our Collection</h2>
        <div className="bg-gray-800 p-1 rounded-lg flex gap-1">
          <Button
            onClick={() => setViewMode('grid')}
            variant="ghost"
            size="sm"
            className={cn('p-2 h-auto', viewMode === 'grid' && 'bg-gray-700')}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant="ghost"
            size="sm"
            className={cn('p-2 h-auto', viewMode === 'list' && 'bg-gray-700')}
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <WatchFilter watches={initialWatches} filters={filters} setFilters={setFilters} />

      {initialWatches.length === 0 ? (
        <p className="text-center text-gray-500 py-10">The collection is currently empty.</p>
      ) : paginatedWatches.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
              {paginatedWatches.map((watch, index) => (
                <motion.div
                  key={watch.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate={isMounted ? 'visible' : 'hidden'}
                  suppressHydrationWarning
                >
                  <WatchCard watch={watch} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedWatches.map((watch, index) => (
                <motion.div
                  key={watch.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate={isMounted ? 'visible' : 'hidden'}
                  suppressHydrationWarning
                >
                  <WatchListItem watch={watch} />
                </motion.div>
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <p className="text-center text-gray-500 py-10">No watches match your criteria. Try adjusting the filters.</p>
      )}
    </motion.section>
  );
}