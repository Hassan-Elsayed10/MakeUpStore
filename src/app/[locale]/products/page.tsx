import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ProductsPageClient } from './ProductsPageClient';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const params = searchParams;
  let allProducts: any[] = [];
  let allCategories: any[] = [];

  try {
    if (params.category) {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, params.category))
        .limit(1);

      if (cat.length > 0) {
        allProducts = await db
          .select()
          .from(products)
          .where(eq(products.categoryId, cat[0].id));
      }
    } else {
      allProducts = await db.select().from(products);
    }

    allCategories = await db.select().from(categories);
  } catch {
    // DB might not be ready
  }

  return (
    <ProductsPageClient
      products={allProducts}
      categories={allCategories}
      selectedCategory={params.category || ''}
    />
  );
}
