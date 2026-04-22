'use client';

import { useTranslations } from 'next-intl';
import { BadgePercent, ShieldCheck, Sparkles, Star, Heart, Award } from 'lucide-react';

const items = [
  { icon: BadgePercent, key: 'shipping' },
  { icon: ShieldCheck, key: 'quality' },
  { icon: Sparkles, key: 'crueltyFree' },
  { icon: Star, key: 'quality' },
  { icon: Heart, key: 'crueltyFree' },
  { icon: Award, key: 'shipping' },
];

export function Marquee() {
  const t = useTranslations('home');

  const renderItems = () =>
    items.map((item, i) => (
      <div key={i} className="flex items-center gap-3 px-8 flex-shrink-0">
        <item.icon className="w-5 h-5 text-primary-500" />
        <span className="text-sm font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
          {t(item.key as any)}
        </span>
      </div>
    ));

  return (
    <section className="py-5 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-track">
          {renderItems()}
          {renderItems()}
          {renderItems()}
          {renderItems()}
        </div>
      </div>
    </section>
  );
}
