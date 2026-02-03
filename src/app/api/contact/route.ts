import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Ad ən az 2 simvol olmalıdır'),
  email: z.string().email('Düzgün email daxil edin'),
  phone: z.string().min(7, 'Düzgün telefon nömrəsi daxil edin'),
  subject: z.string().min(3, 'Mövzu ən az 3 simvol olmalıdır').optional(),
  message: z.string().min(10, 'Mesaj ən az 10 simvol olmalıdır').optional(),
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

    // Send email notification using Resend (only if API key is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'CarParts Contact <onboarding@resend.dev>',
          to: ['eltunjalilli@gmail.com'],
          replyTo: validatedData.email,
          subject: validatedData.subject || `Yeni mesaj - ${validatedData.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                Yeni Əlaqə Mesajı
              </h2>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Ad:</strong> ${validatedData.name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                <p style="margin: 10px 0;"><strong>Telefon:</strong> ${validatedData.phone}</p>
                ${validatedData.subject ? `<p style="margin: 10px 0;"><strong>Mövzu:</strong> ${validatedData.subject}</p>` : ''}
              </div>
              
              <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Mesaj:</h3>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${validatedData.message || 'Mesaj yoxdur'}</p>
              </div>
              
              <div style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p>Bu mesaj CarParts saytının əlaqə formasından göndərilib.</p>
                <p>Cavab vermək üçün birbaşa <a href="mailto:${validatedData.email}">${validatedData.email}</a> adresinə yazın.</p>
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
        message: 'Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.',
        id: contact.id 
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
