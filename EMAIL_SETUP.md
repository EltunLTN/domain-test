# Email Konfiqurasiyası - Resend Setup

## ✅ Edilən Dəyişikliklər

### 1. **Kontakt Səhifəsi Yeniləndi** (`src/app/contact/page.tsx`)
   - ✅ Telefon nömrəsi: **+994 99 999 99 99**
   - ✅ Ünvan kartı **silindi**
   - ✅ Yalnız Email və Telefon göstərilir

### 2. **Giriş Tələbi Silindi** (`src/middleware.ts`)
   - ✅ Adi istifadəçilər üçün giriş tələb edilmir
   - ✅ Yalnız adminlər `/admin` panel üçün giriş etməlidir
   - ✅ Hər kəs saytı sərbəst gəzə bilər

### 3. **Email Göndərmə Əlavə Edildi** (`src/app/api/contact/route.ts`)
   - ✅ Resend email servisi inteqrasiya edildi
   - ✅ Mesajlar **eltunjalilli@gmail.com** ünvanına göndərilir
   - ✅ Database-də də saxlanılır (əlavə təhlükəsizlik)

---

## 🔧 SİZİN ETMƏLI OLDUĞUNUZ KONFIQURASIYALAR

### Addım 1: Resend Hesabı Yaradın

1. **[resend.com](https://resend.com)** saytına daxil olun
2. **Sign Up** düyməsini basın
3. GitHub və ya Google ilə qeydiyyatdan keçin (pulsuz)

### Addım 2: API Key Alın

1. Resend dashboard-a daxil olun
2. Sol menudən **API Keys** seçin
3. **Create API Key** düyməsini basın
4. Adını yazın (məsələn: "CarParts Production")
5. API key-i kopyalayın (yalnız bir dəfə göstərilir!)

### Addım 3: Local Environment-ə Əlavə Edin

`.env.local` faylınızı açın və əlavə edin:

\`\`\`env
# Email Configuration (Resend)
RESEND_API_KEY=re_123456789_your_actual_api_key_here
\`\`\`

**⚠️ Əhəmiyyətli:** API key-i heç vaxt GitHub-a push etməyin!

### Addım 4: Vercel-də Konfiqurasiya Edin

1. [vercel.com](https://vercel.com) → Layihənizi seçin
2. **Settings** → **Environment Variables**
3. Yeni environment variable əlavə edin:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_123456789_your_actual_api_key_here`
   - **Environment:** Production, Preview, Development (hər üçünü seçin)
4. **Save** düyməsini basın
5. **Redeploy** edin (yeni deployment yaradın)

---

## 📧 Email Domain Konfiqurasiyası (İxtiyari amma tövsiyə olunur)

### Default (Hazırda işləyir)
- **From:** `onboarding@resend.dev`
- ⚠️ Bu test üçün işləyir, amma professional görünmür

### Öz Domeninizi Əlavə Edin (Professional)

1. Resend dashboard → **Domains** → **Add Domain**
2. Öz domeninizi əlavə edin (məsələn: `carparts.az`)
3. DNS records-u kopyalayın
4. Domen providerinizə (Namecheap, GoDaddy, etc.) daxil olun
5. DNS settings-ə records əlavə edin:
   - TXT record
   - CNAME record
   - SPF record
6. Verification gözləyin (5-30 dəqiqə)

Domain verify olunduqdan sonra, kodu yeniləyin:

\`\`\`typescript
// src/app/api/contact/route.ts
from: 'CarParts <noreply@carparts.az>', // Öz domeniniz
\`\`\`

---

## 🧪 Test Edin

### Local Test

\`\`\`bash
pnpm dev
\`\`\`

1. `http://localhost:3000/contact` səhifəsinə gedin
2. Formu doldurun
3. "Göndər" düyməsini basın
4. **eltunjalilli@gmail.com** emailinizi yoxlayın

### Production Test (Deploy-dan sonra)

1. Live saytınıza gedin → Contact səhifəsi
2. Formu doldurun və göndərin
3. Emailinizi yoxlayın

---

## 📋 Email Formatı

Sizə gələcək email belə görünəcək:

**Subject:** Yeni mesaj - [İstifadəçinin adı]

**Content:**
```
━━━━━━━━━━━━━━━━━━━━━━
Yeni Əlaqə Mesajı
━━━━━━━━━━━━━━━━━━━━━━

📋 MƏLUMATLAR:
─────────────
Ad: Əli Məmmədov
Email: ali@example.com
Telefon: +994 50 123 45 67
Mövzu: Avtomobil hissələri haqqında

💬 MESAJ:
─────────────
Salam, BMW üçün hissələr var?
...

─────────────
Bu mesaj CarParts saytının əlaqə formasından göndərilib.
Cavab vermək üçün: ali@example.com
```

---

## ❓ Tez-Tez Verilən Suallar

### Resend pulsuzmu?
✅ **Bəli!** 3,000 email/ay pulsuz (sizin üçün kifayətdir)

### Email göndərilmirsə nə etməli?
1. `.env.local` faylında `RESEND_API_KEY` düzgün olduğunu yoxlayın
2. Vercel environment variables-da key-i yenidən yoxlayın
3. Redeploy edin
4. Resend dashboard-da "Logs" bölməsini yoxlayın

### Daha çox email lazım olarsa?
- **$20/ay:** 50,000 email
- **$80/ay:** 100,000 email

### Başqa email servisi istifadə edə bilərəmmi?
Bəli, bu alternativləri də işlədə bilərsiniz:
- **SendGrid** (100 email/gün pulsuz)
- **Mailgun** (5,000 email/ay pulsuz)
- **Nodemailer + Gmail** (gündə 500 email)

---

## ✅ Checklist

- [ ] Resend.com-da hesab yaratdım
- [ ] API key aldım
- [ ] `.env.local` faylına əlavə etdim
- [ ] Local test etdim (işləyir)
- [ ] Vercel-də environment variable əlavə etdim
- [ ] Vercel-də redeploy etdim
- [ ] Production-da test etdim (işləyir)
- [ ] (İxtiyari) Öz domenimi əlavə etdim

---

## 🚀 Hazırsınız!

Artıq:
- ✅ Adi istifadəçilər giriş etmədən saytı gəzə bilər
- ✅ Kontakt formu mesajları **eltunjalilli@gmail.com** ünvanına göndərilir
- ✅ Telefon nömrəsi: **+994 99 999 99 99**
- ✅ Ünvan göstərilmir (silindi)

**Hər şey hazırdır! Yalnız Resend API key-i əlavə etməlisiniz.** 🎉
