import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'İcazəsiz' }, { status: 401 });
    }
    
    const role = (session.user?.role || '').toString().toUpperCase();
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin girişi tələb olunur' }, { status: 403 });
    }

    const { id } = params;

    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Marka tapılmadı' },
        { status: 404 }
      );
    }

    // Check if brand has products
    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: `${brand._count.products} məhsulu olan markanı silmək olmaz. Əvvəl məhsulları silin.` },
        { status: 400 }
      );
    }

    // Delete brand
    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Marka silinə bilmədi' },
      { status: 500 }
    );
  }
}
