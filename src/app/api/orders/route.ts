import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allOrders = await db.query.orders.findMany({
      with: { items: { with: { product: true } } },
      orderBy: [desc(orders.createdAt)],
    });
    return NextResponse.json({ orders: allOrders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, items, total } = body;

    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOrder = await db
      .insert(orders)
      .values({
        customerName: String(customerName).trim(),
        customerEmail: String(customerEmail).trim(),
        customerPhone: customerPhone ? String(customerPhone).trim() : null,
        total: String(parseFloat(total)),
        status: 'pending',
      })
      .returning();

    const orderId = newOrder[0].id;

    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: String(parseFloat(item.price)),
      });
    }

    return NextResponse.json({ order: newOrder[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
