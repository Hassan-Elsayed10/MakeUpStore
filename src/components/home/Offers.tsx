'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ProductCard } from '@/components/products/ProductCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useRef } from 'react';

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: string;
  discountPrice: string | null;
  isOnSale: boolean | null;
  image: string | null;
  categoryId: number | null;
  featured: boolean | null;
}

export function Offers({ products }: { products: Product[] }) {
  const t = useTranslations('home');
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.3'],
  });
  const headerY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-neutral-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-900/10 blur-3xl rounded-full translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-accent-900/10 blur-3xl rounded-full -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-accent-400 mb-2 font-semibold">
              <Zap className="w-5 h-5 fill-current" />
              <span className="uppercase tracking-wider text-sm">{t('onSale')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-3">
              {t('specialOffers')}
            </h2>
            <p className="text-neutral-400 max-w-xl text-lg">
              {t('offersSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-neutral-700 hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-neutral-700 hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4 relative z-10"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="min-w-[280px] max-w-[280px] flex-shrink-0"
          >
            <ProductCard product={product} locale={locale} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
