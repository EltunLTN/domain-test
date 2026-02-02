'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { AnimatedSection, AnimatedCard, FadeIn } from '@/components/animations';
import { getProductImage } from '@/lib/product-images';

export function HomeClient({ featuredProducts, categories }: any) {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-32 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                <span className="text-sm font-medium">🚗 Premium Auto Parts Since 2010</span>
              </div>
            </FadeIn>
            
            <AnimatedSection delay={0.1}>
              <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
                Quality Parts for
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Every Vehicle
                </span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Genuine and aftermarket parts for all makes and models. Fast shipping, 
                competitive prices, and expert support you can trust.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg backdrop-blur-sm"
                  >
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </section>

      {/* Categories */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Find parts by vehicle system</p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category: any, index: number) => (
              <AnimatedCard key={category.id} delay={index * 0.05}>
                <Link href={`/shop?category=${category.slug}`}>
                  <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm cursor-pointer group">
                    <CardContent className="p-8 text-center">
                      <div className="h-20 flex items-center justify-center mb-4 text-5xl group-hover:scale-110 transition-transform">
                        {category.image || '🔧'}
                      </div>
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
                <p className="text-muted-foreground text-lg">Hand-picked quality parts at great prices</p>
              </div>
              <Link href="/shop">
                <Button variant="outline" size="lg">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any, index: number) => {
              const finalPrice = calculateDiscount(product.price, product.discount);
              const imageUrl = getProductImage(product.title, product.mainImage);

              return (
                <AnimatedCard key={product.id} delay={index * 0.05}>
                  <Link href={`/products/${product.slug}`}>
                    <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group border-2 hover:border-primary/50">
                      <div className="relative h-56 bg-muted overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{product.discount}%
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Only {product.stock} left
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground mb-2 font-medium">
                          {product.brand.name}
                        </div>
                        <h3 className="font-semibold line-clamp-2 mb-3 min-h-[48px] group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>

                        <div className="flex items-baseline gap-2">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-2xl font-bold text-primary">
                                {formatPrice(finalPrice)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedCard delay={0}>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Parts in Stock</div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.1}>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.2}>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">Fast</div>
                <div className="text-muted-foreground">Free Shipping</div>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Expert Support</div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </div>
  );
}
