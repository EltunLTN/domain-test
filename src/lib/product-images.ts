// Product image placeholder utility
// Returns a deterministic placeholder image URL based on product ID/title

const productImageMap: Record<string, string> = {
  'brake': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
  'oil': 'https://images.unsplash.com/photo-1628745277038-8d97d5e0ab1d?w=400',
  'filter': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400',
  'spark': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
  'headlight': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400',
  'battery': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400',
  'alternator': 'https://images.unsplash.com/photo-1632823471565-1ecdf02f09e8?w=400',
  'suspension': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400',
  'shock': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400',
  'radiator': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
  'exhaust': 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400',
  'engine': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
  'tire': 'https://images.unsplash.com/photo-1506015391300-4802dc74df77?w=400',
  'wheel': 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400',
  'belt': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
  'hose': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400',
  'sensor': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
  'clutch': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
  'transmission': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
  'steering': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
  'default': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
};

export function getProductImage(productTitle: string, productImage?: string | null): string {
  // If product has an image, use it
  if (productImage) {
    return productImage;
  }

  // Otherwise, find a matching placeholder based on title keywords
  const title = productTitle.toLowerCase();
  
  for (const [keyword, imageUrl] of Object.entries(productImageMap)) {
    if (title.includes(keyword)) {
      return imageUrl;
    }
  }

  // Default fallback
  return productImageMap.default;
}
