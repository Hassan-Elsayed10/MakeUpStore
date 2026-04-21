import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { OffersPageClient } from './OffersPageClient';

export default async function OffersPage() {
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

  return <OffersPageClient products={saleProducts} />;
}
