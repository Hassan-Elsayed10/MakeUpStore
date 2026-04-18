import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let allCategories: any[] = [];

  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(8);

    allCategories = await db.select().from(categories);
  } catch {
    // DB might not be ready yet
  }

  return (
    <>
      <Hero />
      <Marquee />
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}
      {allCategories.length > 0 && <Categories categories={allCategories} />}
      <WhyChooseUs />
    </>
  );
}
