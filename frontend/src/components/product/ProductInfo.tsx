'use client';

import { useState, useMemo } from 'react';
import { ProductDTO, ProductVariantDTO } from '@/lib/api/types';
import { VariantSelector } from './VariantSelector';
import { AddToCartSection } from './AddToCartSection';

interface ProductInfoProps {
    product: ProductDTO;
}

/**
 * Format price to Vietnamese currency format
 */
function formatCurrency(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price) + 'đ';
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // Find selected variant based on color and size
    const selectedVariant = useMemo((): ProductVariantDTO | null => {
        if (!selectedColor || !selectedSize) return null;
        return (
            product.variants.find(
                (v) => v.color === selectedColor && v.size === selectedSize
            ) || null
        );
    }, [product.variants, selectedColor, selectedSize]);

    // Calculate display price
    const displayPrice = useMemo(() => {
        if (selectedVariant) {
            return selectedVariant.finalPrice;
        }
        // If only color is selected, show the price range or first matching variant's price
        if (selectedColor) {
            const colorVariants = product.variants.filter((v) => v.color === selectedColor);
            if (colorVariants.length === 1) {
                return colorVariants[0].finalPrice;
            }
        }
        return product.basePrice;
    }, [selectedVariant, selectedColor, product.basePrice, product.variants]);

    // Get unique colors from variants
    const uniqueColors = useMemo(() => {
        const colors = product.variants
            .map((v) => v.color)
            .filter((c): c is string => Boolean(c));
        return [...new Set(colors)].map((color) => {
            const variant = product.variants.find((v) => v.color === color);
            return {
                value: color,
                isAvailable: product.variants.some(
                    (v) => v.color === color && v.isAvailable && v.stockQuantity > 0
                ),
            };
        });
    }, [product.variants]);

    // Get sizes based on selected color
    const availableSizes = useMemo(() => {
        let filteredVariants = product.variants;

        if (selectedColor) {
            filteredVariants = product.variants.filter((v) => v.color === selectedColor);
        }

        const sizes = filteredVariants
            .map((v) => v.size)
            .filter((s): s is string => Boolean(s));

        return [...new Set(sizes)].map((size) => {
            const variant = selectedColor
                ? product.variants.find((v) => v.color === selectedColor && v.size === size)
                : product.variants.find((v) => v.size === size);

            return {
                value: size,
                isAvailable: variant ? variant.isAvailable && variant.stockQuantity > 0 : false,
            };
        });
    }, [product.variants, selectedColor]);

    // Handle color selection
    const handleColorSelect = (color: string) => {
        setSelectedColor(color === selectedColor ? null : color);
        // Reset size when color changes to ensure valid combination
        setSelectedSize(null);
    };

    // Handle size selection
    const handleSizeSelect = (size: string) => {
        setSelectedSize(size === selectedSize ? null : size);
    };

    return (
        <div className="space-y-8">
            {/* Product Name */}
            <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-medium">
                    {product.categoryName}
                </p>
                <h1 className="text-3xl lg:text-4xl font-display font-bold uppercase tracking-tight leading-tight">
                    {product.name}
                </h1>
            </div>

            {/* Price */}
            <div className="space-y-2">
                <p className="text-2xl lg:text-3xl font-bold tracking-tight font-mono">
                    {formatCurrency(displayPrice)}
                </p>
                {product.salePrice && product.salePrice < product.basePrice && (
                    <p className="text-lg text-neutral-400 line-through font-mono">
                        {formatCurrency(product.basePrice)}
                    </p>
                )}
            </div>

            {/* Description */}
            {product.description && (
                <p className="text-neutral-600 leading-relaxed">
                    {product.description}
                </p>
            )}

            {/* Variant Selectors */}
            <div className="space-y-6 pt-4 border-t border-neutral-200">
                {/* Color Selector */}
                {uniqueColors.length > 0 && (
                    <VariantSelector
                        label="Màu sắc"
                        options={uniqueColors}
                        selected={selectedColor}
                        onSelect={handleColorSelect}
                        type="color"
                    />
                )}

                {/* Size Selector */}
                {availableSizes.length > 0 && (
                    <VariantSelector
                        label="Kích thước"
                        options={availableSizes}
                        selected={selectedSize}
                        onSelect={handleSizeSelect}
                        type="size"
                    />
                )}
            </div>

            {/* Add to Cart */}
            <div className="pt-6">
                <AddToCartSection
                    productId={product.id}
                    selectedVariant={selectedVariant}
                />
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                    Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                    Đổi trả trong 30 ngày
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                    Bảo hành chính hãng 12 tháng
                </div>
            </div>
        </div>
    );
}
