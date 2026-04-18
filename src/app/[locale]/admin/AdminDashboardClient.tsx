'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Package, FolderTree, ShoppingCart, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Stats {
  products: number;
  categories: number;
  orders: number;
  revenue: string;
}

export function AdminDashboardClient({ stats }: { stats: Stats }) {
  const t = useTranslations('admin');

  const cards = [
    { label: t('totalProducts'), value: stats.products, icon: Package, color: 'bg-primary-50 dark:bg-primary-900/30 text-primary-500', href: '/admin/products' as const },
    { label: t('totalCategories'), value: stats.categories, icon: FolderTree, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500', href: '/admin/categories' as const },
    { label: t('totalOrders'), value: stats.orders, icon: ShoppingCart, color: 'bg-green-50 dark:bg-green-900/30 text-green-500', href: '/admin/orders' as const },
    { label: t('revenue'), value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-accent-50 dark:bg-accent-900/30 text-accent-500', href: '/admin/orders' as const },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        {t('dashboard')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={card.href}
              className="block p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
