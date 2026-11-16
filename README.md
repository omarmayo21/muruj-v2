# موقع كمبوند مروج سموحة — Landing Page لجمع العملاء (Lead Gen)

موقع عربي (RTL) من 4 صفحات مع خيار إنجليزي، مبني بـ **Vite + React + TypeScript + Tailwind**، وجاهز للنشر على **Vercel** ولحملات **Google Ads**.
كل عميل يسجّل في الفورم يُرسل في نفس اللحظة إلى **الإيميل** وإلى **Google Sheet**.

| الصفحة | المسار | المحتوى |
|---|---|---|
| الرئيسية | `/` | Hero + الفورم + عن المشروع + الوحدات + الخدمات + الموقع + أنظمة السداد + الأسئلة + CTA أخير |
| الوحدات | `/units` | المشاريع الفرعية، المساقط، الفيلات V1–V4، نماذج أسعار معلنة + فورم |
| الصور | `/gallery` | معرض صور مع Lightbox، المخطط العام، الخدمات، الموقع + فورم |
| الشكر | `/thank-you` | رسالة الشكر + إطلاق تحويل Google Ads (noindex) |

بالإضافة إلى **`/privacy`** (سياسة الخصوصية): رابطها في الفوتر وتحت زر الإرسال فقط، وليست في القائمة الرئيسية. وأي رابط غير موجود يُحوَّل إلى الرئيسية.

> 📋 **قبل الإطلاق:** راجع **[`PRE_LAUNCH_CHECKLIST.md`](./PRE_LAUNCH_CHECKLIST.md)** بنداً بنداً.

---

## 1) أول خطوة: عدّل بياناتك (إلزامي)

افتح **`src/config/site.ts`** وغيّر:

```ts
siteUrl: 'https://your-domain.com',   // الدومين الفعلي (للـ SEO و sitemap)
phone: '+201xxxxxxxxx',               // رقم الاتصال
phoneDisplay: '01x xxxx xxxx',        // الرقم كما يظهر للزائر
whatsapp: '201xxxxxxxxx',             // رقم الواتساب بدون + وبدون مسافات
```

- خيارات قائمة "الوحدة / المساحة" في الفورم موجودة في **`site.ts` ← `unitOptions`** (5 خيارات مبنية على البيانات فقط؛ لا توجد وحدات غرفة واحدة أو ستوديو في أي مصدر).
- رسالة واتساب الجاهزة: `whatsappMessage` في نفس الملف.
- بريد التواصل (اختياري) `email`: يظهر في صفحة الخصوصية لطلبات حذف البيانات.
- محتوى المشروع (نصوص، أسعار، خدمات، أسئلة) موجود في **`src/data/project.ts`**.
- لإخفاء كل الأسعار: `showPrices: false` في `site.ts`.

## 2) التشغيل محلياً

### إنشاء ملف `.env`
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
```
املأ القيم داخل `.env` (الجدول في القسم 4). الملف **مستبعد من Git** عبر `.gitignore` (وكذلك `.env.local` و `.env.*`)، فلا يُرفع أبداً. **لا تضع أي سر في `.env.example`.**

### تشغيل الواجهة + الـ API معاً
```bash
# Terminal 1 — الـ API المحلي (يقرأ .env) + نسخة الـ build على http://localhost:3000
npm run build && npm run api:local

# Terminal 2 — الواجهة مع Hot Reload على http://localhost:5173
npm run dev               # طلبات /api تُحوَّل تلقائياً (proxy) إلى :3000
```
بدائل: `npx vercel dev` (الطريقة الرسمية، يحتاج حساب Vercel) أو `npm run serve:local` (build + سيرفر واحد على :3000).

### اختبار إرسال عميل تجريبي
```bash
npm run test:lead                                  # يختبر http://localhost:3000
node scripts/test-lead.mjs https://your-domain.com # أو أي دومين منشور
```
يطبع حالة كل قناة دون أي أسرار، مثل:
```
1) /api/health
   smtpReady:         true
   googleSheetsReady: true
2) POST /api/lead → HTTP 200 in 73 ms — success: true
   ✅ email : ok (45 ms)
   ❌ sheets: failed — reason: sheet_permission_denied
```
أسباب الفشل الممكنة: `smtp_auth_failed` (App Password خطأ) · `invalid_private_key` · `sheet_permission_denied` (لم تشارك الشيت مع الـ Service Account) · `sheet_not_found` · `timeout` · `not_configured`.
العميل التجريبي يُرسل بعلامة `test: true` ومصدره `test_script`، فاحذف الصف من الشيت بعد الاختبار.

### أوامر أخرى
| الأمر | الوظيفة |
|---|---|
| `npm run build` | فحص TypeScript (الواجهة + السكربتات + الـ API) ثم build |
| `npm run typecheck` | فحص الأنواع فقط |
| `npm run test:e2e` | 31 اختبار Playwright (التحويل، الصفحات، الموبايل، الفورم، حماية الـ API). أول مرة: `npx playwright install chromium` |
| `npm run preview` | معاينة الـ build على :4173 (بدون API) |
| `npm run images` | إعادة معالجة الصور (يحتاج Python + Pillow) |

## 3) النشر على Vercel

1. ارفع المشروع على GitHub.
2. من [vercel.com/new](https://vercel.com/new) اختر الـ repo. سيتعرف تلقائياً على **Vite** (Build: `npm run build` · Output: `dist`).
3. من **Settings → Environment Variables** أضف كل المتغيرات (الجدول بالأسفل) لبيئة **Production** و **Preview**.
4. اضغط **Deploy**. **مهم:** أي تعديل على متغيرات `VITE_*` يحتاج **Redeploy** لأنها تدخل في الـ build.
5. بعد النشر افتح `https://your-domain.com/api/health`، ويجب أن يظهر `"smtpReady": true` و `"googleSheetsReady": true`. هذا المسار لا يرسل أي شيء، ويعرض فقط هل المتغيرات موجودة (true/false) دون إظهار قيمها.
6. شغّل `node scripts/test-lead.mjs https://your-domain.com` وتأكد من وصول الإيميل والصف.

> ملف `vercel.json` يحتوي على: `cleanUrls` (كل صفحة لها HTML خاص بعنوانها ووصفها للـ SEO)، و SPA rewrite لا يشمل `/api`، و `noindex` لصفحة الشكر، وكاش طويل للصور والخطوط، و `maxDuration: 12` ثانية لـ `/api/lead`.

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

🔒 المتغيرات بدون `VITE_` **لا تصل للمتصفح أبداً**؛ تُقرأ فقط داخل `/api`. أي تاج يكون متغيره فارغاً **لا يُحمّل أصلاً**.

## 5) إعداد Gmail App Password (للإيميل)

1. ادخل على حساب Google ← **Security**، وفعّل **2-Step Verification**.
2. افتح [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. أنشئ App باسم `Muruj Site` وانسخ الكود المكون من 16 حرفاً.
4. ضعه في `SMTP_PASS`. المسافات تُحذف تلقائياً.

> Gmail المجاني يرسل حوالي 500 إيميل يومياً، وهذا كافٍ جداً لحملة Leads.

## 6) إعداد Google Sheets (Service Account)

1. افتح [console.cloud.google.com](https://console.cloud.google.com) ← أنشئ Project جديد.
2. **APIs & Services → Library** ← ابحث عن **Google Sheets API** ← **Enable**.
3. **IAM & Admin → Service Accounts → Create Service Account**. اكتب أي اسم وتجاهل الصلاحيات واضغط Done.
4. افتح الـ Service Account ← **Keys → Add Key → Create new key → JSON**. سيتم تنزيل ملف.
5. من الملف انسخ:
   - `client_email` ← `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` ← `GOOGLE_PRIVATE_KEY`، **كما هو بالـ `\n`**؛ الكود يحولها لأسطر حقيقية تلقائياً. في Vercel الصقه كما هو، سواء بالأسطر أو بالـ `\n`.
6. أنشئ Google Sheet جديد. الـ ID هو الجزء بين `/d/` و `/edit` في الرابط ← `GOOGLE_SHEET_ID`.
7. **شارك الشيت** مع إيميل الـ Service Account بصلاحية **Editor**. بدون هذه الخطوة لن يعمل.
8. صف العناوين يُنشأ تلقائياً مع أول عميل:
   `Timestamp | Name | Phone | Email | Unit | Source | Medium | Campaign | Term | Content | GCLID | Page URL | Referrer | Device`
   (الوقت بتوقيت القاهرة، والإضافة تكون في أول ورقة في الملف.)

### كيف يعمل الإرسال؟
- `POST /api/lead` يتحقق من البيانات بـ **zod** ← فحص **honeypot** ← **Rate limit** (5 طلبات لكل IP كل 10 دقائق).
- الإرسال للإيميل والشيت **بالتوازي** (`Promise.allSettled`).
- النجاح يتحقق إذا نجحت **قناة واحدة على الأقل**. لو فشلت القناتان، تُكتب بيانات العميل في **Vercel Logs** حتى لا يضيع.

## 7) Google Ads — التحويل (Conversion)

1. Google Ads ← **Goals → Conversions → New conversion action → Website** ← أدخل الدومين ← **Add a conversion action manually**.
2. Category: **Submit lead form**، Value: `1 EGP`، Count: **One**.
3. اختر **Use Google tag** ← **Install the tag yourself** ← ستجد:
   `send_to: 'AW-123456789/AbCdEfGhIjk'`
   - `AW-123456789` ← `VITE_GOOGLE_ADS_ID` و `VITE_GOOGLE_ADS_CONVERSION_ID`
   - `AbCdEfGhIjk` ← `VITE_GOOGLE_ADS_CONVERSION_LABEL`
4. (اختياري) فعّل **Enhanced conversions** من إعدادات التحويل. الموقع يرسل الإيميل والهاتف **مُشفّرين SHA-256**.

**متى يُطلق التحويل؟** فقط في `/thank-you` **بعد إرسال حقيقي ناجح**:
- عند نجاح الـ API يُحفظ flag في `sessionStorage` يحتوي `transaction_id` فريداً لهذا الطلب، وهو نفسه `lead_id` المرسل للإيميل والشيت.
- صفحة الشكر تطلق التحويل **مرة واحدة** وتحذف الـ flag فوراً، وتسجّل الـ `transaction_id` في `localStorage` (`muruj_fired_tids`) كحماية إضافية.
- فتح `/thank-you` مباشرةً أو عمل Refresh أو Back **لا يطلق أي تحويل**. هذا مُختبَر آلياً في `tests/conversion.spec.ts`.
- `transaction_id` يمنع Google Ads أيضاً من احتساب نفس الطلب مرتين.

**Enhanced Conversions:** الهاتف (بصيغة E.164 مثل `+2010…`) والإيميل (بأحرف صغيرة وبدون مسافات) يُشفَّران **SHA-256 داخل المتصفح** (`crypto.subtle`) ويُرسلان كـ `user_data` مع التحويل. لا تُرسل أي بيانات غير مشفرة لجوجل. لو المتصفح لا يدعم التشفير يُتجاوز ذلك بصمت.

**Consent Mode v2:** الكود يضبط `gtag('consent','default', …)` قبل أي تاج. القيم حالياً `granted` (`CONSENT_DEFAULTS` في `src/lib/analytics.ts`) فلا يتعطل التتبع. لإضافة بانر موافقة لاحقاً غيّر القيم إلى `denied` واستدعِ `updateConsent({...})` عند موافقة الزائر، دون أي تعديل آخر.

الأحداث المرسلة:

| الحدث | متى |
|---|---|
| `page_view` | كل تغيير صفحة |
| `cta_click` | أي زر "احجز الآن" |
| `form_start` | أول تفاعل مع الفورم |
| `form_submit_attempt` | الضغط على إرسال |
| `form_submit_success` | نجاح الـ API |
| `generate_lead` (GA4) + `conversion` (Ads) + `lead_conversion` (dataLayer) | صفحة الشكر فقط |
| `click_whatsapp` / `click_call` | أزرار التواصل |

لو تستخدم GTM: أنشئ Trigger من نوع **Custom Event** باسم `lead_conversion`.

### بيانات التتبع المحفوظة مع كل عميل
تُحفظ `utm_source / utm_medium / utm_campaign / utm_term / utm_content` و `gclid / gbraid / wbraid` من **أول زيارة** (localStorage لمدة 30 يوماً + sessionStorage، وتتحدث عند وصول gclid جديد)، ومعها: رابط الصفحة، الـ Referrer، صفحة الهبوط، نوع الجهاز، مكان الفورم، ووقت القاهرة.

## 8) الاختبار

0. **آلياً:** `npm run test:lead` (الـ API) و `npm run test:e2e` (التحويل + الصفحات).
1. **API:** افتح `/api/health`، ثم سجّل نفسك من الموقع بالرابط
   `https://your-domain.com/?utm_source=test&utm_medium=cpc&utm_campaign=test&gclid=TEST123`
   وتأكد من وصول الإيميل وظهور الصف في الشيت بالـ UTM والـ GCLID.
2. **Google Tag Assistant:** افتح [tagassistant.google.com](https://tagassistant.google.com) ← Add domain ← سجّل عميلاً ← في صفحة الشكر يجب أن ترى **Conversion** مرة واحدة.
3. **GA4 DebugView:** GA4 ← Admin ← **DebugView** (مع Tag Assistant مفتوح) ← تأكد من ظهور `generate_lead`.
4. **Google Ads:** حالة التحويل تتحول من *Unverified* إلى *Recording conversions* خلال ساعات من أول تحويل حقيقي.
5. Refresh صفحة الشكر يجب ألا يطلق تحويلاً جديداً.

## 9) هيكل المشروع

```
api/
  lead.ts            ← استقبال العميل (POST) — zod + تنظيف HTML + honeypot + rate limit + إيميل + شيت (بمهلة 8 ث لكل قناة)
  health.ts          ← smtpReady / googleSheetsReady (true/false فقط، لا يرسل شيئاً)
  _lib/              ← email, sheets (حماية من معادلات الشيت), schema, channels, env, rateLimit, time
src/
  config/site.ts     ← ⭐ الهاتف/الواتساب/الدومين/خيارات الوحدات
  config/seo.ts      ← عنوان ووصف كل صفحة (تُستخدم في الصفحات وفي ملفات HTML المولّدة)
  data/project.ts    ← كل محتوى المشروع (عربي + إنجليزي)
  components/        ← Header, Hero, LeadForm, PhoneField, Lightbox, ...
  pages/             ← Home, Units, Gallery, ThankYou, Privacy
  lib/               ← analytics, attribution, head (SEO), hash
public/images/       ← كل الصور WebP محلياً (بدون hotlinking)
scripts/             ← test-lead.mjs + local-server.mjs + معالجة الصور
tests/               ← اختبارات Playwright (conversion / site / api)
PRE_LAUNCH_CHECKLIST.md ← قائمة ما قبل الإطلاق
DATA_CONFLICTS.md    ← تعارضات البيانات بين المصادر وما تم اعتماده
MISSING_DATA.md      ← بيانات غير متوفرة في المصادر
```

## 10) مصادر البيانات

- alforat.com.eg — موقع المطور (الأولوية عند التعارض) + البروشور الرسمي
- solvahomes.com · broker.com.eg · smouha.org

تمت إزالة أسماء وأرقام هواتف وشعارات الوسطاء من النصوص والصور. الأسعار المعروضة **استرشادية** ومنسوبة لمصدرها، ويظهر في الفوتر تنويه: "الصور والمعلومات استرشادية وقابلة للتغيير".

### ⚠️ حقوق استخدام الصور
الصور مأخوذة من موقع المطور وبروشوره ومن مواقع وسطاء عقاريين، وتمت معالجتها وإزالة شعارات الوسطاء منها. **يجب على مالك الموقع التأكد من حقه في استخدام هذه الصور تجارياً** (موافقة المطور أو الوكالة) قبل الإطلاق وتشغيل الإعلانات، أو استبدالها بصور مرخصة. يمكن استبدال أي صورة بنفس الاسم في `public/images/` ثم تشغيل `npm run images`.

## 11) قبل الإطلاق (مختصر)

القائمة الكاملة بخانات اختيار في **[`PRE_LAUNCH_CHECKLIST.md`](./PRE_LAUNCH_CHECKLIST.md)**. أهم البنود:

1. **`src/config/site.ts`**: الهاتف والواتساب الحقيقيان + `siteUrl` بالدومين الفعلي (في وضع التطوير `npm run dev` يظهر تحذير في الكونسول ما دام الرقم placeholder).
2. **Vercel → Environment Variables**: كل المتغيرات، وخاصة `SMTP_PASS` و `GOOGLE_*` و `VITE_*`، ثم **Redeploy**.
3. `/api/health` يعرض `true` للقناتين ← `node scripts/test-lead.mjs https://your-domain.com` ينجح في القناتين.
4. عميل حقيقي من الموبايل ← وصل الإيميل + الصف في الشيت + ظهر التحويل في Tag Assistant **مرة واحدة**.
5. تأكيد حقوق الصور + مراجعة الأسعار المعروضة (أو `showPrices: false`).
6. Google Search Console: أضف الدومين وارفع `sitemap.xml`.

## 12) تشغيل حملة Google Ads (Checklist)

- [ ] Conversion action من نوع **Submit lead form**، Count = **One**، والقيمة 1 EGP (أو قيمتك).
- [ ] `VITE_GOOGLE_ADS_ID` + `VITE_GOOGLE_ADS_CONVERSION_ID` + `VITE_GOOGLE_ADS_CONVERSION_LABEL` في Vercel + Redeploy.
- [ ] تفعيل **Enhanced conversions for leads** ← طريقة **Google tag** (الموقع يرسل `user_data` مشفراً).
- [ ] ربط **GA4 ↔ Google Ads** وتفعيل **Auto-tagging** (ليصل `gclid`).
- [ ] اختبار بـ **Tag Assistant**: التحويل يظهر مرة واحدة في `/thank-you`، ولا يظهر عند Refresh.
- [ ] رابط الإعلان النهائي: `https://your-domain.com/` (أو `/units`)، مع UTM اختيارية مثل `?utm_source=google&utm_medium=cpc&utm_campaign=muruj`.
- [ ] نص الإعلان **بدون** خصومات أو "عرض لفترة محدودة" أو ضمانات غير موثقة (سياسات Google للعقارات + نفس سياسة محتوى الموقع).
- [ ] الاستهداف: الإسكندرية والمحافظات المستهدفة؛ مع كلمات سلبية مثل "إيجار" و"وظائف" إن لم تكن مستهدفة.
- [ ] إضافة **Call asset** و **Lead form asset** (اختياري) بنفس رقم `site.ts`.
- [ ] بعد 24–48 ساعة: حالة التحويل **Recording conversions** ← وراجع الشيت يومياً وطابقه مع عدد التحويلات.
