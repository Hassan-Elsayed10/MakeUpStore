'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

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

export function OffersPageClient({ products }: { products: Product[] }) {
  const t = useTranslations('home');
  const ct = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-neutral-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-900/20 blur-3xl rounded-full translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-accent-900/20 blur-3xl rounded-full -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 text-accent-400 mb-4 px-4 py-1.5 rounded-full bg-accent-400/10 border border-accent-400/20 font-semibold uppercase tracking-wider text-sm"
          >
            <Zap className="w-4 h-4 fill-current" />
            {ct('onSale')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white mb-6"
          >
            {t('specialOffers')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto text-lg"
          >
            {t('offersSubtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} locale={locale} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800">
            <Zap className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">{ct('noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
