"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api/services";
import { Category } from "@/lib/api/types";

export const categoryKeys = {
  all: ["categories"] as const,
  tree: () => [...categoryKeys.all, "tree"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export function useCategoriesTree() {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.tree(),
    queryFn: categoryApi.getTree,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.list(),
    queryFn: categoryApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
