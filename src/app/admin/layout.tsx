import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Package, ShoppingCart, Users, Settings, LayoutDashboard, Tags, Folder } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-64 border-r bg-muted/40 p-4">
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Kontrol Paneli</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
          >
            <Package className="h-5 w-5" />
            <span>Ürünler</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
          >
            <Folder className="h-5 w-5" />
            <span>Kategoriler</span>
          </Link>
          <Link
            href="/admin/brands"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
          >
            <Tags className="h-5 w-5" />
            <span>Markalar</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Siparişler</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
          >
            <Users className="h-5 w-5" />
            <span>Kullanıcılar</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
