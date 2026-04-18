import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: product[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, price, image, categoryId, featured } = body;

    const updated = await db
      .update(products)
      .set({
        ...(nameEn !== undefined && { nameEn: String(nameEn).trim() }),
        ...(nameAr !== undefined && { nameAr: String(nameAr).trim() }),
        ...(descriptionEn !== undefined && { descriptionEn: descriptionEn ? String(descriptionEn).trim() : null }),
        ...(descriptionAr !== undefined && { descriptionAr: descriptionAr ? String(descriptionAr).trim() : null }),
        ...(price !== undefined && { price: String(parseFloat(price)) }),
        ...(image !== undefined && { image: image ? String(image).trim() : null }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      })
      .where(eq(products.id, productId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: updated[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, productId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
