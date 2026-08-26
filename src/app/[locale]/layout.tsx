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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://almulklillah.com';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  const title = isArabic
    ? 'الْمُلْكُ للهِ - مستحضرات تجميل ومكياج فاخر'
    : 'الْمُلْكُ للهِ - Premium Makeup & Luxury Cosmetics';

  const description = isArabic
    ? 'اكتشفي تشكيلتنا الفاخرة من مستحضرات التجميل والمكياج العالي الجودة. صممت لتناسب جميع ألوان البشرة والأذواق.'
    : 'Discover our premium selection of luxury makeup and cosmetic products. Curated for every skin tone, style, and beauty enthusiast.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: isArabic ? '%s | الْمُلْكُ للهِ' : '%s | الْمُلْكُ للهِ',
    },
    description,
    keywords: [
      'makeup',
      'cosmetics',
      'luxury beauty',
      'premium skincare',
      'lipstick',
      'foundation',
      'beauty store',
      'مكياج',
      'مستحضرات تجميل',
      'عناية بالبشرة',
      'الْمُلْكُ للهِ',
    ],
    authors: [{ name: 'الْمُلْكُ للهِ Beauty' }],
    creator: 'الْمُلْكُ للهِ',
    publisher: 'الْمُلْكُ للهِ',
    icons: {
      icon: [{ url: '/favicon.ico' }, { url: '/logo.png', type: 'image/png' }],
      apple: '/apple-icon.png',
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'الْمُلْكُ للهِ',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'الْمُلْكُ للهِ - متجر مكياج فاخر' : 'الْمُلْكُ للهِ - Premium Makeup Store',
        },
      ],
      locale: isArabic ? 'ar_SA' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_SA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
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
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  // Structured Data (JSON-LD) for E-Commerce / Local Store
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautyStore',
    name: 'الْمُلْكُ للهِ',
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/og-image.png`,
    description:
      locale === 'ar'
        ? 'متجر فاخر لمستحضرات التجميل والمكياج العالي الجودة.'
        : 'Premium luxury makeup and cosmetics store.',
    priceRange: '$$$',
    knowsLanguage: ['en', 'ar'],
  };

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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