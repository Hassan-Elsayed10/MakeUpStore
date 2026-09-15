import { db } from '@/db';
import { products, reviews, categories, productVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { ProductDetailsClient } from './ProductDetailsClient';
import type { Metadata, ResolvingMetadata } from 'next';
import { getProductSlug } from '@/lib/utils';

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const allProducts = await db
      .select({ id: products.id, nameEn: products.nameEn, nameAr: products.nameAr })
      .from(products);
    const locales = ['en', 'ar'];
    return locales.flatMap((locale) =>
      allProducts.map((product) => ({
        locale,
        id: getProductSlug(locale === 'ar' ? product.nameAr : product.nameEn),
      }))
    );
  } catch {
    return [];
  }
}

type Props = {
  params: { id: string; locale: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const result = await db.select().from(products);
    const routeId = decodeURIComponent(params.id);
    const numericId = Number(routeId);
    const product = result.find((item) =>
      Number.isInteger(numericId) && numericId > 0
        ? item.id === numericId
        : getProductSlug(params.locale === 'ar' ? item.nameAr : item.nameEn) === routeId
    );
    if (!product) return { title: 'Product Not Found' };

    const previousImages = (await parent).openGraph?.images || [];
    
    const localizedName = params.locale === 'ar' ? product.nameAr : product.nameEn;
    const localizedDesc = (params.locale === 'ar' ? product.descriptionAr : product.descriptionEn) || 'Premium makeup product';
    const productSlug = getProductSlug(localizedName);

    const mainImage = product.image || '/og-image.png';

    return {
      title: localizedName,
      description: localizedDesc,
      alternates: {
        canonical: `/${params.locale}/products/${productSlug}`,
        languages: {
          'en': `/en/products/${getProductSlug(product.nameEn)}`,
          'ar': `/ar/products/${getProductSlug(product.nameAr)}`,
        },
      },
      openGraph: {
        title: localizedName,
        description: localizedDesc,
        url: `/${params.locale}/products/${productSlug}`,
        images: [mainImage, ...previousImages],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: localizedName,
        description: localizedDesc,
        images: [mainImage],
      },
    };
  } catch (error) {
    return { title: 'Product Details' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id, locale } = params;
  const routeId = decodeURIComponent(id);

  let product: any = null;
  let productReviews: any[] = [];
  let relatedProducts: any[] = [];
  let productId: number;
  let productSlug: string;

  try {
    const allProducts = await db.select().from(products);
    const numericId = Number(routeId);
    product = allProducts.find((item) =>
      Number.isInteger(numericId) && numericId > 0
        ? item.id === numericId
        : getProductSlug(locale === 'ar' ? item.nameAr : item.nameEn) === routeId
    );

    if (!product) notFound();
    productId = product.id;
    productSlug = getProductSlug(locale === 'ar' ? product.nameAr : product.nameEn);
    product.variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));

    productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId));

    if (product.categoryId) {
      relatedProducts = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, product.categoryId))
        .limit(4);
      relatedProducts = relatedProducts.filter((p: any) => p.id !== productId);
    }
  } catch {
    // DB might not be ready
    notFound();
  }

  if (routeId !== productSlug) redirect(`/${locale}/products/${encodeURIComponent(productSlug)}`);

  // Parse translations for JSON-LD
  const localizedName = locale === 'ar' ? product.nameAr : product.nameEn;
  const localizedDesc = (locale === 'ar' ? product.descriptionAr : product.descriptionEn) || 'Premium makeup product';
  
  const images = product.image ? [product.image] : [];

  const effectivePrice = product.isOnSale && product.discountPrice
    ? parseFloat(product.discountPrice)
    : parseFloat(product.price);

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    image: images,
    description: localizedDesc,
    sku: product.id.toString(),
    brand: {
      '@type': 'Brand',
      name: 'الْمُلْكُ للهِ'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/${locale}/products/${getProductSlug(localizedName)}`,
      priceCurrency: 'EGP',
      price: effectivePrice,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  if (productReviews.length > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: (productReviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / productReviews.length).toFixed(1),
      reviewCount: productReviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    jsonLd.review = productReviews.map((rev: any) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rev.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(rev.comment && { reviewBody: rev.comment }),
      datePublished: (() => {
        if (!rev.createdAt) return undefined;
        const date = new Date(rev.createdAt);
        return Number.isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
      })(),
    }));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailsClient
        product={product}
        reviews={productReviews}
        relatedProducts={relatedProducts}
        locale={locale}
      />
    </>
  );
}
