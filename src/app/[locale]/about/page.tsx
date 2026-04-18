'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, Leaf, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: Users, title: t('value1Title'), text: t('value1Text'), color: 'bg-primary-50 dark:bg-primary-900/30 text-primary-500' },
    { icon: Leaf, title: t('value2Title'), text: t('value2Text'), color: 'bg-green-50 dark:bg-green-900/30 text-green-500' },
    { icon: Lightbulb, title: t('value3Title'), text: t('value3Text'), color: 'bg-accent-50 dark:bg-accent-900/30 text-accent-500' },
    { icon: Heart, title: t('value4Title'), text: t('value4Text'), color: 'bg-red-50 dark:bg-red-900/30 text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-neutral-900 dark:to-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-neutral-900 dark:text-white mb-4">
              {t('title')}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            {t('storyTitle')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
            {t('storyText')}
          </p>
        </motion.section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900"
          >
            <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white mb-3">
              {t('missionTitle')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('missionText')}
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl bg-accent-50 dark:bg-accent-950/30 border border-accent-100 dark:border-accent-900"
          >
            <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white mb-3">
              {t('visionTitle')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('visionText')}
            </p>
          </motion.section>
        </div>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-8 text-center">
            {t('valuesTitle')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <div className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
