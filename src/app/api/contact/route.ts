import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Ad ən az 2 simvol olmalıdır'),
  email: z.string().email('Düzgün e-poçt daxil edin'),
  phone: z.string().min(7, 'Düzgün telefon nömrəsi daxil edin'),
  subject: z.string().min(3, 'Mövzu ən az 3 simvol olmalıdır').optional(),
  message: z.string().min(10, 'Mesaj ən az 10 simvol olmalıdır').optional(),
  orderItems: z.array(z.object({
    productId: z.string(),
    title: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).optional(),
  orderTotal: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Save contact request to database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject || 'Ümumi Sorğu',
        message: validatedData.message || '',
        status: 'NEW',
      },
    });

    // If order items exist, create an order in the database
    let order: { id: string; orderNumber: string } | null = null;
    if (validatedData.orderItems && validatedData.orderItems.length > 0) {
      // Find or create a guest user for this email
      let user = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (!user) {
        // Create a guest user with random password (they won't login with it)
        const bcrypt = await import('bcryptjs');
        const randomPassword = Math.random().toString(36).slice(-12);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        user = await prisma.user.create({
          data: {
            email: validatedData.email,
            name: validatedData.name,
            password: hashedPassword,
            role: 'USER',
          }
        });
      }

      // Generate unique order number
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(-5).toUpperCase()}`;

      // Calculate totals
      const subtotal = validatedData.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = validatedData.orderTotal || subtotal;

      // Create order with items
      order = await prisma.order.create({
        data: {
          userId: user.id,
          orderNumber,
          status: 'PENDING',
          total,
          subtotal,
          customerName: validatedData.name,
          customerEmail: validatedData.email,
          customerPhone: validatedData.phone,
          shippingAddress: validatedData.message || 'Əlaqə formu ilə sifariş',
          shippingCity: 'Bakı',
          shippingCountry: 'Azerbaijan',
          paymentMethod: 'contact_form',
          notes: validatedData.message || null,
          orderItems: {
            create: validatedData.orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discount: 0,
              total: item.price * item.quantity,
            }))
          }
        },
        include: {
          orderItems: true
        }
      });
    }

    // Send email notification using Resend (only if API key is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'CarParts Contact <onboarding@resend.dev>',
          to: ['eltunjalilli@gmail.com'],
          replyTo: validatedData.email,
          subject: validatedData.orderItems && validatedData.orderItems.length > 0 
            ? `Yeni Sifariş - ${validatedData.name}` 
            : (validatedData.subject || `Yeni mesaj - ${validatedData.name}`),
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                ${validatedData.orderItems && validatedData.orderItems.length > 0 ? '🛒 Yeni Sifariş' : 'Yeni Əlaqə Mesajı'}
              </h2>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Ad:</strong> ${validatedData.name}</p>
                <p style="margin: 10px 0;"><strong>E-poçt:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                <p style="margin: 10px 0;"><strong>Telefon:</strong> ${validatedData.phone}</p>
                ${validatedData.subject ? `<p style="margin: 10px 0;"><strong>Mövzu:</strong> ${validatedData.subject}</p>` : ''}
              </div>
              
              ${validatedData.orderItems && validatedData.orderItems.length > 0 ? `
              <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">📦 Sifariş edilən məhsullar:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb;">Məhsul</th>
                      <th style="text-align: center; padding: 10px; border-bottom: 1px solid #e5e7eb;">Say</th>
                      <th style="text-align: right; padding: 10px; border-bottom: 1px solid #e5e7eb;">Qiymət</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${validatedData.orderItems.map((item: any) => `
                      <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
                        <td style="text-align: center; padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                        <td style="text-align: right; padding: 10px; border-bottom: 1px solid #e5e7eb;">AZN ${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f0f9ff;">
                      <td colspan="2" style="padding: 10px; font-weight: bold;">Cəmi:</td>
                      <td style="text-align: right; padding: 10px; font-weight: bold; color: #4F46E5;">AZN ${validatedData.orderTotal?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              ` : ''}
              
              <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Mesaj:</h3>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${validatedData.message || 'Mesaj yoxdur'}</p>
              </div>
              
              <div style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p>Bu mesaj CarParts saytının əlaqə formasından göndərilib.</p>
                <p>Cavab vermək üçün birbaşa <a href="mailto:${validatedData.email}">${validatedData.email}</a> ünvanına yazın.</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails - at least it's saved to database
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: order 
          ? `Sifarişiniz qeydə alındı! Sifariş nömrəsi: ${order.orderNumber}. Tezliklə sizinlə əlaqə saxlayacağıq.`
          : 'Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.',
        id: contact.id,
        orderId: order?.id,
        orderNumber: order?.orderNumber
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Mesaj göndərilmədi. Zəhmət olmasa yenidən cəhd edin.' },
      { status: 500 }
    );
  }
}
