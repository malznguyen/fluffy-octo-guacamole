'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
    id: number;
    image: string;
    headline: string;
    subtext: string;
    cta: string;
    ctaLink: string;
}

const slides: Slide[] = [
    {
        id: 1,
        image: 'https://placehold.co/1920x800/9333ea/ffffff?text=BST+Thu+Dong+2026',
        headline: 'Bộ Sưu Tập Thu Đông 2026',
        subtext: 'Khám phá phong cách mới với những thiết kế độc đáo và ấn tượng',
        cta: 'Mua Sắm Ngay',
        ctaLink: '/cua-hang?collection=thu-dong',
    },
    {
        id: 2,
        image: 'https://placehold.co/1920x800/ec4899/ffffff?text=Giam+Gia+50%25',
        headline: 'Giảm Giá Đến 50%',
        subtext: 'Ưu đãi đặc biệt cho tất cả sản phẩm thời trang cao cấp',
        cta: 'Xem Ngay',
        ctaLink: '/cua-hang?sale=true',
    },
    {
        id: 3,
        image: 'https://placehold.co/1920x800/6366f1/ffffff?text=Xu+Huong+2026',
        headline: 'Xu Hướng Thời Trang 2026',
        subtext: 'Cập nhật những trend mới nhất từ các sàn diễn quốc tế',
        cta: 'Khám Phá',
        ctaLink: '/cua-hang?trending=true',
    },
    {
        id: 4,
        image: 'https://placehold.co/1920x800/14b8a6/ffffff?text=Mua+1+Tang+1',
        headline: 'Mua 1 Tặng 1',
        subtext: 'Chương trình đặc biệt chỉ trong tuần này - Đừng bỏ lỡ!',
        cta: 'Mua Sắm Ngay',
        ctaLink: '/cua-hang?promo=buy1get1',
    },
];

export function HeroSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Auto-play effect
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, nextSlide]);

    return (
        <section
            className="relative w-full h-[600px] lg:h-[800px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                            }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={slide.image}
                                alt={slide.headline}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                            <div
                                className={`max-w-2xl transition-all duration-700 delay-300 ${index === currentSlide
                                        ? 'translate-x-0 opacity-100'
                                        : '-translate-x-10 opacity-0'
                                    }`}
                            >
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                                    {slide.headline}
                                </h1>
                                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                                    {slide.subtext}
                                </p>
                                <Link href={slide.ctaLink}>
                                    <Button
                                        variant="gradient"
                                        size="xl"
                                        className="shadow-2xl hover:shadow-purple-500/25"
                                    >
                                        {slide.cta}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 group"
                aria-label="Slide trước"
            >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 group"
                aria-label="Slide tiếp theo"
            >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 ${index === currentSlide
                                ? 'w-10 h-3 bg-white rounded-full'
                                : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/75'
                            }`}
                        aria-label={`Chuyển đến slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Pause indicator */}
            {isPaused && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs">
                    Đã tạm dừng
                </div>
            )}
        </section>
    );
}
