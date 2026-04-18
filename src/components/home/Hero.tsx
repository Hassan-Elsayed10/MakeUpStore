'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.1),transparent_50%)]" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-800/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-200/20 dark:bg-accent-800/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Premium Beauty Collection
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-neutral-900 dark:text-white leading-tight mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="group">
                  {t('shopNow')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  {t('exploreCollection')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="relative">
              <img
                    src="/logo.png"
                    alt="Featured Product"
                    className="w-full  object-contain rounded-2xl mb-4"
                    />
                
              {/* Floating cards */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-4"
              >
                <p className="text-2xl font-bold text-primary-600">500+</p>
                <p className="text-xs text-neutral-500">Products</p>
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-4"
              >
                <p className="text-2xl font-bold text-accent-600">4.9★</p>
                <p className="text-xs text-neutral-500">Rating</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
