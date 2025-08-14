'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="mt-6 md:mt-12 flex items-center justify-center space-x-2 md:space-x-4">
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        variant="outline"
        className="h-8 w-8 md:h-10 md:w-10 p-0"
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      <div className="text-xs md:text-sm font-medium">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant="outline"
        className="h-8 w-8 md:h-10 md:w-10 p-0"
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </div>
  );
}