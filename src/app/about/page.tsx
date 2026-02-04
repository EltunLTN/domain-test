import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, Shield, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Haqqımızda - CarParts',
  description: 'CarParts və keyfiyyətə bağlılığımız barədə daha çox məlumat',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">CarParts haqqında</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            2010-dan bəri keyfiyyətli avtomobil hissələri və mükəmməl xidmət üçün etibarlı tərəfdaşınız
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Missiyamız</h2>
            <p className="text-lg text-center leading-relaxed">
              {"CarParts olaraq, rəqabətli qiymətlərlə premium keyfiyyətli avtomobil hissələri təqdim etməyə sadiqik. "}
              {"Hər bir avtomobil sahibinin mütəxəssis dəstəyi və aparıcı zəmanətlərlə təmin olunan etibarlı hissələrə "}
              {"çıxışı olmalıdır."}
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
                  <h3 className="font-bold text-lg mb-2">Keyfiyyət öncədir</h3>
                  <p className="text-muted-foreground">
                    Hər bir hissənin OEM standartlarına uyğunluğunu təmin etmək üçün aparıcı istehsalçılarla əməkdaşlıq edirik.
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
                  <h3 className="font-bold text-lg mb-2">Müştəriyə fokus</h3>
                  <p className="text-muted-foreground">
                    Avtomobil üzrə ekspert komandamız sizin üçün düzgün hissəni tapmağa həmişə hazırdır.
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
                  <h3 className="font-bold text-lg mb-2">Etibar və etibarlılıq</h3>
                  <p className="text-muted-foreground">
                    Hər bir hissə geniş zəmanət və məmnunluq təminatı ilə təqdim olunur.
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
                  <h3 className="font-bold text-lg mb-2">Sürətli çatdırılma</h3>
                  <p className="text-muted-foreground">
                    50 AZN-dən yuxarı sifarişlərdə pulsuz çatdırılma və ölkə üzrə sürətli göndəriş.
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
            <p className="text-muted-foreground">İllərin təcrübəsi</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">50,000+</p>
            <p className="text-muted-foreground">Anbarda hissə</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">98%</p>
            <p className="text-muted-foreground">Müştəri məmnunluğu</p>
          </div>
        </div>

        {/* Story */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-4">Hekayəmiz</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            2010-cu ildə CarParts Detroytda kiçik ailə biznesi kimi fəaliyyətə başladı.
            {"Avtomobillərə olan sevgimiz və müştəri xidmətinə bağlılığımız sayəsində "}
            onlayn avtomobil hissələri satışında ən etibarlı brendlərdən birinə çevrildik.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Bu gün ölkə üzrə minlərlə müştəriyə xidmət edir, bütün marka və modellər üçün geniş hissə seçimi təqdim edirik.
            Komandamız illərin təcrübəsini müasir texnologiyalarla birləşdirərək hissə seçimini və sifarişi sadə və etibarlı edir.
          </p>
        </div>
      </div>
    </div>
  );
}
