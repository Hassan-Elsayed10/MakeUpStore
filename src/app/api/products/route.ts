import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const maxDuration = 30;

export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return NextResponse.json({ products: allProducts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, price, image, categoryId, featured } = body;

    if (!nameEn || !nameAr || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await db
      .insert(products)
      .values({
        nameEn: String(nameEn).trim(),
        nameAr: String(nameAr).trim(),
        descriptionEn: descriptionEn ? String(descriptionEn).trim() : null,
        descriptionAr: descriptionAr ? String(descriptionAr).trim() : null,
        price: String(parseFloat(price)),
        image: image ? String(image).trim() : null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        featured: Boolean(featured),
      })
      .returning();

    return NextResponse.json({ product: newProduct[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
