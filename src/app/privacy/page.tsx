import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Məxfilik Siyasəti - CarParts',
  description: 'Məxfilik siyasətimiz və məlumatların qorunması praktikamız',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold mb-8">Məxfilik Siyasəti</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Son yenilənmə: {new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Topladığımız məlumatlar</h2>
        <p>
          CarParts-da bizə birbaşa təqdim etdiyiniz məlumatları toplayırıq: hesab yaratdıqda, alış etdikdə
          və ya müştəri xidmətinə müraciət etdikdə. Bunlara daxildir:
        </p>
        <ul>
          <li>Ad və əlaqə məlumatları</li>
          <li>Çatdırılma və ödəniş ünvanları</li>
          <li>Ödəniş məlumatları</li>
          <li>Sifariş tarixçəsi</li>
          <li>E-poçt yazışmaları və seçimlər</li>
        </ul>

        <h2>2. Məlumatlardan necə istifadə edirik</h2>
        <p>Topladığımız məlumatlardan aşağıdakı məqsədlərlə istifadə edirik:</p>
        <ul>
          <li>Sifarişlərinizi emal edib yerinə yetirmək</li>
          <li>Sifarişləriniz və hesabınızla bağlı sizinlə əlaqə saxlamaq</li>
          <li>Müştəri dəstəyi göstərmək</li>
          <li>Razılığınız əsasında promo məlumatlar göndərmək</li>
          <li>Xidmətləri və saytın funksionallığını təkmilləşdirmək</li>
          <li>Dələduzluğun qarşısını almaq və təhlükəsizliyi gücləndirmək</li>
        </ul>

        <h2>3. Məlumatların paylaşılması</h2>
        <p>
          Şəxsi məlumatlarınızı üçüncü tərəflərə satmır, dəyişmir və ya icarəyə vermirik. Aşağıdakı tərəflərlə
          paylaşa bilərik:
        </p>
        <ul>
          <li>Sifarişin icrası və çatdırılmasına yardım edən xidmət təminatçıları</li>
          <li>Ödənişlərin tamamlanması üçün ödəniş prosessorları</li>
          <li>Xidmətləri yaxşılaşdırmaq üçün analitika təminatçıları</li>
          <li>Qanun tələb etdikdə hüquq-mühafizə orqanları</li>
        </ul>

        <h2>4. Məlumat təhlükəsizliyi</h2>
        <p>
          Şəxsi məlumatlarınızı icazəsiz giriş, dəyişdirmə, açıqlama və ya məhv edilmədən qorumaq üçün
          uyğun texniki və təşkilati tədbirlər görürük. Buna həssas məlumatların şifrələnməsi və mütəmadi
          təhlükəsizlik auditləri daxildir.
        </p>

        <h2>5. Sizin hüquqlarınız</h2>
        <p>Aşağıdakı hüquqlara maliksiniz:</p>
        <ul>
          <li>Şəxsi məlumatlarınıza çıxış</li>
          <li>Yanlış məlumatların düzəldilməsi</li>
          <li>Məlumatlarınızın silinməsini tələb etmək</li>
          <li>Marketinq yazışmalarından imtina</li>
          <li>Məlumatlarınızı daşına bilən formatda əldə etmək</li>
        </ul>

        <h2>6. Kukilər</h2>
        <p>
          Baxış təcrübənizi yaxşılaşdırmaq, sayt trafikinı analiz etmək və məzmunu fərdiləşdirmək üçün kukilərdən
          və oxşar texnologiyalardan istifadə edirik. Kukiləri brauzer ayarlarından idarə edə bilərsiniz.
        </p>

        <h2>7. Üçüncü tərəf keçidləri</h2>
        <p>
          Saytımız üçüncü tərəf saytlarına keçidlər ehtiva edə bilər. Bu saytlardakı məxfilik praktikalarına görə
          məsuliyyət daşımırıq və onların məxfilik siyasətini oxumağı tövsiyə edirik.
        </p>

        <h2>8. Siyasətdə dəyişikliklər</h2>
        <p>
          Bu məxfilik siyasətini vaxtaşırı yeniləyə bilərik. Əhəmiyyətli dəyişikliklər barədə sizi e-poçtla
          və ya saytda bildirişlə məlumatlandıracağıq.
        </p>

        <h2>9. Əlaqə</h2>
        <p>
          Məxfilik siyasəti və məlumatların idarə edilməsi ilə bağlı suallarınız varsa, bizimlə əlaqə saxlayın:
        </p>
        <p className="not-prose">
          <a href="mailto:eltunjalilli@gmail.com" className="text-primary hover:underline font-medium">
            eltunjalilli@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
