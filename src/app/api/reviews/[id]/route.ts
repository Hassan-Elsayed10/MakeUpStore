import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
