import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productVariants } from '@/db/schema';
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

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
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
    const { nameEn, nameAr, descriptionEn, descriptionAr, price, discountPrice, isOnSale, image, categoryId, featured, outOfStock, variants } = body;

    const updated = await db
      .update(products)
      .set({
        ...(nameEn !== undefined && { nameEn: String(nameEn).trim() }),
        ...(nameAr !== undefined && { nameAr: String(nameAr).trim() }),
        ...(descriptionEn !== undefined && { descriptionEn: descriptionEn ? String(descriptionEn).trim() : null }),
        ...(descriptionAr !== undefined && { descriptionAr: descriptionAr ? String(descriptionAr).trim() : null }),
        ...(price !== undefined && { price: String(parseFloat(price)) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? String(parseFloat(discountPrice)) : null }),
        ...(isOnSale !== undefined && { isOnSale: Boolean(isOnSale) }),
        ...(image !== undefined && { image: image ? String(image).trim() : null }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(outOfStock !== undefined && { outOfStock: Boolean(outOfStock) }),
      })
      .where(eq(products.id, productId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (Array.isArray(variants)) {
      await db.delete(productVariants).where(eq(productVariants.productId, productId));
      if (variants.length > 0) {
        await db.insert(productVariants).values(variants.map((variant) => ({
          productId,
          name: String(variant.name).trim(),
          price: String(parseFloat(variant.price)),
          outOfStock: Boolean(variant.outOfStock),
        })));
      }
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
