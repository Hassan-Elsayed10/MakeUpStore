'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getLocalizedField } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Palette, Droplets, Eye, Sparkles, Brush, Heart, ArrowUpRight } from 'lucide-react';

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
  fragrance: Heart,
  default: Heart,
};

const categoryColors: Record<string, string> = {
  lips: 'from-red-500/10 to-pink-500/10 dark:from-red-500/5 dark:to-pink-500/5',
  eyes: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-500/5 dark:to-indigo-500/5',
  face: 'from-primary-500/10 to-rose-500/10 dark:from-primary-500/5 dark:to-rose-500/5',
  skin: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5',
  tools: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5',
  fragrance: 'from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/5 dark:to-fuchsia-500/5',
};

export function Categories({ categories }: { categories: Category[] }) {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            {t('shopByCategory')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            {t('categorySubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] || categoryIcons.default;
            const gradient = categoryColors[category.slug] || 'from-primary-500/10 to-accent-500/10';
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className={`group relative block p-8 rounded-3xl bg-gradient-to-br ${gradient} border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden`}
                >
                  <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="w-16 h-16 mb-5 rounded-2xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
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
