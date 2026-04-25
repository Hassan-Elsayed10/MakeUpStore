import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ProductsPageClient } from './ProductsPageClient';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  searchParams: { category?: string };
  params: { locale: string };
};

export async function generateMetadata(
  { searchParams, params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categorySlug = searchParams.category;
  const { locale } = params;

  if (categorySlug) {
    try {
      const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1);
      if (cat.length > 0) {
        const category = cat[0];
        const localizedName = locale === 'ar' ? category.nameAr : category.nameEn;

        return {
          title: `${localizedName} Collection`,
          description: `Explore our premium selection of ${localizedName} makeup products.`,
          openGraph: {
            title: `${localizedName} | الْمُلْكُ للهِ`,
            description: `Explore our premium selection of ${localizedName} makeup products.`,
            url: `/products?category=${categorySlug}`,
            type: 'website',
          },
        };
      }
    } catch {}
  }

  return {
    title: 'All Products',
    description: 'Browse our complete collection of premium luxury makeup and cosmetic products.',
    openGraph: {
      title: 'All Products | الْمُلْكُ للهِ',
      description: 'Browse our complete collection of premium luxury makeup and cosmetic products.',
      url: `/products`,
      type: 'website',
    },
  };
}

export default async function ProductsPage({ searchParams, params }: Props) {
  const searchParamsObj = searchParams;
  let allProducts: any[] = [];
  let allCategories: any[] = [];
  let currentCategoryName = 'All Products';

  try {
    if (searchParamsObj.category) {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, searchParamsObj.category))
        .limit(1);

      if (cat.length > 0) {
        const category = cat[0];
        currentCategoryName = params.locale === 'ar' ? category.nameAr : category.nameEn;

        allProducts = await db
          .select()
          .from(products)
          .where(eq(products.categoryId, category.id));
      }
    } else {
      allProducts = await db.select().from(products);
    }

    allCategories = await db.select().from(categories);
  } catch {
    // DB might not be ready
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: searchParamsObj.category ? `${currentCategoryName} Collection` : 'All Products',
    description: searchParamsObj.category ? `Explore our premium selection of ${currentCategoryName} makeup products.` : 'Browse our complete collection of premium luxury makeup and cosmetic products.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${params.locale}/products${searchParamsObj.category ? `?category=${searchParamsObj.category}` : ''}`,
    hasPart: allProducts.slice(0, 10).map((product) => {
      const localizedName = params.locale === 'ar' ? product.nameAr : product.nameEn;
      return {
        '@type': 'Product',
        name: localizedName,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${params.locale}/products/${product.id}`,
      };
    })
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${params.locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: searchParamsObj.category ? currentCategoryName : 'Products',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${params.locale}/products${searchParamsObj.category ? `?category=${searchParamsObj.category}` : ''}`,
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductsPageClient
        products={allProducts}
        categories={allCategories}
        selectedCategory={searchParamsObj.category || ''}
      />
    </>
  );
}
