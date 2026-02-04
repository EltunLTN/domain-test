import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import ContactForm from '@/components/contact-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Əlaqə - CarParts',
  description: 'Komandamızla əlaqə saxlayın',
};

function ContactFormWrapper() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
      <ContactForm />
    </Suspense>
  );
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bizimlə Əlaqə</h1>
          <p className="text-muted-foreground text-lg">
            Sualınız var? Bizimlə əlaqə saxlayın. Adınız, emailiniz və mesajınızı yazın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  E-poçt
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
                  24 saat içində cavab veririk
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Telefon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">+994 99 999 99 99</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Hər gün saat 10:00 - 18:00
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Mesaj göndər</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactFormWrapper />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
