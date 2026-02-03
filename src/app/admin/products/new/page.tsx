'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function AddProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '0',
    sku: '',
    stock: '',
    categoryId: '',
    brandId: '',
    condition: 'NEW',
    carMake: '',
    carModel: '',
    yearFrom: '',
    yearTo: '',
  });

  if (session?.user?.role !== 'ADMIN') {
    return <div className="p-4 text-red-600">Access Denied</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount: parseFloat(formData.discount),
          stock: parseInt(formData.stock),
          yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : null,
          yearTo: formData.yearTo ? parseInt(formData.yearTo) : null,
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input 
                id="title" 
                name="title" 
                required 
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Oil Filter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Product description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (AZN) *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number"
                  step="0.01"
                  required 
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input 
                  id="discount" 
                  name="discount" 
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input 
                  id="stock" 
                  name="stock" 
                  type="number"
                  required 
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="NEW">New</option>
                <option value="USED">Used</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carMake">Car Make</Label>
                <Input 
                  id="carMake" 
                  name="carMake" 
                  value={formData.carMake}
                  onChange={handleChange}
                  placeholder="e.g., Hyundai"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel">Car Model</Label>
                <Input 
                  id="carModel" 
                  name="carModel" 
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="e.g., i30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearFrom">Year From</Label>
                <Input 
                  id="yearFrom" 
                  name="yearFrom" 
                  type="number"
                  value={formData.yearFrom}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearTo">Year To</Label>
                <Input 
                  id="yearTo" 
                  name="yearTo" 
                  type="number"
                  value={formData.yearTo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
