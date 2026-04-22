'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Sparkles, Instagram, Facebook, Send, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const t = useTranslations('common');
  const tf = useTranslations('footer');
  const ta = useTranslations('about');

  return (
    <footer className="relative bg-neutral-50 dark:bg-neutral-950 border-t border-border/50 overflow-hidden pt-20 pb-10">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-100/50 dark:bg-primary-900/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-100/50 dark:bg-accent-900/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3 text-3xl font-bold text-primary-600 dark:text-primary-400 group">
                <div className="p-2 rounded-2xl bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="font-display tracking-tightest uppercase">{t('brand')}</span>
              </Link>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed text-sm lg:text-base italic">
                {tf('description')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/share/1ApMEkVMZK/?mibextid=wwXIfr' },
                { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/@elmolk_lellah?_r=1&_t=ZS-95lGIgc08sz' },
                { icon: Send, label: 'Telegram', href: 'https://t.me/+SY2A65fyghQYf91V' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-border text-neutral-500 hover:text-primary-600 hover:border-primary-500/50 hover:scale-110 transition-all duration-500 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100 opacity-60">
                {tf('quickLinks')}
              </h3>
              <ul className="space-y-5">
                {[
                  { label: t('home'), href: '/' },
                  { label: t('products'), href: '/products' },
                  { label: t('about'), href: '/about' }
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href as any}
                      className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 scale-0 group-hover:scale-100 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100 opacity-60">
                {tf('account')}
              </h3>
              <ul className="space-y-5">
                {[
                  { label: t('wishlist'), href: '/wishlist' },
                  { label: t('cart'), href: '/cart' },
                  { label: t('offers'), href: '/offers' }
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href as any}
                      className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 scale-0 group-hover:scale-100 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-100 opacity-60">
              {ta('contactTitle')}
            </h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{ta('locationTitle')}</p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{ta('locationText')}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-500 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{ta('whatsappTitle')}</p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{ta('whatsappNumber')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] text-center md:text-start">
            &copy; {new Date().getFullYear()} <span className="text-primary-600 dark:text-primary-400">{t('brand')}</span>. {tf('rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
