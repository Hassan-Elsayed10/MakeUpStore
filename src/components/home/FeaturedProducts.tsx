'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

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

export function FeaturedProducts({ products }: { products: Product[] }) {
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

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-neutral-900 dark:text-white mb-3">
              {t('featuredProducts')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl text-lg">
              {t('featuredSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4"
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

      <div className="text-center mt-12">
        <Link href="/products">
          <Button variant="outline" size="lg" className="group text-base px-8">
            {t('shopNow')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
