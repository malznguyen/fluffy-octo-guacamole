'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasMore,
}: PaginationProps) {
  // Show "XEM THÊM" button if there are more pages
  if (hasMore) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mt-16"
      >
        <Button
          variant="ghost"
          size="lg"
          onClick={() => onPageChange(currentPage + 1)}
          className="group text-sm tracking-[0.15em] uppercase font-medium px-8 py-6 hover:bg-transparent hover:text-neutral-600"
        >
          Xem Thêm
          <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
        </Button>
      </motion.div>
    );
  }

  // Minimalist numbered pagination for when we want page numbers
  if (totalPages > 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center gap-8 mt-16"
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`text-sm transition-all duration-200 ${
              currentPage === page
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {page.toString().padStart(2, '0')}
          </button>
        ))}
      </motion.div>
    );
  }

  return null;
}
