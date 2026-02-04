'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, Search, User, LogOut, Package, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
              <Package className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-lg sm:text-xl font-bold">CarParts</span>
            </Link>
            <nav className="hidden lg:flex gap-4 xl:gap-6">
              <Link href="/shop" className="text-sm font-medium hover:text-primary">
                Mağaza
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:text-primary">
                Kateqoriyalar
              </Link>
              <Link href="/brands" className="text-sm font-medium hover:text-primary">
                Markalar
              </Link>
              <Link href="/car-valuation" className="text-sm font-medium hover:text-primary bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2.5 py-1 rounded-md hover:shadow-lg transition-all whitespace-nowrap">
                Qiymət hesabla
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative w-48 lg:w-56 xl:w-64">
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
                  aria-label="Axtar"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </form>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-[10px] sm:text-xs text-white font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated && (
              <div className="flex items-center gap-1 sm:gap-2">
                {session?.user?.role?.toUpperCase() === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
                      Admin Paneli
                    </Button>
                  </Link>
                )}
                <Link href="/account">
                  <Button variant="ghost" size="icon" title="Hesabım" className="h-9 w-9 sm:h-10 sm:w-10">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="gap-1 sm:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                  title="Çıxış et"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Çıxış</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-3">
            <Link 
              href="/shop" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mağaza
            </Link>
            <Link 
              href="/categories" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kateqoriyalar
            </Link>
            <Link 
              href="/brands" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Markalar
            </Link>
              <Link 
              href="/car-valuation" 
              className="block px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:shadow-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Qiymət hesabla
            </Link>
            
            {/* Mobile Search */}
            <div className="px-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input 
                    placeholder="Parça ara..." 
                    className="pl-8 pr-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
