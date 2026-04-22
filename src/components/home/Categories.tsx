'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getLocalizedField } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, Palette, Eye, Sparkles, Droplets, Brush, Heart } from 'lucide-react';

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
  lips: 'from-red-500/20 to-pink-500/20',
  eyes: 'from-purple-500/20 to-indigo-500/20',
  face: 'from-primary-500/20 to-rose-500/20',
  skin: 'from-blue-500/20 to-cyan-500/20',
  tools: 'from-amber-500/20 to-orange-500/20',
  fragrance: 'from-violet-500/20 to-fuchsia-500/20',
};

export function Categories({ categories }: { categories: Category[] }) {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 transform-gpu"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            {t('shopByCategory')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            {t('categorySubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const gradient = categoryColors[category.slug] || 'from-primary-500/20 to-accent-500/20';
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="transform-gpu"
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative block aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-2"
                >
                  {/* Background Image or Gradient */}
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={getLocalizedField(category, 'name', locale)}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} bg-neutral-200 dark:bg-neutral-800`} />
                  )}

                  {/* Glassmorph Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                    <div className="absolute top-6 end-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>

                    <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                        {getLocalizedField(category, 'name', locale)}
                      </h3>
                      <p className="text-white/60 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {t('exploreCollection')}
                      </p>
                    </div>
                  </div>

                  {/* Active Border Glow */}
                  <div className="absolute inset-0 border-2 border-primary-500/0 rounded-[2rem] group-hover:border-primary-500/50 transition-colors duration-500" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
