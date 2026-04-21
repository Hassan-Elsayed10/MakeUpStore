import { db } from './index';
import { products } from './schema';
import { eq, or } from 'drizzle-orm';

async function addOffers() {
  console.log('🛍️ Adding offers to products...');

  try {
    // Update some products to be on sale
    const allProducts = await db.select().from(products).limit(5);

    if (allProducts.length === 0) {
      console.log('⚠️ No products found in database.');
      return;
    }

    for (let i = 0; i < Math.min(allProducts.length, 3); i++) {
        const product = allProducts[i];
        const originalPrice = parseFloat(product.price);
        const discountPrice = (originalPrice * 0.8).toFixed(2); // 20% off

        await db.update(products)
          .set({
            isOnSale: true,
            discountPrice: discountPrice
          })
          .where(eq(products.id, product.id));

        console.log(`✅ Added offer to: ${product.nameEn} (${discountPrice} discount)`);
    }

    console.log('✨ Offers added successfully!');
  } catch (error) {
    console.error('❌ Failed to add offers:', error);
  } finally {
    process.exit(0);
  }
}

addOffers();
