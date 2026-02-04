'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
