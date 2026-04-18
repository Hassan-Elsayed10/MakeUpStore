import { db } from '@/db';
import { products, categories, orders } from '@/db/schema';
import { count, sum } from 'drizzle-orm';
import { AdminDashboardClient } from './AdminDashboardClient';

export default async function AdminPage() {
  let stats = { products: 0, categories: 0, orders: 0, revenue: '0' };

  try {
    const [productCount] = await db.select({ value: count() }).from(products);
    const [categoryCount] = await db.select({ value: count() }).from(categories);
    const [orderCount] = await db.select({ value: count() }).from(orders);
    const [revenueSum] = await db.select({ value: sum(orders.total) }).from(orders);

    stats = {
      products: productCount.value,
      categories: categoryCount.value,
      orders: orderCount.value,
      revenue: revenueSum.value || '0',
    };
  } catch {
    // DB might not be ready
  }

  return <AdminDashboardClient stats={stats} />;
}
