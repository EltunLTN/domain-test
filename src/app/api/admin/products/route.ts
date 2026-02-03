import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

const createProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  discount: z.number().default(0),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  condition: z.enum(['NEW', 'USED']).default('NEW'),
  carMake: z.string().optional(),
  carModel: z.string().optional(),
  yearFrom: z.number().int().optional().nullable(),
  yearTo: z.number().int().optional().nullable(),
  mainImage: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user?.role || '').toString().toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = createProductSchema.parse(body);

    // Create product with slug
    const slug = slugify(validatedData.title);
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this title already exists' },
        { status: 400 }
      );
    }

    // Validate category and brand exist if provided
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    if (validatedData.brandId) {
      const brand = await prisma.brand.findUnique({
        where: { id: validatedData.brandId },
      });
      if (!brand) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        );
      }
    }

    // Get or create default category and brand
    let defaultCategory = await prisma.category.findFirst({
      where: { name: 'Diğer' },
    });
    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: 'Diğer',
          slug: 'diger',
          description: 'Diğer kategoriler',
        },
      });
    }

    let defaultBrand = await prisma.brand.findFirst({
      where: { name: 'Belirtilmemiş' },
    });
    if (!defaultBrand) {
      defaultBrand = await prisma.brand.create({
        data: {
          name: 'Belirtilmemiş',
          slug: 'belirtilmemis',
          description: 'Belirtilmemiş marka',
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        price: validatedData.price,
        discount: validatedData.discount,
        sku: validatedData.sku,
        stock: validatedData.stock,
        condition: validatedData.condition,
        carMake: validatedData.carMake,
        carModel: validatedData.carModel,
        yearFrom: validatedData.yearFrom,
        yearTo: validatedData.yearTo,
        mainImage: validatedData.mainImage,
        categoryId: validatedData.categoryId || defaultCategory.id,
        brandId: validatedData.brandId || defaultBrand.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
