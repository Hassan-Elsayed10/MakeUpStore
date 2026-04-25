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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  title: {
    default: 'الْمُلْكُ للهِ - Premium Makeup & Luxury Cosmetics',
    template: '%s | الْمُلْكُ للهِ',
  },
  description: 'Discover our premium selection of luxury makeup and cosmetic products. Curated for every skin tone, style, and beauty enthusiast.',
  keywords: ['makeup', 'cosmetics', 'luxury beauty', 'premium skincare', 'lipstick', 'foundation', 'beauty store', 'الْمُلْكُ للهِ'],
  authors: [{ name: 'الْمُلْكُ للهِ Beauty' }],
  creator: 'الْمُلْكُ للهِ',
  publisher: 'الْمُلْكُ للهِ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'الْمُلْكُ للهِ - Premium Makeup Store',
    description: 'Premium makeup products crafted for every skin tone and style.',
    url: '/',
    siteName: 'الْمُلْكُ للهِ',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'الْمُلْكُ للهِ - Premium Makeup Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الْمُلْكُ للهِ - Premium Makeup Store',
    description: 'Premium makeup products crafted for every skin tone and style.',
    images: ['/og-image.jpg'],
    creator: '@almulklillah',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
