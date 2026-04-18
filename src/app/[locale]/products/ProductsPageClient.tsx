'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ProductCard } from '@/components/products/ProductCard';
import { getLocalizedField } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';

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

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
}

export function ProductsPageClient({
  products,
  categories,
  selectedCategory,
}: {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
}) {
  const t = useTranslations('products');
  const ct = useTranslations('common');
  const locale = useLocale();
  const [sort, setSort] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(selectedCategory);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filterCategory) {
      const cat = categories.find((c) => c.slug === filterCategory);
      if (cat) {
        filtered = filtered.filter((p) => p.categoryId === cat.id);
      }
    }

    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [products, sort, filterCategory, categories]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-neutral-900 dark:to-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-3"
          >
            {t('title')}
          </motion.h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <SlidersHorizontal className="w-5 h-5 text-neutral-500" />

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !filterCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {ct('all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === cat.slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {getLocalizedField(cat, 'name', locale)}
              </button>
            ))}
          </div>

          <div className="ms-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="price-low">{t('sortPriceLow')}</option>
              <option value="price-high">{t('sortPriceHigh')}</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} locale={locale} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">{t('noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
