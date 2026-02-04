'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, ArrowRight, Zap, Shield, Truck, Clock, Star, Settings, Award, TrendingUp, Package, Users, CheckCircle, Sparkles } from 'lucide-react';
import { AnimatedSection, AnimatedCard, FadeIn, CarDriveIn, RevEngine, BounceIn } from '@/components/animations';
import { getProductImage } from '@/lib/product-images';
import { MouseTrail } from '@/components/mouse-trail';

export function HomeClient({ featuredProducts, categories }: any) {
  return (
    <div className="flex flex-col custom-cursor">
      <MouseTrail />
      
      {/* Enhanced Hero Section with Light Colors */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-900 py-12 sm:py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Advanced Animated Background */}
        <div className="absolute inset-0">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.2'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-white/50 via-transparent to-blue-100/30" />
          
          {/* Animated Light Beams */}
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-300/30 to-transparent animate-beam-slow" />
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-purple-300/30 to-transparent animate-beam-medium" />
          <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-pink-300/30 to-transparent animate-beam-fast" />
        </div>
        
        {/* Enhanced Animated Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-3000" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 md:gap-16 items-center">
              {/* Enhanced Left Content */}
              <div className="text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8">
                <BounceIn delay={0.1}>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4 px-3 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-xl rounded-full border-2 border-blue-200 shadow-xl">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Azərbaycanın #1 etibarlı avto ehtiyat hissələri platforması
                    </span>
                  </div>
                </BounceIn>
                
                <CarDriveIn delay={0.2}>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.1] mb-4 sm:mb-6">
                    <span className="block text-slate-800">Sizin avtomobiliniz</span>
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-slow bg-[length:200%_auto]">
                      Layiqdir
                    </span>
                    <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                      Ən yaxşısına
                    </span>
                  </h1>
                </CarDriveIn>
                
                <AnimatedSection delay={0.3}>
                  <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                    Orijinal zəmanətli premium ehtiyat hissələri. Azərbaycanda sürətli çatdırılma.
                    <span className="block mt-2 font-semibold text-slate-800">Sizin məmnuniyyətiniz — bizim öhdəliyimiz.</span>
                  </p>
                </AnimatedSection>
                
                {/* Quick Stats */}
                <AnimatedSection delay={0.35}>
                  <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center lg:justify-start text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-slate-700 font-medium">10,000+ məhsul</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-slate-700 font-medium">Eyni gün çatdırılma</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-slate-700 font-medium">Orijinal hissələr</span>
                    </div>
                  </div>
                </AnimatedSection>
                
                <AnimatedSection delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                    <RevEngine>
                      <Link href="/shop" className="w-full sm:w-auto">
                        <Button size="lg" className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 sm:px-12 py-4 sm:py-7 text-base sm:text-lg font-bold shadow-2xl hover:shadow-purple-500/50 transition-all overflow-hidden w-full">
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
                          Məhsullara bax
                        </Button>
                      </Link>
                    </RevEngine>
                    <Link href="/car-valuation" className="w-full sm:w-auto">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 sm:px-12 py-4 sm:py-7 text-base sm:text-lg font-bold shadow-lg hover:shadow-blue-500/50 transition-all w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Süni intellektlə qiymətləndirmə
                      </Button>
                    </Link>
                  </div>
                </AnimatedSection>
              </div>

              {/* Enhanced Right Content - Premium Feature Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mt-6 lg:mt-0">
                <BounceIn delay={0.5} className="col-span-2">
                  <div className="relative group bg-white/90 backdrop-blur-2xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-4">
                        <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                          <Zap className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-base sm:text-lg md:text-2xl mb-0.5 sm:mb-1 text-slate-800">İldırım sürətli</h3>
                          <p className="text-xs sm:text-sm md:text-base text-slate-600">Bakıda eyni gün çatdırılma</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </BounceIn>

                <BounceIn delay={0.6}>
                  <div className="relative group bg-white/90 backdrop-blur-2xl p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-500 hover:scale-105 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col h-full justify-center">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl shadow-lg w-fit mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                      </div>
                      <h3 className="font-black text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 text-slate-800">100% orijinal</h3>
                      <p className="text-xs sm:text-sm text-slate-600">Keyfiyyətə zəmanət</p>
                    </div>
                  </div>
                </BounceIn>

                <BounceIn delay={0.7}>
                  <div className="relative group bg-white/90 backdrop-blur-2xl p-6 rounded-3xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-500 hover:scale-105 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col h-full justify-center">
                      <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                        <Award className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-black text-lg mb-1 text-slate-800">Ən yüksək qiymətləndirilən</h3>
                      <p className="text-sm text-slate-600">5000+ rəy</p>
                    </div>
                  </div>
                </BounceIn>

                <BounceIn delay={0.8} className="col-span-2">
                  <div className="relative group bg-white/90 backdrop-blur-2xl p-6 rounded-3xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                          <Truck className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-xl mb-1 text-slate-800">Pulsuz çatdırılma</h3>
                          <p className="text-sm text-slate-600">50 AZN-dən yuxarı sifarişlərdə</p>
                        </div>
                      </div>
                      <div className="hidden sm:block text-4xl">🚚</div>
                    </div>
                  </div>
                </BounceIn>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-600/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-blue-600 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <CarDriveIn>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border-2 border-blue-200/50 shadow-lg">
                <Settings className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-black text-blue-700">KATEQORİYA ÜZRƏ SEÇİM</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sizə uyğun hissəni tapın
              </h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                Geniş premium ehtiyat hissələri kolleksiyamızı nəzərdən keçirin
              </p>
            </div>
          </CarDriveIn>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category: any, index: number) => (
              <AnimatedCard key={category.id} delay={index * 0.05}>
                <Link href={`/shop?category=${category.slug}`}>
                  <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-2 hover:border-blue-500 bg-white cursor-pointer group h-full">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                    
                    <CardContent className="p-6 md:p-8 text-center relative z-10">
                      <RevEngine>
                        <div className="h-16 md:h-20 flex items-center justify-center mb-3 md:mb-4 text-4xl md:text-5xl group-hover:scale-125 transition-transform duration-500 filter group-hover:drop-shadow-lg">
                          {category.image || '⚙️'}
                        </div>
                      </RevEngine>
                      <h3 className="font-black text-sm md:text-base group-hover:text-blue-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <div className="mt-2 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 mx-auto rounded-full" />
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Featured Products Section */}
      <section className="relative py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <BounceIn>
            <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200/50 shadow-lg">
                  <Star className="h-4 w-4 text-purple-600 animate-pulse" />
                  <span className="text-sm font-black text-purple-700">ƏN ÇOX SATILANLAR</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Premium seçim
                </h2>
                <p className="text-muted-foreground text-xl max-w-2xl">
                  Minlərlə müştərinin etibar etdiyi, diqqətlə seçilmiş yüksək keyfiyyətli hissələr
                </p>
              </div>
              <RevEngine>
                <Link href="/shop">
                  <Button size="lg" className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/50 px-8 py-6 text-lg font-bold overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center">
                      Bütün məhsullara bax
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </RevEngine>
            </div>
          </BounceIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any, index: number) => {
              const finalPrice = calculateDiscount(product.price, product.discount);
              const imageUrl = getProductImage(product.title, product.mainImage);

              return (
                <AnimatedCard key={product.id} delay={index * 0.05}>
                  <Link href={`/products/${product.slug}`}>
                    <Card className="group relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden border-2 hover:border-purple-500 h-full bg-white">
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                      
                      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </div>
                        
                        {product.discount > 0 && (
                          <div className="absolute top-4 right-4 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur animate-pulse" />
                              <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-xl">
                                -{product.discount}%
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {product.stock <= 5 && product.stock > 0 && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Yalnız {product.stock} ədəd qalıb!
                          </div>
                        )}
                        
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg z-20 border border-blue-100">
                          <span className="text-xs font-black text-blue-600">{product.brand.name}</span>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-bold line-clamp-2 min-h-[48px] text-base group-hover:text-purple-600 transition-colors duration-300">
                          {product.title}
                        </h3>

                        <div className="flex items-baseline gap-3">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {formatPrice(finalPrice)}
                              </span>
                              <span className="text-base text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0">
                        <RevEngine>
                          <Button className="w-full group/btn relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg group-hover:shadow-xl transition-all overflow-hidden" size="lg">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            <span className="relative flex items-center justify-center">
                              <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
                              Ətraflı bax
                            </span>
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

      {/* Enhanced Stats Section with Car Theme */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <BounceIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-black">NİYƏ BİZİ SEÇİRLƏR</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Minlərlə insanın etibarı
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Azərbaycan üzrə məmnun müştərilərimizin artan icmasına qoşulun
              </p>
            </div>
          </BounceIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <AnimatedCard delay={0}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:border-cyan-400/50 transition-all duration-500 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-4 shadow-lg">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-blue-200 font-semibold">Mövcud məhsul</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mb-4 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    25K+
                  </div>
                  <div className="text-blue-200 font-semibold">Məmnun müştəri</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl mb-4 shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    98%
                  </div>
                  <div className="text-blue-200 font-semibold">Məmnunluq faizi</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:border-pink-400/50 transition-all duration-500 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-5xl font-black mb-2 bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-blue-200 font-semibold">Sürətli çatdırılma</div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* New Testimonials Section */}
      <section className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        
        <div className="container mx-auto px-4">
          <CarDriveIn>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border-2 border-blue-200/50 shadow-lg">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-black text-blue-700">MÜŞTƏRİ RƏYLƏRİ</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Müştərilərimiz nə deyir
              </h2>
            </div>
          </CarDriveIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Əli Məmmədov",
                role: "BMW X5 sahibi",
                rating: 5,
                text: "Çox keyfiyyətli hissələr və sürətli çatdırılma. Artıq 2 ildir ki, buradan alış-veriş edirəm. Hamıya tövsiyə edirəm! 🚗",
                delay: 0
              },
              {
                name: "Leyla Həsənova",
                role: "Mercedes C-Class sahibi",
                rating: 5,
                text: "Original ehtiyat hissələri və çox peşəkar xidmət. Qiymətlər də əlverişlidir. Təşəkkürlər! ⭐",
                delay: 0.1
              },
              {
                name: "Rəşad Əliyev",
                role: "Toyota Camry sahibi",
                rating: 5,
                text: "AI qiymət hesablayıcı çox faydalıdır. Hissələr vaxtında gəlir və keyfiyyət əladır. Super! 👍",
                delay: 0.2
              }
            ].map((testimonial, index) => (
              <AnimatedCard key={index} delay={testimonial.delay}>
                <Card className="relative h-full bg-white border-2 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden group">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <BounceIn>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 mb-4">
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                <span className="text-sm font-black">XÜSUSİ TƏKLİF</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black leading-tight">
                Avtomobilinizi
                <span className="block mt-2">yeniləməyə hazırsınız?</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                İlk sifarişinizə 15% endirim! Premium hissələr — bənzərsiz qiymətlərlə.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <RevEngine>
                  <Link href="/shop">
                    <Button size="lg" className="group bg-white text-blue-600 hover:bg-blue-50 px-12 py-7 text-lg font-black shadow-2xl w-full sm:w-auto">
                      <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                      Alış-verişə başla
                    </Button>
                  </Link>
                </RevEngine>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-7 text-lg font-black backdrop-blur-xl w-full sm:w-auto">
                    Əlaqə
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </BounceIn>
        </div>
      </section>
    </div>
  );
}
