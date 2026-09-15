import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema';

async function migrate() {
  console.log("Starting migration...");
  
  const neonClient = postgres(process.env.NEON_DATABASE_URL!);
  const neonDb = drizzle(neonClient, { schema });

  const supabaseClient = postgres(process.env.DATABASE_URL!);
  const supabaseDb = drizzle(supabaseClient, { schema });

  const migrateTable = async (tableName, schemaTable) => {
    console.log(`Migrating ${tableName}...`);
    const data = await neonDb.select().from(schemaTable);
    if (data.length > 0) {
      await supabaseDb.insert(schemaTable).values(data);
      console.log(`- Inserted ${data.length} rows`);
      
      // Update sequence
      await supabaseClient.unsafe(`SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), coalesce(max(id), 0) + 1, false) FROM ${tableName}`);
    } else {
      console.log(`- No data to insert.`);
    }
  };

  try {
    await migrateTable('categories', schema.categories);
    await migrateTable('products', schema.products);
    await migrateTable('product_variants', schema.productVariants);
    await migrateTable('reviews', schema.reviews);
    await migrateTable('orders', schema.orders);
    await migrateTable('order_items', schema.orderItems);
    await migrateTable('cart_items', schema.cartItems);
    await migrateTable('wishlist_items', schema.wishlistItems);
    await migrateTable('feature_settings', schema.featureSettings);

    console.log("Migration complete! All data transferred successfully.");
  } catch (error) {
    console.error("Error migrating data:", error);
  } finally {
    await neonClient.end();
    await supabaseClient.end();
  }
}

migrate();
