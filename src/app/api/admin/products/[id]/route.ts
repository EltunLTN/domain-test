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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Məhsul tapılmadı' },
        { status: 404 }
      );
    }

    // Delete product (this will cascade delete related records based on schema)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Məhsul silinə bilmədi' },
      { status: 500 }
    );
  }
}
