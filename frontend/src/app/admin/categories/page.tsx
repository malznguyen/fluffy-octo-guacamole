'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryTable, SortField, SortOrder } from '@/components/admin/categories/category-table';
import { CategoryForm } from '@/components/admin/categories/category-form';
import { DeleteDialog } from '@/components/admin/categories/delete-dialog';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/use-categories';
import { CategoryDTO, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import { buildCategoryTree } from '@/utils/tree-utils';

export default function AdminCategoriesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('sortOrder');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc'); // Default sort by order ASC

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryDTO | null>(null);

  // Data
  const { data: categories = [], isLoading, error } = useCategories();

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const isTreeMode = !searchQuery.trim();

  // Filter and Sort
  const displayedCategories = useMemo(() => {
    let result = [...categories];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.slug.toLowerCase().includes(query)
      );
    }

    // Sort function
    const compareFn = (a: CategoryDTO, b: CategoryDTO) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle boolean for isActive
      if (sortField === 'isActive') {
        const aNum = a.isActive ? 1 : 0;
        const bNum = b.isActive ? 1 : 0;
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    };

    if (isTreeMode) {
      // Build tree with sorting
      return buildCategoryTree(result, compareFn);
    } else {
      // Flat list sorting
      result.sort(compareFn);
      return result;
    }
  }, [categories, searchQuery, sortField, sortOrder, isTreeMode]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: CategoryDTO) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
        },
      });
    }
  };

  const handleFormSubmit = (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: data as UpdateCategoryRequest },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingCategory(null);
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateCategoryRequest, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Không thể tải danh sách danh mục
          </h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'Đã có lỗi xảy ra'}
          </p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-slate-800">
            Quản lý danh mục
          </h1>
          <p className="text-slate-500 mt-1">
            {isLoading ? 'Đang tải...' : `${categories.length} danh mục`}
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Filters (Search only for now, can add status filter if needed) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Add more filters here if needed */}
        </div>
      </div>

      {/* Table */}
      <CategoryTable
        categories={displayedCategories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        isTree={isTreeMode}
      />

      {/* Form Dialog */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        categories={categories} // Pass all categories for parent selection
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingCategory(null);
        }}
        onConfirm={confirmDelete}
        categoryName={deletingCategory?.name || ''}
        hasChildren={(deletingCategory?.children && deletingCategory.children.length > 0) || false}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
