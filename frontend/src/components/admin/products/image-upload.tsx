'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, GripVertical, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUploadImage } from '@/hooks/use-products';
import { CreateImageRequest } from '@/types/product';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: CreateImageRequest[];
  onChange: (images: CreateImageRequest[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUpload({ images: rawImages, onChange }: ImageUploadProps) {
  // Đảm bảo images luôn là mảng
  const images = rawImages || [];
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return false;
    }
    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      const newImage: CreateImageRequest = {
        imageUrl: result.url,
        altText: file.name.split('.')[0],
        sortOrder: images.length,
        isPrimary: images.length === 0,
      };
      onChange([...images, newImage]);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files?.length > 0) {
        Array.from(files).forEach((file) => handleUpload(file));
      }
    },
    [images]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length > 0) {
      Array.from(files).forEach((file) => handleUpload(file));
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Nếu xóa ảnh chính và còn ảnh khác, đặt ảnh đầu tiên làm chính
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    // Cập nhật lại sortOrder
    newImages.forEach((img, i) => (img.sortOrder = i));
    onChange(newImages);
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Cập nhật lại sortOrder
    newImages.forEach((img, i) => (img.sortOrder = i));
    onChange(newImages);
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL.replace('/api/v1', '')}${url}`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-slate-600">Đang tải ảnh lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
              Kéo thả ảnh vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-slate-500">
              Hỗ trợ: JPEG, PNG, WebP, GIF (tối đa 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Ảnh sản phẩm ({images.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={`${image.imageUrl}-${index}`}
                className={cn(
                  'relative group border-2 rounded-lg overflow-hidden',
                  image.isPrimary
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-slate-200'
                )}
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText || `Ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, 'down');
                      }}
                      disabled={index === images.length - 1}
                    >
                      <GripVertical className="h-4 w-4 -rotate-90" />
                    </Button>
                    {!image.isPrimary && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-yellow-400 hover:text-yellow-400 hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimary(index);
                        }}
                        title="Đặt làm ảnh chính"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-400 hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Chính
                  </div>
                )}

                {/* Alt Text Input */}
                <input
                  type="text"
                  value={image.altText || ''}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index].altText = e.target.value;
                    onChange(newImages);
                  }}
                  placeholder="Mô tả ảnh"
                  className="w-full px-2 py-1 text-xs border-t border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// API Base URL for image construction
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
