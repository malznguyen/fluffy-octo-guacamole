'use client';

import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/hooks/useCart';
import { ProductVariantDTO } from '@/lib/api/types';
import { Loader2, ShoppingBag, AlertCircle } from 'lucide-react';

interface AddToCartSectionProps {
    productId: number;
    selectedVariant: ProductVariantDTO | null;
    onSuccess?: () => void;
}

export function AddToCartSection({
    productId,
    selectedVariant,
    onSuccess,
}: AddToCartSectionProps) {
    const { mutate: addToCart, isPending, isError } = useAddToCart();

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart(
            {
                productId,
                variantId: selectedVariant.id,
                quantity: 1,
            },
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            }
        );
    };

    // Determine button state and label
    const getButtonConfig = () => {
        if (!selectedVariant) {
            return {
                label: 'CHỌN PHÂN LOẠI',
                disabled: true,
                variant: 'outline' as const,
            };
        }

        if (selectedVariant.stockQuantity === 0 || !selectedVariant.isAvailable) {
            return {
                label: 'HẾT HÀNG',
                disabled: true,
                variant: 'outline' as const,
            };
        }

        return {
            label: 'THÊM VÀO GIỎ',
            disabled: false,
            variant: 'default' as const,
        };
    };

    const config = getButtonConfig();

    return (
        <div className="space-y-4">
            <Button
                onClick={handleAddToCart}
                disabled={config.disabled || isPending}
                variant={config.variant}
                className="w-full h-14 text-base font-semibold uppercase tracking-widest transition-all duration-300"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ĐANG XỬ LÝ...
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        {config.label}
                    </>
                )}
            </Button>

            {isError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Có lỗi xảy ra. Vui lòng thử lại.</span>
                </div>
            )}

            {selectedVariant && selectedVariant.stockQuantity > 0 && selectedVariant.stockQuantity <= 5 && (
                <p className="text-sm text-amber-600 font-medium">
                    Chỉ còn {selectedVariant.stockQuantity} sản phẩm
                </p>
            )}
        </div>
    );
}
