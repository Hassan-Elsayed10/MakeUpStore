'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getLocalizedField, formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/providers/CartProvider';
import { useWishlist } from '@/providers/WishlistProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ProductCard } from '@/components/products/ProductCard';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Heart, Star, ArrowLeft, ChevronLeft, Send, Sparkles, Minus, Plus,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: any;
  reviews: any[];
  relatedProducts: any[];
  locale: string;
}

export function ProductDetailsClient({
  product,
  reviews,
  relatedProducts,
  locale,
}: ProductDetailsClientProps) {
  const t = useTranslations('common');
  const pt = useTranslations('products');
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { cartEnabled } = useFeatureFlags();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);

  const name = getLocalizedField(product, 'name', locale);
  const description = getLocalizedField(product, 'description', locale);
  const inWishlist = isInWishlist(product.id);
  const avgRating =
    allReviews.length > 0
      ? (allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : null;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: parseFloat(product.price),
        image: product.image,
      });
    }
    showToast(pt('addedToCart'));
  };

  const handleWishlist = () => {
    toggleItem({
      productId: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: parseFloat(product.price),
      image: product.image,
    });
    showToast(inWishlist ? t('removeFromWishlist') : pt('addedToWishlist'));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) return;
    setSubmittingReview(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, ...reviewForm }),
      });

      if (res.ok) {
        const data = await res.json();
        setAllReviews([data.review, ...allReviews]);
        setReviewForm({ author: '', rating: 5, comment: '' });
        showToast('Review submitted!');
      }
    } catch {
      showToast('Failed to submit review', 'error');
    }

    setSubmittingReview(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          {t('back')}
        </Link>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-800 dark:to-neutral-800 overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-32 h-32 text-primary-200 dark:text-primary-800" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-900 dark:text-white mb-4">
              {name}
            </h1>

            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-4 h-4',
                        star <= Math.round(parseFloat(avgRating))
                          ? 'text-accent-500 fill-accent-500'
                          : 'text-neutral-300 dark:text-neutral-600'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">
                  {avgRating} ({allReviews.length})
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              {formatPrice(product.price)}
            </p>

            {description && (
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                {description}
              </p>
            )}

            {/* Quantity + Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {cartEnabled && (
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-medium min-w-[2.5rem] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {cartEnabled && (
                <Button size="lg" onClick={handleAddToCart} className="flex-1 min-w-[200px]">
                  <ShoppingBag className="w-5 h-5" />
                  {t('addToCart')}
                </Button>
              )}
              <Button
                size="lg"
                variant={inWishlist ? 'primary' : 'outline'}
                onClick={handleWishlist}
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 mb-16">
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-8">
            {pt('reviews')} ({allReviews.length})
          </h2>

          {/* Review form */}
          <form onSubmit={handleSubmitReview} className="mb-10 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              {pt('writeReview')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Input
                label={pt('yourName')}
                value={reviewForm.author}
                onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {pt('rating')}
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          'w-6 h-6 transition-colors',
                          star <= reviewForm.rating
                            ? 'text-accent-500 fill-accent-500'
                            : 'text-neutral-300 dark:text-neutral-600'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Textarea
              label={pt('comment')}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
              className="mb-4"
            />
            <Button type="submit" disabled={submittingReview}>
              <Send className="w-4 h-4" />
              {pt('submitReview')}
            </Button>
          </form>

          {/* Reviews list */}
          {allReviews.length > 0 ? (
            <div className="space-y-4">
              {allReviews.map((review: any) => (
                <div
                  key={review.id}
                  className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'w-3.5 h-3.5',
                            star <= review.rating
                              ? 'text-accent-500 fill-accent-500'
                              : 'text-neutral-300 dark:text-neutral-600'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-500 py-8">{pt('noReviews')}</p>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12">
            <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-8">
              {pt('relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
