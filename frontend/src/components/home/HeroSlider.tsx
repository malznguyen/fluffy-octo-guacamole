'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
    }, 6000); // Change slide every 6 seconds

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

  const scrollToContent = () => {
    const nextSection = document.getElementById('new-arrivals');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[600px] md:h-[800px] lg:h-[900px] overflow-hidden">
      {/* Slider Images with Ken Burns Effect */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Ken Burns Animation Container */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                className={`object-cover ${
                  index === currentSlide ? 'animate-ken-burns' : ''
                }`}
                priority={index === 0}
                sizes="100vw"
              />
            </div>
            
            {/* Dark Overlay - Only for text readability, not decorative gradient */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Bottom gradient overlay for scroll indicator visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Content - Centered with z-index */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {children}
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
        aria-label="Scroll to content"
      >
        <span className="text-xs uppercase tracking-[0.2em] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Khám phá
        </span>
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>

      {/* Navigation Dots - Moved up to avoid overlap with scroll indicator */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 w-2 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows - Glassmorphism style */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 shadow-lg shadow-black/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-full transition-all duration-300 shadow-lg shadow-black/10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Ken Burns Animation Styles */}
      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.1) translate(-2%, -1%);
          }
        }
        .animate-ken-burns {
          animation: ken-burns 8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
