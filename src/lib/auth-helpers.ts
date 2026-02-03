import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

/**
 * Server-side helper to require admin authentication
 * Throws redirect if not authenticated or not admin
 */
export async function requireAdmin() {
  'use server';
  
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }

  const role = (session.user?.role || '').toString().toUpperCase();
  
  if (role !== 'ADMIN') {
    redirect('/');
  }

  return session;
}

/**
 * Server-side helper to check if user is authenticated
 * Throws redirect if not authenticated
 */
export async function requireAuth() {
  'use server';
  
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }

  return session;
}

/**
 * Server-side helper to get current session (nullable)
 */
export async function getCurrentSession() {
  'use server';
  
  return await getServerSession(authOptions);
}
