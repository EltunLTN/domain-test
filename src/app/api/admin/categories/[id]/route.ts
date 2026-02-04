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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Kateqoriya tapılmadı' },
        { status: 404 }
      );
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `${category._count.products} məhsulu olan kateqoriyanı silmək olmaz. Əvvəl məhsulları silin.` },
        { status: 400 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Kateqoriya silinə bilmədi' },
      { status: 500 }
    );
  }
}
