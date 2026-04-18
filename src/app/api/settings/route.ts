import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { featureSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const settings = await db.select().from(featureSettings);
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ settings: [] });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, enabled } = body;

    if (!key || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(featureSettings)
      .where(eq(featureSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(featureSettings)
        .set({ enabled })
        .where(eq(featureSettings.key, key));
    } else {
      await db.insert(featureSettings).values({ key, enabled });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
