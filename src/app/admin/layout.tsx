import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
import { Package, ShoppingCart, Users, Settings, LayoutDashboard, Tags, Folder, Gauge } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect if not authenticated or not admin
  await requireAdmin();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-64 border-r bg-gradient-to-b from-slate-50 to-slate-100 p-4 shadow-lg">
        <div className="mb-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
          <div className="flex items-center gap-2">
            <Gauge className="h-6 w-6" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <LayoutDashboard className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium group-hover:text-blue-600 transition-colors">Kontrol Paneli</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <Package className="h-5 w-5 text-slate-600 group-hover:text-purple-600 transition-colors" />
            <span className="font-medium group-hover:text-purple-600 transition-colors">Ürünler</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <Folder className="h-5 w-5 text-slate-600 group-hover:text-green-600 transition-colors" />
            <span className="font-medium group-hover:text-green-600 transition-colors">Kategoriler</span>
          </Link>
          <Link
            href="/admin/brands"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <Tags className="h-5 w-5 text-slate-600 group-hover:text-orange-600 transition-colors" />
            <span className="font-medium group-hover:text-orange-600 transition-colors">Markalar</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <ShoppingCart className="h-5 w-5 text-slate-600 group-hover:text-red-600 transition-colors" />
            <span className="font-medium group-hover:text-red-600 transition-colors">Siparişler</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white hover:shadow-md transition-all duration-200 group"
          >
            <Users className="h-5 w-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
            <span className="font-medium group-hover:text-indigo-600 transition-colors">Kullanıcılar</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100">{children}</main>
    </div>
  );
}
