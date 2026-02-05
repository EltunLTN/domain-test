import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// This endpoint resets admin password - should be used once and then disabled
// Access with: /api/admin/reset-password?secret=YOUR_RESET_SECRET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  // Security: require a secret key that matches environment variable
  const resetSecret = process.env.ADMIN_RESET_SECRET || 'AvtoReset2024Secret';
  
  if (secret !== resetSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const newEmail = process.env.ADMIN_EMAIL || 'admin@autoparts.az';
    const newPassword = process.env.ADMIN_PASSWORD || 'AvtohisseAdmin2024!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // First, try to update existing admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (existingAdmin) {
      // Update existing admin's email and password
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          email: newEmail,
          password: hashedPassword,
          name: 'Avtohissə Admin',
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Admin credentials updated successfully',
        email: newEmail,
        note: 'Password has been reset. Old sessions will be invalidated on next request.'
      });
    }
    
    // If no admin exists, create one
    const newAdmin = await prisma.user.create({
      data: {
        email: newEmail,
        password: hashedPassword,
        name: 'Avtohissə Admin',
        role: 'ADMIN',
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin created successfully',
      email: newEmail
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      error: 'Failed to reset admin credentials',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
