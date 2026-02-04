'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paytr'>('paytr');
  const [formData, setFormData] = useState({
    customerName: session?.user?.name || '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingZip: '',
    notes: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use PayTR for Azerbaycan
      const endpoint = '/api/paytr/checkout';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ödəniş uğursuz oldu');
      }

      // Redirect to PayTR payment gateway
      if (data.token) {
        // PayTR uses an iframe or redirect
        window.location.href = `https://www.paytr.com/odeme/guvenli?token=${data.token}`;
      } else {
        throw new Error('Ödəniş tokeni alınmadı');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Ödəniş uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-16 text-center">Yüklənir...</div>;
  }

  const total = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ödəniş</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Çatdırılma məlumatları</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Ad Soyad *</Label>
                    <Input
                      id="customerName"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">E-poçt *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Telefon nömrəsi *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Ünvan *</Label>
                  <Input
                    id="shippingAddress"
                    required
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">Şəhər *</Label>
                    <Input
                      id="shippingCity"
                      required
                      value={formData.shippingCity}
                      onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingZip">Poçt indeksi</Label>
                    <Input
                      id="shippingZip"
                      value={formData.shippingZip}
                      onChange={(e) => setFormData({ ...formData, shippingZip: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Sifariş qeydləri (istəyə bağlı)</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Çatdırılma üçün xüsusi qeydlər"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ödəniş üsulu *</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-muted bg-blue-50">
                      <span className="text-sm font-semibold">💳 PayTR - Təhlükəsiz ödəniş</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Emal olunur...' : 'PayTR ilə ödə'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sifariş xülasəsi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Cəmi</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
