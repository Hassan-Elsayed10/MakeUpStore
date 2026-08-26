import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productVariants } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const maxDuration = 30;

export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      with: { variants: true },
      orderBy: [desc(products.createdAt)],
    });
    return NextResponse.json({ products: allProducts });
  } catch (error) {
    console.error('[GET /api/products]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, price, discountPrice, isOnSale, image, categoryId, featured, outOfStock, variants } = body;

    if (!nameEn || !nameAr || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await db.transaction(async (tx) => {
      const [product] = await tx.insert(products).values({
        nameEn: String(nameEn).trim(),
        nameAr: String(nameAr).trim(),
        descriptionEn: descriptionEn ? String(descriptionEn).trim() : null,
        descriptionAr: descriptionAr ? String(descriptionAr).trim() : null,
        price: String(parseFloat(price)),
        discountPrice: discountPrice ? String(parseFloat(discountPrice)) : null,
        isOnSale: Boolean(isOnSale),
        image: image ? String(image).trim() : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        featured: Boolean(featured),
        outOfStock: Boolean(outOfStock),
      }).returning();

      if (Array.isArray(variants) && variants.length > 0) {
        await tx.insert(productVariants).values(variants.map((variant) => ({
          productId: product.id,
          name: String(variant.name).trim(),
          price: String(parseFloat(variant.price)),
          outOfStock: Boolean(variant.outOfStock),
        })));
      }

      return product;
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/products]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
