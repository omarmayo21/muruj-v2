# موقع كمبوند مروج سموحة — Landing Page لجمع العملاء (Lead Gen)

موقع عربي (RTL) مع خيار إنجليزي، مبني بـ **Vite + React + TypeScript + Tailwind**، وجاهز للنشر على **Vercel** ولحملات **Google Ads**.
كل عميل يسجّل في الفورم يُرسل في نفس اللحظة إلى **الإيميل** وإلى **Google Sheet**.

## هيكل الصفحات والقائمة الرئيسية

**القائمة الرئيسية (Header):**
`الرئيسية (/) | الوحدات (/units) | المعرض (/gallery) | سجّل الآن (/register) | اتصل بنا (/contact)`
(عنصر **"سجّل الآن"** مُصمّم كزر CTA).

| الصفحة | المسار | المحتوى |
|---|---|---|
| الرئيسية | `/` | Hero + الفورم + عن المشروع + الوحدات (من 88 م² حتى 479 م²) + الخدمات + الموقع + أنظمة السداد + الأسئلة + CTA أخير |
| الوحدات | `/units` | فلتر الوحدات (الكل / مساحات صغيرة / غرفتين / 3 غرف / شقق ودوبلكس / فيلات وإداري)، المشاريع الفرعية، المساقط، الفيلات V1–V4 + فورم |
| المعرض | `/gallery` | معرض صور مع Lightbox، المخطط العام، الخدمات، الموقع + فورم |
| سجّل الآن | `/register` | صفحة تسجيل مخصصة: Hero مختصر + نقاط مميزات المشروع + صورتان + نفس مكوّن `LeadForm` (`source_page=register`) + ملخص المشروع |
| اتصل بنا | `/contact` | بطاقات التواصل (هاتف، واتساب، بريد، مواعيد العمل، العنوان) + خريطة الموقع + فورم التواصل مع حقل "الرسالة" الاختياري (`source_page=contact`) |
| الشكر | `/thank-you` | رسالة الشكر + إطلاق تحويل Google Ads مرة واحدة فقط بعد إرسال ناجح (`noindex`، غير موجودة في أي قائمة) |
| الخصوصية | `/privacy` | سياسة الخصوصية (رابطها في الفوتر وتحت زر الإرسال فقط) |

أي رابط غير موجود (404) يُحوَّل تلقائياً إلى الصفحة الرئيسية `/`.

> 📋 **قبل الإطلاق:** راجع **[`PRE_LAUNCH_CHECKLIST.md`](./PRE_LAUNCH_CHECKLIST.md)** بنداً بنداً.

---

## 1) أول خطوة: عدّل بياناتك (إلزامي)

افتح **`src/config/site.ts`** وغيّر:

```ts
siteUrl: 'https://your-domain.com',   // الدومين الفعلي (للـ SEO و sitemap)
phone: '+201xxxxxxxxx',               // رقم الاتصال
phoneDisplay: '01x xxxx xxxx',        // الرقم كما يظهر للزائر
whatsapp: '201xxxxxxxxx',             // رقم الواتساب بدون + وبدون مسافات
email: 'info@your-domain.com',        // البريد الإلكتروني للتواصل
workingHours: { ar: '...', en: '...' } // مواعيد العمل في صفحة اتصل بنا
```

- المساحات في المشروع تبدأ **من 88 م² حتى 479 م²** (بداية المساحات من 88 م² مؤكدة من المالك).
- خيارات قائمة "الوحدة / المساحة" في الفورم موجودة في **`site.ts` ← `unitOptions`** وتبدأ بالخيار `شقة (تبدأ من 88 م²)` في مدخل واحد سهل التعديل (`FIRST_UNIT_OPTION`).
- محتوى المشروع (نصوص، مساحات، خدمات، أسئلة) موجود في **`src/data/project.ts`** (خالي تماماً من أي أرقام مالية).

## 2) التشغيل محلياً

### إنشاء ملف `.env` أو سحبه من Vercel
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# أو إذا ربطت المشروع بـ Vercel يمكنك سحب المتغيرات مباشرة:
npx vercel link
npx vercel env pull .env
```
املأ القيم داخل `.env` (الجدول في القسم 4). الملف **مستبعد من Git** عبر `.gitignore`. **لا تضع أي سر في `.env.example`.**

### تشغيل الواجهة + الـ API معاً
```bash
# Terminal 1 — الـ API المحلي (يقرأ .env) + نسخة الـ build على http://localhost:3000
npm run build && npm run api:local

# Terminal 2 — الواجهة مع Hot Reload على http://localhost:5173
npm run dev               # طلبات /api تُحوَّل تلقائياً (proxy) إلى :3000
```

### اختبار إرسال عميل تجريبي
```bash
npm run test:lead                                  # يختبر http://localhost:3000
node scripts/test-lead.mjs https://your-domain.com # أو أي دومين منشور
```

### أوامر أخرى
| الأمر | الوظيفة |
|---|---|
| `npm run build` | فحص TypeScript (الواجهة + السكربتات + الـ API) ثم build |
| `npm run typecheck` | فحص الأنواع فقط |
| `npm run test:e2e` | اختبارات Playwright الشاملة (التحويل، الصفحات، `/register`، `/contact`، الفورم، حماية الـ API) |
| `npm run preview` | معاينة الـ build على :4173 |

## 3) النشر على Vercel

1. ارفع المشروع على GitHub.
2. من [vercel.com/new](https://vercel.com/new) اختر الـ repo. سيتعرف تلقائياً على **Vite** (Build: `npm run build` · Output: `dist`).
3. من **Settings → Environment Variables** أضف كل المتغيرات لبيئة **Production** و **Preview**.
4. اضغط **Deploy**. أي تعديل على متغيرات `VITE_*` يحتاج **Redeploy**.
5. بعد النشر افتح `https://your-domain.com/api/health`، وتأكد من جاهزية القنوات.

## 4) متغيرات البيئة

| المتغير | الوصف | مكان الاستخدام |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | السيرفر فقط |
| `SMTP_PORT` | `587` | السيرفر فقط |
| `SMTP_USER` | إيميل Gmail المُرسِل | السيرفر فقط |
| `SMTP_PASS` | **App Password** (ليس باسورد الإيميل) | السيرفر فقط |
| `EMAIL_FROM` | المرسل | السيرفر فقط |
| `EMAIL_TO` | من يستقبل العملاء (يمكن أكثر من إيميل مفصولة بفاصلة) | السيرفر فقط |
| `GOOGLE_SHEET_ID` | ID الشيت | السيرفر فقط |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | إيميل الـ Service Account | السيرفر فقط |
| `GOOGLE_PRIVATE_KEY` | المفتاح الخاص من ملف JSON | السيرفر فقط |
| `VITE_GA_MEASUREMENT_ID` | `G-XXXXXXX` | الواجهة |
| `VITE_GTM_ID` | `GTM-XXXXXXX` (اختياري) | الواجهة |
| `VITE_GOOGLE_ADS_ID` | `AW-XXXXXXXXX` | الواجهة |
| `VITE_GOOGLE_ADS_CONVERSION_ID` | `AW-XXXXXXXXX` | الواجهة |
| `VITE_GOOGLE_ADS_CONVERSION_LABEL` | مثل `AbCdEfGhIjk` | الواجهة |

## 5) إعداد Google Sheets (16 عموداً)

صف العناوين يُنشأ تلقائياً (وإذا وُجدت ترويسة قديمة من 14 عموداً يتم تحديثها تلقائياً بأمان دون حذف أي صفوف):
`Timestamp | Name | Phone | Email | Unit | Message | Source Page | Source | Medium | Campaign | Term | Content | GCLID | Page URL | Referrer | Device`

## 6) Google Ads — التحويل (Conversion)

- يُطلق التحويل **فقط في `/thank-you`** بعد إرسال حقيقي ناجح من أي صفحة (`/`, `/units`, `/gallery`, `/register`, `/contact`).
- فتح `/thank-you` مباشرةً أو عمل Refresh أو Back **لا يطلق أي تحويل**.
- الهاتف والإيميل يُشفَّران **SHA-256 داخل المتصفح** لدعم Enhanced Conversions.
- النقر على أزرار الاتصال والواتساب يسجل أحداث `click_call` و `click_whatsapp`.
