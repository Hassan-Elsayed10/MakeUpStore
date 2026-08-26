import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, products, productVariants } from '@/db/schema';
import { desc, inArray } from 'drizzle-orm';

export async function GET() {
  try {
    const allOrders = await db.query.orders.findMany({
      with: { items: { with: { product: true, variant: true } } },
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
    const { customerName, customerAddress, customerPhone, items } = body;

    if (
      typeof customerName !== 'string' ||
      typeof customerAddress !== 'string' ||
      typeof customerPhone !== 'string' ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50
    ) {
      return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });
    }

    const name = customerName.trim();
    const address = customerAddress.trim();
    const phone = customerPhone.trim();
    const phoneDigits = phone.replace(/[\s-]/g, '').replace(/^\+/, '');

    if (
      name.length < 2 || name.length > 100 ||
      address.length < 5 || address.length > 500 ||
      !/^\+?\d{10,15}$/.test(phoneDigits) ||
      phone.length > 16
    ) {
      return NextResponse.json({ error: 'Please provide valid customer details' }, { status: 400 });
    }

    const requestedItems = items.map((item) => ({
      productId: Number(item?.productId),
      variantId: item?.variantId === undefined || item?.variantId === null || item?.variantId === ''
        ? undefined
        : Number(item.variantId),
      quantity: Number(item?.quantity),
    }));

    if (requestedItems.some((item) =>
      !Number.isInteger(item.productId) || item.productId <= 0 ||
      (item.variantId !== undefined && (!Number.isInteger(item.variantId) || item.variantId <= 0)) ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
    )) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    const productIds = Array.from(new Set(requestedItems.map((item) => item.productId)));
    const availableProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));
    const productById = new Map(availableProducts.map((product) => [product.id, product]));
    const requestedVariantIds = requestedItems.flatMap((item) => item.variantId ? [item.variantId] : []);
    const availableVariants = requestedVariantIds.length > 0
      ? await db.select().from(productVariants).where(inArray(productVariants.id, requestedVariantIds))
      : [];
    const productVariantsList = await db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds));
    const variantById = new Map(availableVariants.map((variant) => [variant.id, variant]));
    const productsWithVariants = new Set(productVariantsList.map((variant) => variant.productId));

    if (
      availableProducts.length !== productIds.length ||
      availableProducts.some((product) => product.outOfStock) ||
      availableVariants.length !== requestedVariantIds.length ||
      requestedItems.some((item) => productsWithVariants.has(item.productId) && item.variantId === undefined) ||
      requestedItems.some((item) => item.variantId && variantById.get(item.variantId)?.productId !== item.productId) ||
      availableVariants.some((variant) => variant.outOfStock)
    ) {
      return NextResponse.json({ error: 'One or more products are unavailable' }, { status: 409 });
    }

    const pricedItems = requestedItems.map((item) => {
      const product = productById.get(item.productId)!;
      const variant = item.variantId ? variantById.get(item.variantId) : undefined;
      const price = variant?.price || (product.isOnSale && product.discountPrice
        ? product.discountPrice
        : product.price);
      return { ...item, price };
    });
    const calculatedTotal = pricedItems.reduce(
      (sum, item) => sum + Math.round(Number(item.price) * 100) * item.quantity,
      0
    );

    if (!Number.isFinite(calculatedTotal) || calculatedTotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    const newOrder = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          customerName: name,
          customerAddress: address,
          customerPhone: phone,
          total: (calculatedTotal / 100).toFixed(2),
          status: 'pending',
        })
        .returning();

      await tx.insert(orderItems).values(pricedItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })));

      return order;
    });

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
