'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
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
    mainImage: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);
        
        if (catsRes.ok) setCategories(await catsRes.json());
        if (brandsRes.ok) setBrands(await brandsRes.json());
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  // Loading state while checking session
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

      const data = await response.json();
      
      if (response.ok) {
        router.push('/admin/products');
      } else {
        setError(data.error || 'Ürün oluşturulamadı');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ürün eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Yeni Ürün Ekle</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Ürün Adı *</Label>
              <Input 
                id="title" 
                name="title" 
                required 
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Yağ Filtresi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Ürün açıklaması"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat (AZN) *</Label>
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
                <Label htmlFor="discount">İndirim (%)</Label>
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
                <Label htmlFor="stock">Stok *</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="">Kategori Seç</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandId">Marka</Label>
                <select
                  id="brandId"
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                >
                  <option value="">Marka Seç</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Durum</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="NEW">Yeni</option>
                <option value="USED">Kullanılmış</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainImage">Ana Görüntü URL</Label>
              <Input 
                id="mainImage" 
                name="mainImage" 
                type="url"
                value={formData.mainImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carMake">Araç Markası</Label>
                <Input 
                  id="carMake" 
                  name="carMake" 
                  value={formData.carMake}
                  onChange={handleChange}
                  placeholder="Örn: Hyundai"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel">Araç Modeli</Label>
                <Input 
                  id="carModel" 
                  name="carModel" 
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="Örn: i30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearFrom">Yılından</Label>
                <Input 
                  id="yearFrom" 
                  name="yearFrom" 
                  type="number"
                  value={formData.yearFrom}
                  onChange={handleChange}
                  placeholder="2012"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearTo">Yılına</Label>
                <Input 
                  id="yearTo" 
                  name="yearTo" 
                  type="number"
                  value={formData.yearTo}
                  onChange={handleChange}
                  placeholder="2025"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Oluşturuluyor...' : 'Ürün Ekle'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                size="lg"
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
