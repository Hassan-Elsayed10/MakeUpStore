import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';

export const maxDuration = 30;

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    console.error('[GET /api/categories]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nameEn, nameAr, slug, image } = body;

    if (!nameEn || !nameAr || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slugClean = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const newCategory = await db
      .insert(categories)
      .values({
        nameEn: String(nameEn).trim(),
        nameAr: String(nameAr).trim(),
        slug: slugClean,
        image: image ? String(image).trim() : null,
      })
      .returning();

    return NextResponse.json({ category: newCategory[0] }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/categories]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
