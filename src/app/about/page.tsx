import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, Shield, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - CarParts',
  description: 'Learn more about CarParts and our commitment to quality',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About CarParts</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your trusted partner for quality automotive parts and exceptional service since 2010
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
            <p className="text-lg text-center leading-relaxed">
              At CarParts, we're committed to providing premium quality automotive parts at competitive prices. 
              We believe every vehicle owner deserves access to reliable parts backed by expert support and 
              industry-leading warranties.
            </p>
          </CardContent>
        </Card>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Quality First</h3>
                  <p className="text-muted-foreground">
                    We partner with leading manufacturers to ensure every part meets or exceeds OEM specifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Customer Focus</h3>
                  <p className="text-muted-foreground">
                    Our team of automotive experts is dedicated to helping you find the right part for your vehicle.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Trust & Reliability</h3>
                  <p className="text-muted-foreground">
                    Every part comes with a comprehensive warranty and our satisfaction guarantee.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
                  <p className="text-muted-foreground">
                    Free shipping on orders over $50 with fast delivery across the country.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">15+</p>
            <p className="text-muted-foreground">Years of Experience</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">50,000+</p>
            <p className="text-muted-foreground">Parts in Stock</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">98%</p>
            <p className="text-muted-foreground">Customer Satisfaction</p>
          </div>
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Founded in 2010, CarParts began as a small family-owned auto parts store in Detroit. 
            With a passion for automobiles and a commitment to customer service, we've grown into 
            one of the most trusted online automotive parts retailers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, we serve thousands of customers nationwide, offering an extensive selection of 
            parts for all makes and models. Our team combines decades of automotive experience with 
            cutting-edge technology to make finding and ordering parts simple and reliable.
          </p>
        </div>
      </div>
    </div>
  );
}
