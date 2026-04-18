'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useWishlist } from '@/providers/WishlistProvider';
import { useCart } from '@/providers/CartProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, Sparkles } from 'lucide-react';

export default function WishlistPage() {
  const t = useTranslations('wishlist');
  const ct = useTranslations('common');
  const pt = useTranslations('products');
  const locale = useLocale();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { cartEnabled } = useFeatureFlags();
  const { showToast } = useToast();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      nameEn: item.nameEn,
      nameAr: item.nameAr,
      price: item.price,
      image: item.image,
    });
    showToast(pt('addedToCart'));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold font-display text-neutral-900 dark:text-white mb-8"
        >
          {t('title')}
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {t('empty')}
            </h2>
            <p className="text-neutral-500 mb-6">{t('emptyMessage')}</p>
            <Link href="/products">
              <Button>{ct('continueShopping')}</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
              >
                <Link href={`/products/${item.productId}`}>
                  <div className="aspect-[4/5] bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-800 dark:to-neutral-800 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-primary-200" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {locale === 'ar' ? item.nameAr : item.nameEn}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-bold mb-3">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex gap-2">
                    {cartEnabled && (
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="flex-1"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {ct('addToCart')}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
