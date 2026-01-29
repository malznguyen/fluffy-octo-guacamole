'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api/services';
import { CategoryDTO } from '@/lib/api/types';

const CATEGORIES_KEY = 'categories';

export function useCategories() {
  return useQuery<CategoryDTO[], Error>({
    queryKey: [CATEGORIES_KEY],
    queryFn: () => publicApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategory(categoryId: number) {
  return useQuery<CategoryDTO | undefined, Error>({
    queryKey: [CATEGORIES_KEY, categoryId],
    queryFn: async () => {
      const categories = await publicApi.getCategories();
      return findCategoryById(categories, categoryId);
    },
    enabled: !!categoryId,
  });
}

function findCategoryById(categories: CategoryDTO[], id: number): CategoryDTO | undefined {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
