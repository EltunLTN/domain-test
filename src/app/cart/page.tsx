'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const total = getTotalPrice();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Səbətiniz boşdur</h1>
          <p className="text-muted-foreground mb-6">
            Başlamaq üçün səbətə məhsul əlavə edin
          </p>
          <Link href="/shop">
            <Button>Alış-verişə davam et</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Səbət</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const finalPrice = calculateDiscount(item.price, item.discount);
            const itemTotal = finalPrice * item.quantity;

            return (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 relative bg-muted rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-semibold hover:text-primary line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>

                      <div className="mt-2 flex items-center gap-2">
                        {item.discount > 0 ? (
                          <>
                            <span className="font-bold text-primary">
                              {formatPrice(finalPrice)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold">{formatPrice(itemTotal)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Button variant="outline" onClick={clearCart}>
            Səbəti təmizlə
          </Button>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Sifariş xülasəsi</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Aralıq məbləğ</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Çatdırılma</span>
                  <span>Ödənişdə hesablanır</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Cəmi</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href={`/contact?order=true&items=${encodeURIComponent(JSON.stringify(items.map(i => ({ productId: i.productId, title: i.title, quantity: i.quantity, price: calculateDiscount(i.price, i.discount) }))))}&total=${total}`}>
                <Button className="w-full" size="lg">
                  Sifariş Vermək Üçün Bizimlə Əlaqə Saxla
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full mt-2">
                  Alış-verişə davam et
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
