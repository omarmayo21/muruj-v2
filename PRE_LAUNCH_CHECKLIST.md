# ✅ قائمة ما قبل الإطلاق — كمبوند مروج سموحة

> علّم كل بند بعد التأكد منه بنفسك على **الدومين النهائي** (وليس محلياً فقط).
> الأوامر المذكورة موضحة بالتفصيل في `README.md`.

## 1) بيانات يجب إدخالها (لا يعمل الموقع بشكل صحيح بدونها)

- [ ] `src/config/site.ts` ← `phone` و `phoneDisplay`: رقم الاتصال الحقيقي (بدل `+20XXXXXXXXXX`)
- [ ] `src/config/site.ts` ← `whatsapp`: رقم الواتساب بدون `+` (مثل `2010xxxxxxxx`)
- [ ] `src/config/site.ts` ← `siteUrl`: الدومين النهائي (يؤثر على canonical و OG و sitemap و JSON-LD)
- [ ] `src/config/site.ts` ← `email` (اختياري): بريد يظهر في صفحة الخصوصية لطلبات حذف البيانات
- [ ] مراجعة `MISSING_DATA.md` و `DATA_CONFLICTS.md` (خاصة نموذج 106 م² "ڤي سيبا 37" وأسعار الوحدات المعروضة)
- [ ] قرار عرض الأسعار: إبقاؤها كنماذج معلنة أو `showPrices: false`

## 2) متغيرات البيئة في Vercel (Production + Preview)

- [ ] `SMTP_HOST` · `SMTP_PORT` · `SMTP_USER` · `EMAIL_FROM` · `EMAIL_TO`
- [ ] `SMTP_PASS` ← **Gmail App Password** (16 حرفاً، يحتاج تفعيل التحقق بخطوتين)
- [ ] `GOOGLE_SHEET_ID` · `GOOGLE_SERVICE_ACCOUNT_EMAIL` · `GOOGLE_PRIVATE_KEY`
- [ ] الشيت **مُشارك** مع إيميل الـ Service Account بصلاحية **Editor**
- [ ] `VITE_GA_MEASUREMENT_ID` (و/أو `VITE_GTM_ID`)
- [ ] `VITE_GOOGLE_ADS_ID` · `VITE_GOOGLE_ADS_CONVERSION_ID` · `VITE_GOOGLE_ADS_CONVERSION_LABEL`
- [ ] **Redeploy** بعد إضافة/تعديل أي متغير `VITE_*`
- [ ] لا يوجد أي سر في الكود أو في `.env.example` (ملف `.env` مستبعد من Git)

## 3) اختبار الاستقبال (Lead delivery)

- [ ] `https://your-domain.com/api/health` ← `"smtpReady": true` و `"googleSheetsReady": true`
- [ ] `node scripts/test-lead.mjs https://your-domain.com` ← `✅ email : ok` و `✅ sheets: ok`
- [ ] الإيميل وصل بعنوان `عميل جديد - كمبوند مروج - …` و Reply-To = إيميل العميل
- [ ] الصف ظهر في الشيت (14 عموداً، بتوقيت القاهرة)، ثم احذف صف الاختبار
- [ ] عميل حقيقي من **موبايل** بالرابط `/?utm_source=test&utm_medium=cpc&utm_campaign=test&gclid=TEST123` ← الـ UTM والـ GCLID والوحدة ظاهرة في الإيميل والشيت
- [ ] تجربة الفشل: أدخل رقماً خاطئاً ← رسالة خطأ عربية واضحة

## 4) التتبع والتحويل

- [ ] **Tag Assistant**: GA4 + Google Ads يعملان على كل الصفحات
- [ ] تسجيل عميل ← في `/thank-you` يظهر **Conversion واحد** مع `transaction_id`
- [ ] **Refresh** لصفحة الشكر ← لا يظهر تحويل جديد
- [ ] فتح `/thank-you` مباشرة ← لا يظهر تحويل
- [ ] GA4 → DebugView ← حدث `generate_lead`
- [ ] Google Ads → Conversions ← الحالة تتحول إلى **Recording conversions** خلال 24–48 ساعة
- [ ] Enhanced conversions مُفعّلة في إعدادات التحويل (طريقة Google tag)
- [ ] (لو تستخدم GTM) Trigger من نوع Custom Event باسم `lead_conversion`

## 5) المحتوى والامتثال

- [ ] **حقوق الصور**: تأكيد حق الاستخدام التجاري لكل صور `public/images/` (موافقة المطور/الوكالة) أو استبدالها
- [ ] لا توجد أسماء/أرقام/شعارات وسطاء (solvahomes · broker.com.eg · smouha.org)
- [ ] لا خصومات أو "عرض محدود" أو ضمانات أو استعجال مضلل في الموقع **وفي نصوص الإعلانات**
- [ ] الفوتر يظهر: "الصور والمعلومات استرشادية وقابلة للتغيير" + "هذا الموقع تسويقي ولا يمثل الموقع الرسمي للمطور"
- [ ] صفحة `/privacy`: مراجعة النص وتاريخ التحديث وبيانات التواصل
- [ ] (اختياري، حسب السوق المستهدف) بانر موافقة الكوكيز ← Consent Mode v2 جاهز في `src/lib/analytics.ts`

## 6) الجودة والأداء

- [ ] `npm run build` بدون أخطاء
- [ ] `npm run test:e2e` ← كل الاختبارات تنجح
- [ ] الموقع على موبايل حقيقي (Android + iPhone): الفورم، أزرار الاتصال والواتساب، لوحة الأرقام في حقل الهاتف
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) على الدومين النهائي (موبايل): الأداء ≥ 90 للرئيسية
- [ ] الروابط: `/` · `/units` · `/gallery` · `/privacy` · `/thank-you` · رابط خاطئ يحوّل للرئيسية

## 7) SEO

- [ ] Google Search Console: إضافة الدومين ← رفع `https://your-domain.com/sitemap.xml`
- [ ] `robots.txt` يمنع `/thank-you` و `/api/`
- [ ] معاينة المشاركة (واتساب/فيسبوك) تُظهر صورة `og-muruj.jpg` والعنوان الصحيح

## 8) بعد الإطلاق (أول أسبوع)

- [ ] مطابقة عدد صفوف الشيت يومياً مع عدد التحويلات في Google Ads
- [ ] متابعة Vercel → Logs لأي `delivery_failed` (العميل يُكتب في اللوج كاملاً حتى لا يضيع)
- [ ] الرد على العملاء بسرعة: Reply مباشرة من الإيميل أو واتساب من الرقم في الشيت
