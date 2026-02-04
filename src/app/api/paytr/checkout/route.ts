import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { z } from 'zod';
import { generateOrderNumber, calculateDiscount } from '@/lib/utils';
import crypto from 'crypto';

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
      return NextResponse.json({ error: 'İcazəsiz' }, { status: 401 });
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
      return NextResponse.json({ error: 'Bəzi məhsullar tapılmadı' }, { status: 400 });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: number;
      discount: number;
      total: number;
      title: string;
    }> = [];

    for (const item of validatedData.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.title} üçün kifayət qədər anbar yoxdur` },
          { status: 400 }
        );
      }

      const finalPrice = calculateDiscount(product.price, product.discount);
      subtotal += finalPrice * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount,
        total: finalPrice * item.quantity,
        title: product.title,
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
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            total: item.total,
          })),
        },
      },
    });

    // Prepare PayTR payment parameters
    const merchantId = process.env.PAYTR_MERCHANT_ID;
    const apiKey = process.env.PAYTR_API_KEY;
    const apiSecret = process.env.PAYTR_API_SECRET;

    if (!merchantId || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'PayTR konfiqurasiyası yoxdur' },
        { status: 500 }
      );
    }

    // Create PayTR token
    const merchantOid = order.id;
    const totalAmount = Math.round(subtotal * 100); // PayTR expects amount in cents
    const userEmail = validatedData.customerEmail;
    const userName = validatedData.customerName;
    const userPhone = validatedData.customerPhone;
    const userAddress = validatedData.shippingAddress;
    const userCity = validatedData.shippingCity;
    const userCountry = 'Azerbaijan';

    const merchantSalt = apiSecret;
    const hashStr = merchantId + merchantOid + totalAmount + userEmail + userName + userPhone + userAddress + userCity + userCountry + merchantSalt;
    const paytrToken = crypto.createHash('sha256').update(hashStr).digest('hex');

    // Create PayTR payment request
    const paytrData = {
      merchant_id: merchantId,
      user_ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: totalAmount,
      payment_currency: 'AZN',
      user_name: userName,
      user_phone: userPhone,
      user_address: userAddress,
      user_city: userCity,
      user_country: userCountry,
      merchant_ok_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderNumber}?success=true`,
      merchant_fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      paytr_token: paytrToken,
      timeout_in_seconds: 600,
      test_mode: 0,
    };

    try {
      const response = await axios.post('https://www.paytr.com/odeme/api/get-token', paytrData);

      if (response.data.status === 'success') {
        // Update order with PayTR token
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            paymentMethod: 'PAYTR',
            stripeSessionId: response.data.token, // Store PayTR token here
          },
        });

        return NextResponse.json({
          method: 'paytr',
          token: response.data.token,
          orderNumber: order.orderNumber,
          orderId: order.id,
        });
      } else {
        return NextResponse.json(
          { error: 'PayTR ödəniş tokeni yaradılmadı' },
          { status: 400 }
        );
      }
    } catch (paytrError) {
      console.error('PayTR error:', paytrError);
      return NextResponse.json(
        { error: 'Ödəniş şlüzü xətası' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Daxili server xətası' }, { status: 500 });
  }
}
