# ✅ قائمة ما قبل الإطلاق — كمبوند مروج سموحة

> علّم كل بند بعد التأكد منه بنفسك على **الدومين النهائي** (وليس محلياً فقط).
> الأوامر المذكورة موضحة بالتفصيل في `README.md`.

## 1) بيانات يجب إدخالها (لا يعمل الموقع بشكل صحيح بدونها)

- [ ] `src/config/site.ts` ← `phone` و `phoneDisplay`: رقم الاتصال الحقيقي (بدل `+20XXXXXXXXXX`)
- [ ] `src/config/site.ts` ← `whatsapp`: رقم الواتساب بدون `+` (مثل `2010xxxxxxxx`)
- [ ] `src/config/site.ts` ← `siteUrl`: الدومين النهائي (يؤثر على canonical و OG و sitemap و JSON-LD)
- [ ] `src/config/site.ts` ← `email` و `workingHours`: بريد التواصل ومواعيد العمل (تظهر في صفحة `/contact` والفوتر)
- [ ] مراجعة `MISSING_DATA.md` و `DATA_CONFLICTS.md` (بداية المساحات من 88 م² حتى 479 م²، وعدم وجود أي أرقام مالية)

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
- [ ] الإيميل وصل بعنوان `عميل جديد - كمبوند مروج - …` ويحتوي على صفوف `Message` و `Source Page`
- [ ] الصف ظهر في الشيت (16 عموداً شاملة `Message` و `Source Page`، بتوقيت القاهرة)، ثم احذف صف الاختبار
- [ ] تجربة التسجيل من `/register` (`source_page=register`) ومن `/contact` (`source_page=contact` مع رسالة) والتأكد من وصولها للإيميل والشيت
- [ ] تجربة الفشل: أدخل رقماً خاطئاً ← رسالة خطأ عربية واضحة

## 4) التتبع والتحويل

- [ ] **Tag Assistant**: GA4 + Google Ads يعملان على كل الصفحات
- [ ] تسجيل عميل من `/` أو `/register` أو `/contact` ← في `/thank-you` يظهر **Conversion واحد** مع `transaction_id`
- [ ] **Refresh** لصفحة الشكر ← لا يظهر تحويل جديد
- [ ] فتح `/thank-you` مباشرة ← لا يظهر تحويل
- [ ] النقر على الهاتف والواتساب في `/contact` يطلق أحداث `click_call` و `click_whatsapp`

## 5) المحتوى والامتثال

- [ ] **عدم وجود أي أسعار**: التأكد من خلو الموقع تماماً من أي أرقام مالية أو عملات
- [ ] **حقوق الصور**: تأكيد حق الاستخدام التجاري لكل صور `public/images/` (موافقة المطور/الوكالة) أو استبدالها
- [ ] لا توجد أسماء/أرقام/شعارات وسطاء (solvahomes · broker.com.eg · smouha.org)
- [ ] الفوتر وصفحة `/contact` يظهران: "هذا الموقع تسويقي ولا يمثل الموقع الرسمي للمطور"
- [ ] صفحة `/privacy`: مراجعة النص وتاريخ التحديث وبيانات التواصل

## 6) الجودة والأداء

- [ ] `npm run build` بدون أخطاء
- [ ] `npm run test:e2e` ← كل الاختبارات تنجح
- [ ] القائمة الرئيسية: `الرئيسية (/) | الوحدات (/units) | المعرض (/gallery) | سجّل الآن (/register) | اتصل بنا (/contact)`
- [ ] الروابط: `/` · `/units` · `/gallery` · `/register` · `/contact` · `/privacy` · `/thank-you` · رابط خاطئ يحوّل للرئيسية

## 7) SEO

- [ ] Google Search Console: إضافة الدومين ← رفع `https://your-domain.com/sitemap.xml` (يضم `/`، `/units`، `/gallery`، `/register`، `/contact`، `/privacy` ولا يضم `/thank-you`)
- [ ] `robots.txt` يمنع `/thank-you` و `/api/`
