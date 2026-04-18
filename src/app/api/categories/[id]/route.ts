import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { nameEn, nameAr, slug, image } = body;

    const updated = await db
      .update(categories)
      .set({
        ...(nameEn !== undefined && { nameEn: String(nameEn).trim() }),
        ...(nameAr !== undefined && { nameAr: String(nameAr).trim() }),
        ...(slug !== undefined && { slug: String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') }),
        ...(image !== undefined && { image: image ? String(image).trim() : null }),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category: updated[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await db.delete(categories).where(eq(categories.id, categoryId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
