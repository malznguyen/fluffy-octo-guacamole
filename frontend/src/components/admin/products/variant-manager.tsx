'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateVariantRequest } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface VariantManagerProps {
  variants: CreateVariantRequest[];
  basePrice: number;
  onChange: (variants: CreateVariantRequest[]) => void;
}

const DEFAULT_VARIANT: CreateVariantRequest = {
  sku: '',
  color: '',
  size: '',
  stockQuantity: 0,
  priceAdjustment: 0,
  isAvailable: true,
};

// Đảm bảo variants luôn là mảng
const useVariants = (variants: CreateVariantRequest[] | undefined | null) => {
  return variants || [];
};

export function VariantManager({ variants: rawVariants, basePrice, onChange }: VariantManagerProps) {
  const variants = useVariants(rawVariants);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addVariant = () => {
    const newVariant = { ...DEFAULT_VARIANT };
    // Tạo SKU tự động dựa trên số lượng variant hiện tại
    newVariant.sku = `SKU-${String(variants.length + 1).padStart(3, '0')}`;
    onChange([...variants, newVariant]);
    setEditingIndex(variants.length);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onChange(newVariants);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const updateVariant = (index: number, field: keyof CreateVariantRequest, value: unknown) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onChange(newVariants);
  };

  const moveVariant = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === variants.length - 1) return;

    const newVariants = [...variants];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newVariants[index], newVariants[targetIndex]] = [newVariants[targetIndex], newVariants[index]];
    onChange(newVariants);
    
    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    } else if (editingIndex === targetIndex) {
      setEditingIndex(index);
    }
  };

  const getFinalPrice = (priceAdjustment: number) => {
    return basePrice + priceAdjustment;
  };

  // Tính tổng tồn kho
  const totalStock = (variants || []).reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-lg">
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-neutral-500">Tổng biến thể</p>
            <p className="text-lg font-semibold text-neutral-800">{variants.length}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Tổng tồn kho</p>
            <p className="text-lg font-semibold text-neutral-800">{totalStock}</p>
          </div>
        </div>
        <Button type="button" onClick={addVariant} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Thêm biến thể
        </Button>
      </div>

      {/* Variant List */}
      {variants.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500">Chưa có biến thể nào</p>
          <p className="text-sm text-neutral-400 mt-1">
            Click "Thêm biến thể" để tạo các phiên bản khác nhau của sản phẩm
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="w-10"></TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Màu sắc</TableHead>
                <TableHead>Kích cỡ</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead className="text-right">Điều chỉnh giá</TableHead>
                <TableHead className="text-right">Giá cuối</TableHead>
                <TableHead className="text-center">Hiển thị</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={index} className={editingIndex === index ? 'bg-blue-50/50' : ''}>
                  {/* Reorder Buttons */}
                  <TableCell className="p-2">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveVariant(index, 'up')}
                        disabled={index === 0}
                        className="p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30"
                      >
                        <GripVertical className="w-3 h-3 -rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveVariant(index, 'down')}
                        disabled={index === variants.length - 1}
                        className="p-0.5 hover:bg-neutral-200 rounded disabled:opacity-30"
                      >
                        <GripVertical className="w-3 h-3 rotate-90" />
                      </button>
                    </div>
                  </TableCell>

                  {/* SKU */}
                  <TableCell>
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      placeholder="SKU-001"
                      className="h-8 text-sm"
                    />
                  </TableCell>

                  {/* Color */}
                  <TableCell>
                    <Input
                      value={variant.color || ''}
                      onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      placeholder="Đỏ"
                      className="h-8 text-sm"
                    />
                  </TableCell>

                  {/* Size */}
                  <TableCell>
                    <Input
                      value={variant.size || ''}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      placeholder="M"
                      className="h-8 text-sm w-20"
                    />
                  </TableCell>

                  {/* Stock */}
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min={0}
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        updateVariant(index, 'stockQuantity', parseInt(e.target.value) || 0)
                      }
                      className="h-8 text-sm text-right"
                    />
                  </TableCell>

                  {/* Price Adjustment */}
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={variant.priceAdjustment}
                      onChange={(e) =>
                        updateVariant(index, 'priceAdjustment', parseInt(e.target.value) || 0)
                      }
                      className="h-8 text-sm text-right"
                      placeholder="0"
                    />
                  </TableCell>

                  {/* Final Price */}
                  <TableCell className="text-right font-medium">
                    {formatPrice(getFinalPrice(variant.priceAdjustment))}
                  </TableCell>

                  {/* Is Available */}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={variant.isAvailable}
                      onCheckedChange={(checked) =>
                        updateVariant(index, 'isAvailable', checked)
                      }
                    />
                  </TableCell>

                  {/* Delete */}
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Quick Generate Variants */}
      {variants.length === 0 && (
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-neutral-700 mb-2">Tạo nhanh biến thể</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const sizes = ['S', 'M', 'L', 'XL'];
                const newVariants = sizes.map((size, i) => ({
                  ...DEFAULT_VARIANT,
                  sku: `SKU-${String(i + 1).padStart(3, '0')}`,
                  size,
                  stockQuantity: 10,
                }));
                onChange(newVariants);
              }}
            >
              S, M, L, XL
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const colors = ['Đỏ', 'Xanh', 'Vàng', 'Đen'];
                const newVariants = colors.map((color, i) => ({
                  ...DEFAULT_VARIANT,
                  sku: `SKU-${String(i + 1).padStart(3, '0')}`,
                  color,
                  stockQuantity: 10,
                }));
                onChange(newVariants);
              }}
            >
              4 màu cơ bản
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
