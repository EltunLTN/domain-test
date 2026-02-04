'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount: number;
  mainImage: string | null;
  stock: number;
}

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      discount: product.discount,
      quantity,
      image: product.mainImage || undefined,
      slug: product.slug,
    });
  };

  return (
    <Button
      className="w-full"
      size="sm"
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {product.stock > 0 ? 'Səbətə əlavə et' : 'Stokda yoxdur'}
    </Button>
  );
}
