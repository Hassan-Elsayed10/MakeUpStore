import { db } from '@/db';
import { products, reviews, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ProductDetailsClient } from './ProductDetailsClient';

export default async function ProductPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
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

  return (
    <ProductDetailsClient
      product={product}
      reviews={productReviews}
      relatedProducts={relatedProducts}
      locale={locale}
    />
  );
}
