'use client';

import { motion } from 'framer-motion';

const marqueeItems = [
  'MIỄN PHÍ VẬN CHUYỂN',
  'CHÍNH HÃNG 100%',
  'ĐỔI TRẢ TRONG 30 NGÀY',
  'HỖ TRỢ 24/7',
  'GIAO HÀNG TOÀN QUỐC',
  'THANH TOÁN AN TOÀN',
];

export function MarqueeBanner() {
  return (
    <section className="relative py-8 bg-neutral-900 overflow-hidden">
      {/* Marquee Container */}
      <div className="relative flex overflow-hidden">
        {/* First set */}
        <motion.div
          className="flex shrink-0 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="flex items-center shrink-0">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stroke text-white/20 whitespace-nowrap px-8">
                {item}
              </span>
              <span className="text-white/40 text-2xl mx-4">•</span>
            </div>
          ))}
        </motion.div>

        {/* Duplicate for seamless loop */}
        <motion.div
          className="flex shrink-0 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center shrink-0">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stroke text-white/20 whitespace-nowrap px-8">
                {item}
              </span>
              <span className="text-white/40 text-2xl mx-4">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
}
