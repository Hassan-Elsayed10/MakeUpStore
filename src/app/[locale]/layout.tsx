import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { CartProvider } from '@/providers/CartProvider';
import { WishlistProvider } from '@/providers/WishlistProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'الْمُلْكُ للهِ - Premium Makeup Store',
    template: '%s | الْمُلْكُ للهِ',
  },
  description: 'Premium makeup products crafted for every skin tone and style.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <FeatureFlagsProvider>
              <CartProvider>
                <WishlistProvider>
                  <ToastProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </ToastProvider>
                </WishlistProvider>
              </CartProvider>
            </FeatureFlagsProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
