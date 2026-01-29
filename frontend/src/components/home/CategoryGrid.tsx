'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCategoryTree } from '@/lib/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';

const placeholderImages = [
    'https://placehold.co/400x500/f472b6/ffffff?text=Ao+Nu',
    'https://placehold.co/400x500/a78bfa/ffffff?text=Ao+Nam',
    'https://placehold.co/400x500/60a5fa/ffffff?text=Quan+Jeans',
    'https://placehold.co/400x500/34d399/ffffff?text=Phu+Kien',
    'https://placehold.co/400x500/fbbf24/ffffff?text=Giay+Dep',
];

export function CategoryGrid() {
    const { data: categories, isLoading, error } = useCategoryTree();

    if (error) {
        return (
            <section className="py-16 lg:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-500">
                        Không thể tải danh mục. Vui lòng thử lại sau.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Danh Mục Nổi Bật
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Khám phá các bộ sưu tập thời trang đa dạng từ FASH.ON
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                    {isLoading ? (
                        // Skeleton loading
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="group relative">
                                <Skeleton className="aspect-[4/5] rounded-2xl" />
                                <Skeleton className="h-6 w-24 mx-auto mt-4" />
                            </div>
                        ))
                    ) : categories && categories.length > 0 ? (
                        // Actual categories
                        categories.slice(0, 5).map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/cua-hang?category=${category.id}`}
                                className="group relative"
                            >
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                                    <Image
                                        src={placeholderImages[index % placeholderImages.length]}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <h3 className="text-center mt-4 font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))
                    ) : (
                        // Fallback static categories
                        [
                            { id: 1, name: 'Áo Nữ' },
                            { id: 2, name: 'Áo Nam' },
                            { id: 3, name: 'Quần Jeans' },
                            { id: 4, name: 'Phụ Kiện' },
                            { id: 5, name: 'Giày Dép' },
                        ].map((cat, index) => (
                            <Link
                                key={cat.id}
                                href={`/cua-hang?category=${cat.id}`}
                                className="group relative"
                            >
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                                    <Image
                                        src={placeholderImages[index]}
                                        alt={cat.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <h3 className="text-center mt-4 font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                    {cat.name}
                                </h3>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
