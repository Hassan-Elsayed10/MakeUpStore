'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ProductCard } from '@/components/products/ProductCard';
import { getLocalizedField } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Sparkles, Filter, PackageX } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: string;
  discountPrice: string | null;
  isOnSale: boolean | null;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState('newest');

  // Use the prop instead of state to avoid mismatch with URL
  const filterCategory = selectedCategory;

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="/products_hero.png"
          alt="Our Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-4 transform-gpu">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sparkles className="w-10 h-10 text-primary-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-4 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-primary-50/80 max-w-2xl mx-auto text-lg italic">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Toolbar */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-border rounded-[2rem] p-4 sm:p-6 shadow-xl shadow-black/5 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Category selection */}
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">{ct('categories')}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${!filterCategory
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                    }`}
                >
                  {ct('all')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filterCategory === cat.slug
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                      }`}
                  >
                    {getLocalizedField(cat, 'name', locale)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3 self-end md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-border">
              <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm bg-transparent border-none focus:ring-0 text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="price-low">{t('sortPriceLow')}</option>
                <option value="price-high">{t('sortPriceHigh')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={filterCategory || 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 12) * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="transform-gpu"
                >
                  <ProductCard product={product} locale={locale} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mx-auto">
                <PackageX className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{t('noProducts')}</h3>
              <button
                onClick={() => handleCategoryChange('')}
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                {ct('viewAll')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
