'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getLocalizedField } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Palette, Droplets, Eye, Sparkles, Brush, Heart } from 'lucide-react';

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  image: string | null;
}

const categoryIcons: Record<string, any> = {
  lips: Palette,
  eyes: Eye,
  face: Sparkles,
  skin: Droplets,
  tools: Brush,
  default: Heart,
};

export function Categories({ categories }: { categories: Category[] }) {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-3">
            {t('shopByCategory')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {t('categorySubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] || categoryIcons.default;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group block p-6 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                    <Icon className="w-7 h-7 text-primary-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {getLocalizedField(category, 'name', locale)}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
