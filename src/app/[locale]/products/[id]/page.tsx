import { db } from '@/db';
import { products, reviews, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductDetailsClient } from './ProductDetailsClient';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string; locale: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = parseInt(params.id);
  if (isNaN(id)) return { title: 'Product Not Found' };

  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!result.length) return { title: 'Product Not Found' };
    
    const product = result[0];
    const previousImages = (await parent).openGraph?.images || [];
    
    const localizedName = params.locale === 'ar' ? product.nameAr : product.nameEn;
    const localizedDesc = (params.locale === 'ar' ? product.descriptionAr : product.descriptionEn) || 'Premium makeup product';

    const mainImage = product.image || '/og-image.jpg';

    return {
      title: localizedName,
      description: localizedDesc,
      openGraph: {
        title: localizedName,
        description: localizedDesc,
        url: `/products/${id}`,
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
  const productId = parseInt(id);
  if (isNaN(productId)) notFound();

  let product: any = null;
  let productReviews: any[] = [];
  let relatedProducts: any[] = [];

  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (result.length === 0) notFound();
    product = result[0];

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

  // Parse translations for JSON-LD
  const localizedName = locale === 'ar' ? product.nameAr : product.nameEn;
  const localizedDesc = (locale === 'ar' ? product.descriptionAr : product.descriptionEn) || 'Premium makeup product';
  
  const images = product.image ? [product.image] : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    image: images,
    description: localizedDesc,
    sku: product.id.toString(),
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale}/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(productReviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: productReviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / productReviews.length,
        reviewCount: productReviews.length,
      }
    })
  };

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
