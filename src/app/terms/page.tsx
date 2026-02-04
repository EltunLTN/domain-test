import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Şərtlər və Qaydalar - CarParts',
  description: 'Xidmət şərtləri və istifadə qaydaları',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold mb-8">Şərtlər və Qaydalar</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Son yenilənmə: {new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Şərtlərin qəbulu</h2>
        <p>
          CarParts ("Vebsayt") xidmətindən istifadə etməklə bu Şərtləri qəbul edir və onlara riayət etməyi
          öhdənizə götürürsünüz. Razı deyilsinizsə, xidmətlərimizdən istifadə etməyin.
        </p>

        <h2>2. Vebsaytdan istifadə</h2>
        <p>
          Vebsaytdan yalnız qanuni məqsədlər üçün və başqalarının hüquqlarını pozmadan istifadə etməyi
          qəbul edirsiniz. Qadağan olunan davranışlara daxildir:
        </p>
        <ul>
          <li>Qanunsuz, hədələyici və ya təhqiredici məzmun göndərmək</li>
          <li>Sistemlərimizə icazəsiz daxil olmağa cəhd etmək</li>
          <li>Məlumat toplamaq üçün avtomatlaşdırılmış vasitələrdən istifadə etmək</li>
          <li>Başqalarını təqlid etmək və ya saxta məlumat vermək</li>
        </ul>

        <h2>3. Məhsul məlumatı</h2>
        <p>
          Məhsul təsvirləri, şəkillər və qiymət məlumatlarının dəqiq olmasına çalışırıq. Lakin məzmunun
          səhvsiz, tam və ya aktual olmasına zəmanət vermirik. Səhvləri düzəltmək və məlumatları xəbərdarlıq
          etmədən yeniləmək hüququmuz var.
        </p>

        <h2>4. Qiymət və mövcudluq</h2>
        <p>
          Bütün qiymətlər AZN ilə göstərilir və xəbərdarlıq etmədən dəyişdirilə bilər. Miqdar limitlərini
          tətbiq etmək və məhsulu satışdan çıxarmaq hüququmuz var. Qiymət xətası olduqda sifarişi emal etməzdən
          əvvəl sizinlə əlaqə saxlayacağıq.
        </p>

        <h2>5. Sifariş və ödəniş</h2>
        <p>
          Sifariş verməklə hüquqi müqavilə bağlamaq səlahiyyətinizin olduğunu təsdiq edirsiniz. Bütün sifarişlər
          qəbul və mövcudluq şərtinə tabedir. Təhlükəsiz onlayn ödəniş üsullarını qəbul edirik.
        </p>

        <h2>6. Çatdırılma</h2>
        <p>
          Çatdırılma müddətləri təxminidir və zəmanət verilmir. Daşıyıcıya təhvil verildikdən sonra risk sizə keçir.
          Daşıyıcıların gecikmələrinə və nəzarətimizdən kənar hallara görə məsuliyyət daşımırıq.
        </p>

        <h2>7. Qaytarma və geri ödəniş</h2>
        <p>
          Əksər məhsullar üçün 30 gün ərzində istifadə olunmamış və yenidən satıla bilən vəziyyətdə qaytarma qəbul edilir.
          Orijinal qablaşdırma və aksesuarlar daxil olmalıdır. Qaytarmadan sonra 5–10 iş günü ərzində eyni ödəniş üsuluna
          geri ödəniş edilir.
        </p>
        <p>Qaytarılmayan məhsullara daxildir:</p>
        <ul>
          <li>Quraşdırılmış və ya istifadə olunmuş hissələr</li>
          <li>Quraşdırılmış elektrik komponentləri</li>
          <li>Mayelər və kimyəvi məhsullar</li>
          <li>Xüsusi sifarişlə hazırlanmış hissələr</li>
        </ul>

        <h2>8. Zəmanət</h2>
        <p>
          Hissələr istehsalçı zəmanəti ilə təmin olunur. Zəmanət şərtləri məhsul və istehsalçıdan asılıdır.
          Hissənin sıradan çıxması və ya quraşdırma nəticəsində yaranan dolayı zərərlərə görə məsuliyyət daşımırıq.
        </p>

        <h2>9. Məsuliyyətin məhdudlaşdırılması</h2>
        <p>
          Qanunla icazə verilən maksimum həddə CarParts, vebsaytdan istifadə və ya məhsul alışı nəticəsində yaranan
          dolayı, təsadüfi, xüsusi və ya ardıcıl zərərlərə görə məsuliyyət daşımır.
        </p>

        <h2>10. Əqli mülkiyyət</h2>
        <p>
          Bu vebsaytdakı bütün məzmun (mətn, qrafika, loqo, şəkillər və proqram təminatı daxil olmaqla) CarParts
          və ya lisenziya sahiblərinə məxsusdur və müəlliflik və ticarət nişanı qanunları ilə qorunur.
        </p>

        <h2>11. Şərtlərə dəyişikliklər</h2>
        <p>
          Bu şərtləri istənilən vaxt dəyişdirmək hüququna malikik. Dəyişiklikdən sonra vebsaytdan istifadəni davam
          etməyiniz yenilənmiş şərtlərin qəbul edilməsi deməkdir.
        </p>

        <h2>12. Tətbiq olunan hüquq</h2>
        <p>
          Bu şərtlər Azərbaycan Respublikasının qanunvericiliyi ilə tənzimlənir.
        </p>

        <h2>13. Əlaqə məlumatı</h2>
        <p>
          Şərtlər və qaydalarla bağlı suallarınız üçün bizimlə əlaqə saxlayın:
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
