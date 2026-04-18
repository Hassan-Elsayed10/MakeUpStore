'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getLocalizedField, formatPrice } from '@/lib/utils';
import { useCart } from '@/providers/CartProvider';
import { useWishlist } from '@/providers/WishlistProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { useToast } from '@/providers/ToastProvider';
import { ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

export function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const t = useTranslations('common');
  const pt = useTranslations('products');
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { cartEnabled } = useFeatureFlags();
  const { showToast } = useToast();

  const name = getLocalizedField(product, 'name', locale);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: parseFloat(product.price),
      image: product.image,
    });
    showToast(pt('addedToCart'));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: parseFloat(product.price),
      image: product.image,
    });
    showToast(inWishlist ? t('removeFromWishlist') : pt('addedToWishlist'));
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-800 dark:to-neutral-800 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary-300 dark:text-primary-700" />
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3 start-3 px-2.5 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              {t('featured')}
            </div>
          )}

          {/* Actions overlay */}
          <div className="absolute top-3 end-3 flex flex-col gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-md transition-colors ${
                inWishlist
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/90 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-400 hover:text-primary-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1 mb-1">
            {name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(product.price)}
            </span>
            {cartEnabled && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
