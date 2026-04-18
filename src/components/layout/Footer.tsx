'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Sparkles, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="font-display">{t('brand')}</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
              Premium makeup products crafted for every skin tone and style. Elevate your beauty routine.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/wishlist" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t('wishlist')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-center text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} الْمُلْكُ للهِ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
