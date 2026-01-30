'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Trash2, ArrowLeft, PackageX } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { items, isLoading, isInitialized, fetchWishlist, removeFromWishlist } = useWishlistStore();
    const { addItem } = useCartStore();

    // Check authentication
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/wishlist');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated, router, fetchWishlist]);

    // Handle remove from wishlist
    const handleRemove = async (productId: number, productName: string) => {
        try {
            await removeFromWishlist(productId);
            toast.success(`Đã xóa "${productName}" khỏi danh sách yêu thích`);
        } catch (error) {
            toast.error('Không thể xóa sản phẩm');
        }
    };

    // Handle add to cart
    const handleAddToCart = async (productId: number, productName: string) => {
        try {
            // Lấy variant đầu tiên của product
            const product = items.find(p => p.id === productId);
            if (!product || !product.variants || product.variants.length === 0) {
                toast.error('Sản phẩm không có sẵn');
                return;
            }
            
            const firstVariant = product.variants[0];
            await addItem(firstVariant.id, 1);
            toast.success(`Đã thêm "${productName}" vào giỏ hàng`);
        } catch (error) {
            toast.error('Không thể thêm vào giỏ hàng');
        }
    };

    // Get primary image
    const getPrimaryImage = (product: typeof items[0]) => {
        const images = product.images || [];
        const primary = images.find(img => img.isPrimary) || images[0];
        return primary?.imageUrl || '/placeholder-product.jpg';
    };

    // Get lowest price
    const getLowestPrice = (product: typeof items[0]) => {
        const variants = product.variants || [];
        if (variants.length > 0) {
            return Math.min(...variants.map(v => v.finalPrice));
        }
        return product.basePrice;
    };

    // Loading state
    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="h-8 w-64 bg-neutral-200 animate-pulse mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[3/4] bg-neutral-200 animate-pulse" />
                                <div className="h-4 bg-neutral-200 animate-pulse rounded" />
                                <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="text-sm uppercase tracking-wider text-neutral-600 mb-4">
                        <Link href="/" className="hover:text-neutral-900 transition-colors">
                            Trang chủ
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-neutral-900 font-medium">Danh sách yêu thích</span>
                    </nav>

                    {/* Heading */}
                    <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        <h1 className="text-4xl font-black uppercase tracking-tight text-neutral-900">
                            Danh sách yêu thích
                        </h1>
                    </div>

                    {/* Count */}
                    <p className="text-sm text-neutral-600 mt-2">
                        {items.length} sản phẩm trong danh sách yêu thích của bạn
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {items.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-20 border border-neutral-200">
                        <PackageX className="w-16 h-16 text-neutral-300 mb-4" strokeWidth={1} />
                        <h2 className="text-lg text-neutral-900 font-medium mb-2">
                            Bạn chưa có sản phẩm yêu thích nào
                        </h2>
                        <p className="text-sm text-neutral-600 mb-6">
                            Hãy khám phá các sản phẩm và thêm vào danh sách yêu thích của bạn
                        </p>
                        <Link
                            href="/products"
                            className="px-8 py-3 bg-neutral-900 text-white font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                        >
                            Khám phá ngay
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Product Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map((product) => (
                                <div key={product.id} className="group relative">
                                    {/* Product Card */}
                                    <Link href={`/products/${product.slug}`}>
                                        <div className="relative overflow-hidden bg-neutral-100">
                                            {/* Product Image */}
                                            <div className="aspect-[3/4] overflow-hidden">
                                                <Image
                                                    src={getPrimaryImage(product)}
                                                    alt={product.name}
                                                    width={300}
                                                    height={400}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium text-neutral-900 uppercase truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-base font-bold text-neutral-900 mt-1">
                                                {formatPrice(getLowestPrice(product))}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(product.id, product.name)}
                                            className="w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all"
                                            title="Xóa khỏi yêu thích"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button (Bottom) */}
                                    <button
                                        onClick={() => handleAddToCart(product.id, product.name)}
                                        className="w-full mt-3 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
