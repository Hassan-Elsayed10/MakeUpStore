'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Leaf, BadgePercent, Tag, Sparkles, Heart } from 'lucide-react';
import { useRef } from 'react';

export function WhyChooseUs() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);

  const features = [
    { icon: Award, title: t('quality'), desc: t('qualityDesc') },
    { icon: Tag, title: t('crueltyFree'), desc: t('crueltyFreeDesc') },
    { icon: BadgePercent, title: t('shipping'), desc: t('shippingDesc') },
  ];

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20 transform-gpu"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            {t('whyChooseUs')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative transform-gpu"
            >
              <div className="relative p-8 sm:p-10 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 h-full">
                {/* Numbered badge */}
                <div className="absolute -top-5 start-8 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-primary-600/30">
                  {index + 1}
                </div>

                <div className="mt-4 mb-6 w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-primary-500" />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
