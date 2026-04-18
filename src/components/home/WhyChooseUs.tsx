'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Leaf, Truck } from 'lucide-react';

export function WhyChooseUs() {
  const t = useTranslations('home');

  const features = [
    { icon: Award, title: t('quality'), desc: t('qualityDesc'), color: 'text-primary-500' },
    { icon: Leaf, title: t('crueltyFree'), desc: t('crueltyFreeDesc'), color: 'text-green-500' },
    { icon: Truck, title: t('shipping'), desc: t('shippingDesc'), color: 'text-accent-500' },
  ];

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
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
