'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, MessageSquare, Search, RefreshCw } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

interface Review {
  id: number;
  productId: number;
  productNameEn: string | null;
  productNameAr: string | null;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const t = useTranslations('admin');
  const ct = useTranslations('common');
  const locale = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      showToast(t('reviewLoadError') || 'Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDeleteReview'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showToast(t('reviewDeleted'), 'success');
      } else {
        showToast(t('reviewDeleteError'), 'error');
      }
    } catch {
      showToast(t('reviewDeleteError'), 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.author.toLowerCase().includes(q) ||
      (r.productNameEn ?? '').toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{ct('reviews')}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {t('manageReviews')}
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t('totalReviews'), value: reviews.length },
          { label: t('avgRating'), value: avgRating },
          {
            label: t('fiveStarReviews'),
            value: reviews.filter((r) => r.rating === 5).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder={t('searchReviewsPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full ps-9 pe-4 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <RefreshCw className="w-5 h-5 animate-spin me-2" />
            Loading reviews...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
            <MessageSquare className="w-10 h-10 opacity-40" />
            <p className="text-sm">{search ? t('noReviewsFound') : t('noReviewsYet')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                  {[ct('product'), ct('author'), ct('rating'), ct('comment'), ct('date'), ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-start text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((review) => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {review.productNameEn ?? `Product #${review.productId}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                        {review.author}
                      </td>
                      <td className="px-4 py-3">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {review.comment}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-40"
                          title="Delete review"
                        >
                          {deletingId === review.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
