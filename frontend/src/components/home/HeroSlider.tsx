'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  id: number;
  imageUrl: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    alt: 'Fashion collection 1'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    alt: 'Fashion collection 2'
  },
  {
    id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?w=1920&q=80',
    alt: 'Fashion collection 3'
  }
];

export default function HeroSlider({ children }: { children: React.ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Slider Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[85vh] flex items-center justify-center">
        {children}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
