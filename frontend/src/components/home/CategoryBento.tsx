'use client';

import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';
import { CategoryDTO } from '@/lib/api/types';
import Link from 'next/link';
import Image from 'next/image';

// Fallback categories if API fails
const fallbackCategories: CategoryDTO[] = [
  { 
    id: 1, 
    name: 'Áo Nam', 
    slug: 'ao-nam', 
    description: 'Bộ sưu tập áo nam cao cấp', 
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80' 
  },
  { 
    id: 2, 
    name: 'Áo Nữ', 
    slug: 'ao-nu', 
    description: 'Bộ sưu tập áo nữ thờithượng', 
    imageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&q=80' 
  },
  { 
    id: 3, 
    name: 'Phụ Kiện', 
    slug: 'phu-kien', 
    description: 'Phụ kiện hoàn hảo cho mọi phong cách', 
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80' 
  },
  { 
    id: 4, 
    name: 'Giày Dép', 
    slug: 'giay-dep', 
    description: 'Giày dép thờitrang đa dạng', 
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' 
  },
];

interface CategoryCardProps {
  category: CategoryDTO;
  index: number;
  className?: string;
}

function CategoryCard({ category, index, className = '' }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative overflow-hidden ${className}`}
    >
      <Link href={`/danh-muc/${category.slug}`} className="block h-full">
        {/* Background Image */}
        <div className="absolute inset-0 image-zoom bg-neutral-200">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-white/80 line-clamp-2 mb-4">
                {category.description}
              </p>
            )}
            
            {/* Hover Reveal Text */}
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              XEM CHI TIẾT
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
          </motion.div>
        </div>

        {/* Border Effect */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-300" />
      </Link>
    </motion.div>
  );
}

export function CategoryBento() {
  const { data: categories, isLoading, isError } = useCategories();
  
  // Use fallback if API fails or returns empty
  const displayCategories = (isError || !categories || categories.length === 0)
    ? fallbackCategories
    : categories;

  // Take first 4 categories for the bento grid
  const bentoCategories = displayCategories.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[800px] lg:h-[600px]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-neutral-200 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="mx-auto max-w-[1800px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-medium tracking-[0.3em] text-neutral-500 uppercase">
            Danh Mục
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-neutral-900">
            Khám Phá Phong Cách
          </h2>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[600px]">
          {/* Large Card - takes 2x2 on desktop */}
          {bentoCategories[0] && (
            <CategoryCard
              category={bentoCategories[0]}
              index={0}
              className="md:col-span-2 md:row-span-2 h-[300px] md:h-full min-h-[400px]"
            />
          )}

          {/* Two Vertical Cards */}
          {bentoCategories[1] && (
            <CategoryCard
              category={bentoCategories[1]}
              index={1}
              className="h-[300px] lg:h-full"
            />
          )}
          {bentoCategories[2] && (
            <CategoryCard
              category={bentoCategories[2]}
              index={2}
              className="h-[300px] lg:h-full"
            />
          )}

          {/* Square Card - spans 2 columns on bottom */}
          {bentoCategories[3] && (
            <CategoryCard
              category={bentoCategories[3]}
              index={3}
              className="md:col-span-2 h-[300px] lg:h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
