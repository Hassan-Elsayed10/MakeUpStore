import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Offers } from '@/components/home/Offers';
import { Categories } from '@/components/home/Categories';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let saleProducts: any[] = [];
  let allCategories: any[] = [];

  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(8);

    saleProducts = await db
      .select()
      .from(products)
      .where(eq(products.isOnSale, true))
      .limit(8);

    allCategories = await db.select().from(categories);
  } catch {
    // DB might not be ready yet
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'الْمُلْكُ للهِ',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/og-image.jpg`,
    description: 'Premium makeup products crafted for every skin tone and style.',
    sameAs: [
      'https://instagram.com/almulkulillah',
      'https://tiktok.com/@almulkulillah',
      'https://t.me/almulkulillah'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Marquee />
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}
      {saleProducts.length > 0 && <Offers products={saleProducts} />}
      {allCategories.length > 0 && <Categories categories={allCategories} />}
      <WhyChooseUs />
    </>
  );
}
