import { MetadataRoute } from 'next';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const locales = routing.locales;

  let allProducts: any[] = [];
  let allCategories: any[] = [];

  try {
    allProducts = await db.select().from(products);
    allCategories = await db.select().from(categories);
  } catch {
    // DB error
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  const staticRoutes = ['', '/about', '/products', '/offers'];

  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
      });
    });

    // Dynamic products
    allProducts.forEach((product) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });

    // Dynamic categories
    allCategories.forEach((category) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/products?category=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return sitemapEntries;
}
