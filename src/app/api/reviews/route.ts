import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allReviews = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        productNameEn: products.nameEn,
        productNameAr: products.nameAr,
        author: reviews.author,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: allReviews });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, author, rating, comment } = body;

    if (!productId || !author || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const newReview = await db
      .insert(reviews)
      .values({
        productId: parseInt(productId),
        author: String(author).trim(),
        rating: ratingNum,
        comment: comment ? String(comment).trim() : null,
      })
      .returning();

    return NextResponse.json({ review: newReview[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
