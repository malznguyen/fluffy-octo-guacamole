'use client';

import { useState, useEffect } from 'react';
import { Loader2, X, Info, Package, Images, Layers, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from './image-upload';
import { VariantManager } from './variant-manager';
import {
  ProductDTO,
  CategoryDTO,
  CreateProductRequest,
  UpdateProductRequest,
  CreateImageRequest,
  CreateVariantRequest,
} from '@/types/product';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => void;
  product?: ProductDTO | null;
  categories: CategoryDTO[];
  isLoading: boolean;
}

const DEFAULT_PRODUCT: CreateProductRequest = {
  name: '',
  slug: '',
  description: '',
  basePrice: 0,
  categoryId: 0,
  isVisible: true,
  variants: [],
  images: [],
};

// Tạo slug từ tên sản phẩm
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-'); // Thay space bằng dấu -
}

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  isLoading,
}: ProductFormProps) {
  const isEditing = !!product;
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<CreateProductRequest>(DEFAULT_PRODUCT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form khi mở/đóng dialog
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Chuyển đổi ProductDTO sang CreateProductRequest
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          basePrice: product.basePrice,
          categoryId: product.categoryId,
          isVisible: product.isVisible,
          variants: (product.variants || []).map((v) => ({
            sku: v.sku || '',
            color: v.color || '',
            size: v.size || '',
            stockQuantity: v.stockQuantity || 0,
            priceAdjustment: v.priceAdjustment || 0,
            isAvailable: v.isAvailable ?? true,
          })),
          images: (product.images || []).map((img, idx) => ({
            imageUrl: img.imageUrl,
            altText: img.altText || '',
            sortOrder: img.sortOrder ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        });
      } else {
        setFormData(DEFAULT_PRODUCT);
      }
      setErrors({});
      setActiveTab('basic');
    }
  }, [isOpen, product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug là bắt buộc';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Giá cơ bản phải lớn hơn 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục';
    }

    // Kiểm tra SKU trùng lặp
    const skus = formData.variants.map((v) => v.sku);
    const duplicateSkus = skus.filter((item, index) => skus.indexOf(item) !== index);
    if (duplicateSkus.length > 0) {
      newErrors.variants = `SKU bị trùng lặp: ${duplicateSkus.join(', ')}`;
    }

    // Kiểm tra variant có SKU rỗng
    const emptySkuIndex = formData.variants.findIndex((v) => !v.sku.trim());
    if (emptySkuIndex !== -1) {
      newErrors.variants = `Biến thể #${emptySkuIndex + 1} chưa có SKU`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Chuyển đến tab có lỗi
      if (errors.name || errors.slug || errors.basePrice || errors.categoryId) {
        setActiveTab('basic');
      } else if (errors.variants) {
        setActiveTab('variants');
      }
      return;
    }

    if (isEditing && product) {
      // Chỉ gửi các trường đã thay đổi khi edit
      onSubmit(formData as UpdateProductRequest);
    } else {
      onSubmit(formData);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const updateFormData = (field: keyof CreateProductRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Cập nhật thông tin sản phẩm hiện tại'
              : 'Điền thông tin để tạo sản phẩm mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Thông tin cơ bản
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Biến thể
                {formData.variants.length > 0 && (
                  <span className="ml-1 text-xs bg-neutral-200 px-1.5 py-0.5 rounded-full">
                    {formData.variants.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Images className="w-4 h-4" />
                Hình ảnh
                {formData.images.length > 0 && (
                  <span className="ml-1 text-xs bg-neutral-200 px-1.5 py-0.5 rounded-full">
                    {formData.images.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ví dụ: Áo thun nam cotton"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateFormData('slug', e.target.value)}
                    placeholder="ao-thun-nam-cotton"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">
                    Giá cơ bản <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min={0}
                    step={1000}
                    value={formData.basePrice}
                    onChange={(e) =>
                      updateFormData('basePrice', parseInt(e.target.value) || 0)
                    }
                    placeholder="100000"
                    className={errors.basePrice ? 'border-red-500' : ''}
                  />
                  {errors.basePrice && (
                    <p className="text-sm text-red-500">{errors.basePrice}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.categoryId ? formData.categoryId.toString() : ''}
                    onValueChange={(value) =>
                      updateFormData('categoryId', parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={errors.categoryId ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="-- Chọn danh mục --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Chọn danh mục --</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">{errors.categoryId}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="isVisible">Trạng thái hiển thị</Label>
                  <Select
                    value={formData.isVisible ? 'true' : 'false'}
                    onValueChange={(value) =>
                      updateFormData('isVisible', value === 'true')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-green-500" />
                          Hiển thị (Công khai)
                        </span>
                      </SelectItem>
                      <SelectItem value="false">
                        <span className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-neutral-400" />
                          Ẩn (Riêng tư)
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="mt-4">
              {errors.variants && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <Info className="w-4 h-4 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{errors.variants}</p>
                </div>
              )}
              <VariantManager
                variants={formData.variants}
                basePrice={formData.basePrice}
                onChange={(variants) => updateFormData('variants', variants)}
              />
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="mt-4">
              <ImageUpload
                images={formData.images}
                onChange={(images) => updateFormData('images', images)}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Đang cập nhật...' : 'Đang tạo...'}
                </>
              ) : isEditing ? (
                'Cập nhật sản phẩm'
              ) : (
                'Tạo sản phẩm'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
