'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, ArrowRight, Zap, Shield, Truck, Clock, Star, Settings } from 'lucide-react';
import { AnimatedSection, AnimatedCard, FadeIn, CarDriveIn, RevEngine, BounceIn } from '@/components/animations';
import { getProductImage } from '@/lib/product-images';

export function HomeClient({ featuredProducts, categories }: any) {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Car Animation */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center md:text-left">
                <BounceIn delay={0.1}>
                  <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                    <span className="text-sm font-semibold">🏆 #1 Trusted Auto Parts Store</span>
                  </div>
                </BounceIn>
                
                <CarDriveIn delay={0.2}>
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Premium
                    <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient">
                      Auto Parts
                    </span>
                    <span className="block text-4xl md:text-6xl">For Every Car</span>
                  </h1>
                </CarDriveIn>
                
                <AnimatedSection delay={0.3}>
                  <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
                    🚗 Genuine & Aftermarket Parts | ⚡ Fast Shipping | 🛡️ Quality Guaranteed
                  </p>
                </AnimatedSection>
                
                <AnimatedSection delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <RevEngine>
                      <Link href="/shop">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg shadow-2xl hover:shadow-blue-500/50 transition-all w-full sm:w-auto">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Shop Now
                        </Button>
                      </Link>
                    </RevEngine>
                    <Link href="/categories">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-2 border-white/50 text-white hover:bg-white hover:text-slate-900 px-10 py-6 text-lg backdrop-blur-sm w-full sm:w-auto"
                      >
                        <Settings className="mr-2 h-5 w-5" />
                        Browse Parts
                      </Button>
                    </Link>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right Content - Feature Cards */}
              <div className="hidden md:grid grid-cols-2 gap-4">
                <BounceIn delay={0.5}>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <Zap className="h-10 w-10 mb-3 text-yellow-400" />
                    <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                    <p className="text-sm text-blue-200">Same day dispatch</p>
                  </div>
                </BounceIn>
                <BounceIn delay={0.6}>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <Shield className="h-10 w-10 mb-3 text-green-400" />
                    <h3 className="font-bold text-lg mb-2">Guaranteed</h3>
                    <p className="text-sm text-blue-200">Quality assured</p>
                  </div>
                </BounceIn>
                <BounceIn delay={0.7}>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <Star className="h-10 w-10 mb-3 text-purple-400" />
                    <h3 className="font-bold text-lg mb-2">Top Rated</h3>
                    <p className="text-sm text-blue-200">5000+ reviews</p>
                  </div>
                </BounceIn>
                <BounceIn delay={0.8}>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <Truck className="h-10 w-10 mb-3 text-cyan-400" />
                    <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                    <p className="text-sm text-blue-200">Orders over $50</p>
                  </div>
                </BounceIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with Car Theme */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <CarDriveIn>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-6 py-2 bg-blue-100 rounded-full">
                <span className="text-sm font-bold text-blue-700">🔧 BROWSE BY CATEGORY</span>
              </div>
              <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shop by Parts
              </h2>
              <p className="text-muted-foreground text-xl">Find exactly what your vehicle needs</p>
            </div>
          </CarDriveIn>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category: any, index: number) => (
              <AnimatedCard key={category.id} delay={index * 0.05}>
                <Link href={`/shop?category=${category.slug}`}>
                  <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 hover:border-blue-500 bg-white cursor-pointer group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-6 md:p-8 text-center relative z-10">
                      <RevEngine>
                        <div className="h-16 md:h-20 flex items-center justify-center mb-3 md:mb-4 text-4xl md:text-5xl group-hover:scale-125 transition-transform duration-300">
                          {category.image || '⚙️'}
                        </div>
                      </RevEngine>
                      <h3 className="font-bold text-sm md:text-base group-hover:text-blue-600 transition-colors">
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

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <BounceIn>
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <div>
                <div className="inline-block mb-2 px-4 py-1 bg-purple-100 rounded-full">
                  <span className="text-xs font-bold text-purple-700">⭐ BESTSELLERS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Featured Products
                </h2>
                <p className="text-muted-foreground text-lg">Top-rated parts loved by customers</p>
              </div>
              <RevEngine>
                <Link href="/shop">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </RevEngine>
            </div>
          </BounceIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any, index: number) => {
              const finalPrice = calculateDiscount(product.price, product.discount);
              const imageUrl = getProductImage(product.title, product.mainImage);

              return (
                <AnimatedCard key={product.id} delay={index * 0.05}>
                  <Link href={`/products/${product.slug}`}>
                    <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 overflow-hidden group border-2 hover:border-purple-500 h-full">
                      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-black shadow-lg animate-pulse">
                            -{product.discount}%
                          </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⚡ Only {product.stock} left!
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <span className="text-xs font-bold text-blue-600">{product.brand.name}</span>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-bold line-clamp-2 mb-3 min-h-[48px] text-base group-hover:text-purple-600 transition-colors">
                          {product.title}
                        </h3>

                        <div className="flex items-baseline gap-2 mb-3">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-2xl font-black text-purple-600">
                                {formatPrice(finalPrice)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-black text-purple-600">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <RevEngine>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg group-hover:shadow-xl transition-all" size="lg">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </RevEngine>
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
