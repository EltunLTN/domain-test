'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, ShoppingBag } from 'lucide-react';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const isOrder = searchParams.get('order') === 'true';
    const itemsParam = searchParams.get('items');
    const totalParam = searchParams.get('total');
    
    if (isOrder && itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));
        setOrderItems(items);
        setOrderTotal(parseFloat(totalParam || '0'));
        setFormData(prev => ({
          ...prev,
          subject: 'Sifariş sorğusu',
          message: 'Səbətimdəki məhsulları sifariş etmək istəyirəm.'
        }));
      } catch (e) {
        console.error('Error parsing order items:', e);
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          orderItems: orderItems.length > 0 ? orderItems : undefined,
          orderTotal: orderTotal > 0 ? orderTotal : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setOrderItems([]);
        setOrderTotal(0);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Mesaj göndərilə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sifariş məhsulları göstərilir */}
      {orderItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Sifariş ediləcək məhsullar</h3>
          </div>
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                <span className="font-medium">{item.title}</span>
                <span className="text-muted-foreground">
                  {item.quantity} x AZN {item.price.toFixed(2)} = <strong>AZN {(item.quantity * item.price).toFixed(2)}</strong>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between font-bold">
            <span>Cəmi:</span>
            <span className="text-blue-600">AZN {orderTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Ad və soyad *</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Eltun Jalilli" 
          required 
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-poçt *</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="siz@example.com" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon *</Label>
        <Input 
          id="phone" 
          name="phone" 
          placeholder="+994 50 XXX XX XX" 
          required 
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Mövzu</Label>
        <Input 
          id="subject" 
          name="subject" 
          placeholder="Mövzunun başlığı" 
          value={formData.subject}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mesaj</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Məlumatınızı yazın..."
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
          ✓ Mesajınız alındı. Tezliklə sizinlə əlaqə saxlayacağıq.
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        <Send className="mr-2 h-4 w-4" />
        {loading ? 'Göndərilir...' : 'Mesaj göndər'}
      </Button>
    </form>
  );
}
