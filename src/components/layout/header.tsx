'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, Search, User, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((state) => state.getTotalItems());
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render auth buttons until component is mounted and session is loaded
  const isReady = mounted && status !== 'loading';
  const isAuthenticated = isReady && status === 'authenticated' && session?.user;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span className="text-xl font-bold">CarParts</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/shop" className="text-sm font-medium hover:text-primary">
                Mağaza
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:text-primary">
                Kategoriler
              </Link>
              <Link href="/brands" className="text-sm font-medium hover:text-primary">
                Markalar
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  placeholder="Parça ara..." 
                  className="pl-8 pr-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1 hover:bg-muted rounded"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </form>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {!isReady ? (
              <div className="w-12 h-9 bg-muted rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                {session?.user?.role?.toUpperCase() === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      Admin Paneli
                    </Button>
                  </Link>
                )}
                <Link href="/account">
                  <Button variant="ghost" size="icon" title="Hesabım">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Çıkış Yap"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Çıkış</span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
