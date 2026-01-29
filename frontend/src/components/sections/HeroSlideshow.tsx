"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  color: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://placehold.co/1920x1080/0a0a0a/ffffff?text=FASH.ON",
    headline: "PHONG CÁCH ĐỈNH CAO",
    subtext: "Khám phá bộ sưu tập thờI trang mới nhất với thiết kế độc đáo và chất lượng vượt trội",
    ctaText: "Mua Sắm Ngay",
    ctaLink: "/cua-hang",
    color: "from-black/80",
  },
  {
    id: 2,
    image: "https://placehold.co/1920x1080/dc2626/ffffff?text=NEW+COLLECTION",
    headline: "BỘ SƯU TẬP MỚI",
    subtext: "Xu hướng thờI trang 2024 - Nơi phong cách gặp gỡ sự tinh tế",
    ctaText: "Xem Ngay",
    ctaLink: "/cua-hang",
    color: "from-red-900/80",
  },
  {
    id: 3,
    image: "https://placehold.co/1920x1080/ea580c/ffffff?text=SUMMER+SALE",
    headline: "GIẢM GIÁ MÙA HÈ",
    subtext: "Giảm đến 50% cho các sản phẩm được chọn. Cơ hội có một không hai!",
    ctaText: "Khám Phá",
    ctaLink: "/cua-hang",
    color: "from-orange-900/80",
  },
  {
    id: 4,
    image: "https://placehold.co/1920x1080/171717/f5f5f5?text=PREMIUM",
    headline: "HÀNG HIỆU CHÍNH HÃNG",
    subtext: "Cam kết 100% chính hãng với chính sách đổi trả linh hoạt",
    ctaText: "Tìm Hiểu Thêm",
    ctaLink: "/cua-hang",
    color: "from-neutral-900/80",
  },
];

const SLIDE_INTERVAL = 5000; // 5 seconds

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent`}
          />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div
              className={`max-w-2xl transition-all duration-700 delay-200 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white font-display leading-tight mb-4">
                {slide.headline}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 max-w-lg">
                {slide.subtext}
              </p>
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
        aria-label="Slide tiếp theo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-4 sm:right-8 text-white/60 text-sm font-medium">
        <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span className="mx-2">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
