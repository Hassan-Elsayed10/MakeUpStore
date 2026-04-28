import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { OffersPageClient } from './OffersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Offers & Discounts',
  description: 'Shop our exclusive beauty offers and discounted luxury makeup products.',
  alternates: {
    canonical: '/offers',
    languages: {
      'en': '/en/offers',
      'ar': '/ar/offers',
    },
  },
  openGraph: {
    title: 'Exclusive Offers & Discounts | الْمُلْكُ للهِ',
    description: 'Shop our exclusive beauty offers and discounted luxury makeup products.',
    url: '/offers',
    type: 'website',
  },
};

export default async function OffersPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  let saleProducts: any[] = [];

  try {
    saleProducts = await db
      .select()
      .from(products)
      .where(eq(products.isOnSale, true))
      .orderBy(desc(products.createdAt));
  } catch {
    // DB might not be ready
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Exclusive Offers & Discounts',
    description: 'Shop our exclusive beauty offers and discounted luxury makeup products.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/${locale}/offers`,
    hasPart: saleProducts.slice(0, 10).map((product) => {
      const localizedName = locale === 'ar' ? product.nameAr : product.nameEn;
      const effectivePrice = product.discountPrice
        ? parseFloat(product.discountPrice)
        : parseFloat(product.price);
      return {
        '@type': 'Product',
        name: localizedName,
        image: product.image ? [product.image] : [],
        description: locale === 'ar' ? product.descriptionAr : product.descriptionEn,
        brand: {
          '@type': 'Brand',
          name: 'الْمُلْكُ للهِ'
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/${locale}/products/${product.id}`,
        offers: {
          '@type': 'Offer',
          price: effectivePrice,
          priceCurrency: 'EGP',
          availability: 'https://schema.org/InStock',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/${locale}/products/${product.id}`,
        }
      };
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OffersPageClient products={saleProducts} />
    </>
  );
}
