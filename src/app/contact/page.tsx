import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import ContactForm from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us - CarParts',
  description: 'Get in touch with our team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Bizimlə Əlaqə</h1>
          <p className="text-muted-foreground text-lg">
            Sualınız var? Bizimlə iletişime geçin. Adınız, emailiniz və telefon nömrənizi yazın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
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
                  24 saat içinde cavab veririk
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
                <p className="text-lg font-medium">+994 50 XXX XX XX</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bazar günü saat 10:00 - 18:00
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ünvan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">CarParts - Bakı</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bakı, Xətai rayonu<br />
                  Azərbaycan
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Mesaj Göndər</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
