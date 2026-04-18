'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: string;
  image: string | null;
  categoryId: number | null;
  featured: boolean | null;
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-3">
            {t('featuredProducts')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {t('featuredSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} locale={locale} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg" className="group">
              {t('shopNow')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
