import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { z } from 'zod';
import { generateOrderNumber, calculateDiscount } from '@/lib/utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingZip: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = checkoutSchema.parse(body);

    // Fetch products with current prices
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: validatedData.items.map((item) => item.productId),
        },
      },
    });

    if (products.length !== validatedData.items.length) {
      return NextResponse.json({ error: 'Some products not found' }, { status: 400 });
    }

    // Calculate order totals
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of validatedData.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      const finalPrice = calculateDiscount(product.price, product.discount);
      subtotal += finalPrice * item.quantity;

      lineItems.push({
        price_data: {
          currency: 'azn',
          unit_amount: Math.round(finalPrice * 100),
          product_data: {
            name: product.title,
            images: product.mainImage ? [product.mainImage] : [],
          },
        },
        quantity: item.quantity,
      });
    }

    // Create order in database
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        status: 'PENDING',
        subtotal,
        total: subtotal,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        shippingAddress: validatedData.shippingAddress,
        shippingCity: validatedData.shippingCity,
        shippingZip: validatedData.shippingZip,
        notes: validatedData.notes,
        orderItems: {
          create: validatedData.items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            const finalPrice = calculateDiscount(product.price, product.discount);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              discount: product.discount,
              total: finalPrice * item.quantity,
            };
          }),
        },
      },
    });

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${order.orderNumber}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
