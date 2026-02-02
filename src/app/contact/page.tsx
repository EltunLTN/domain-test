import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - CarParts',
  description: 'Get in touch with our team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:eltunjalilli@gmail.com" 
                  className="text-lg font-medium text-primary hover:underline"
                >
                  eltunjalilli@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Monday - Friday: 9am - 6pm EST
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">CarParts Headquarters</p>
                <p className="text-sm text-muted-foreground mt-2">
                  123 Auto Parts Lane<br />
                  Detroit, MI 48201<br />
                  United States
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                action={`mailto:eltunjalilli@gmail.com`}
                method="post"
                encType="text/plain"
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    placeholder="How can we help?" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This will open your default email client. Alternatively, email us directly at{' '}
                  <a href="mailto:eltunjalilli@gmail.com" className="text-primary hover:underline">
                    eltunjalilli@gmail.com
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
