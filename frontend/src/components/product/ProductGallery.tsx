'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ProductImageDTO } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: ProductImageDTO[];
    productName: string;
}

/**
 * Resolves the image URL by prepending the backend URL if needed
 */
function resolveImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('/')) {
        return `http://localhost:8080${imageUrl}`;
    }
    return imageUrl;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    // Find primary image or use first image as default
    const primaryImage = useMemo(() => {
        return images.find((img) => img.isPrimary) || images[0] || null;
    }, [images]);

    // State for currently selected image
    const [selectedImage, setSelectedImage] = useState<ProductImageDTO | null>(primaryImage);

    // Handle empty images
    if (images.length === 0 || !selectedImage) {
        return (
            <div className="aspect-[3/4] bg-neutral-100 flex items-center justify-center">
                <span className="text-neutral-400 text-sm uppercase tracking-widest">
                    Không có hình ảnh
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Preview Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                <Image
                    src={resolveImageUrl(selectedImage.imageUrl)}
                    alt={selectedImage.alt || `${productName} - Hình chính`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {images.map((image, index) => {
                        const isSelected = selectedImage.id === image.id ||
                            (selectedImage.imageUrl === image.imageUrl);

                        return (
                            <button
                                key={image.id || index}
                                type="button"
                                onClick={() => setSelectedImage(image)}
                                className={cn(
                                    'relative w-20 h-20 flex-shrink-0 bg-neutral-100 overflow-hidden transition-all duration-200',
                                    isSelected
                                        ? 'ring-2 ring-neutral-900 ring-offset-1'
                                        : 'opacity-60 hover:opacity-100'
                                )}
                                aria-label={`Xem hình ${index + 1}`}
                            >
                                <Image
                                    src={resolveImageUrl(image.imageUrl)}
                                    alt={image.alt || `${productName} - Hình ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
