import { Link } from 'react-router-dom';
import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { SITE, telLink, whatsappLink } from '../config/site';
import { track } from '../lib/analytics';

/** Last update of this policy — change it whenever the text changes */
const UPDATED = { ar: '16 نوفمبر 2026', en: '16 November 2026' };

type Block = { h: string; p?: string[]; list?: string[] };

const CONTENT: Record<'ar' | 'en', { title: string; intro: string; blocks: Block[] }> = {
  ar: {
    title: 'سياسة الخصوصية',
    intro:
      'توضح هذه السياسة البيانات التي نجمعها عند استخدامك لهذا الموقع التسويقي الخاص بكمبوند مروج سموحة، وسبب جمعها، وكيفية استخدامها وحمايتها. هذا الموقع تسويقي ولا يمثل الموقع الرسمي للمطور.',
    blocks: [
      {
        h: '1. البيانات التي نجمعها',
        p: ['عند تعبئة نموذج التسجيل نجمع:'],
        list: [
          'الاسم.',
          'رقم الهاتف.',
          'البريد الإلكتروني (اختياري).',
          'نوع الوحدة أو المساحة التي تهتم بها.',
        ],
      },
      {
        h: '2. بيانات تُجمع تلقائياً',
        list: [
          'مصدر الزيارة: معاملات الحملات الإعلانية (utm_source / utm_medium / utm_campaign / utm_term / utm_content) ومعرّفات نقرات إعلانات جوجل (gclid / gbraid / wbraid).',
          'رابط الصفحة والصفحة التي أحالتك إلينا (Referrer).',
          'نوع الجهاز (موبايل / تابلت / كمبيوتر)، ووقت التسجيل.',
          'عنوان IP بشكل مؤقت لحماية النموذج من الرسائل المزعجة (Spam).',
        ],
      },
      {
        h: '3. لماذا نجمع هذه البيانات',
        list: [
          'للتواصل معك بخصوص كمبوند مروج سموحة فقط: الرد على استفسارك وإرسال الأسعار والمساحات وأنظمة السداد المتاحة.',
          'لمعرفة الإعلانات والقنوات التي أوصلتك إلينا وتحسين أداء حملاتنا الإعلانية.',
          'لحماية الموقع من الاستخدام المسيء.',
        ],
      },
      {
        h: '4. ملفات تعريف الارتباط (Cookies) وأدوات القياس',
        p: [
          'يستخدم الموقع أدوات Google Analytics وGoogle Ads (وقد يستخدم Google Tag Manager) لقياس الزيارات وتسجيل التحويلات الإعلانية. قد تضع هذه الأدوات ملفات تعريف ارتباط على جهازك.',
          'عند إرسال النموذج قد نرسل إلى Google نسخة مشفّرة تشفيراً أحادي الاتجاه (SHA-256) من رقم هاتفك وبريدك الإلكتروني لقياس دقة الإعلانات (Enhanced Conversions)، ولا يمكن استرجاع البيانات الأصلية منها.',
          'يمكنك التحكم في ملفات تعريف الارتباط أو حذفها من إعدادات المتصفح، وإدارة إعلانات Google من صفحة إعدادات الإعلانات في حسابك على Google.',
        ],
      },
      {
        h: '5. مشاركة البيانات',
        list: [
          'لا نبيع بياناتك ولا نؤجرها لأي طرف.',
          'تُرسل بيانات النموذج إلى فريق المبيعات المسؤول عن هذا الموقع عبر البريد الإلكتروني وتُحفظ في جدول بيانات آمن (Google Sheets).',
          'قد تُشارك مع المطور العقاري للمشروع فقط بالقدر اللازم لخدمة طلبك.',
        ],
      },
      {
        h: '6. مدة الاحتفاظ والحماية',
        p: [
          'نحتفظ ببياناتك للمدة اللازمة لخدمة طلبك أو حتى تطلب حذفها.',
          'نتخذ إجراءات معقولة لحمايتها، منها: الاتصال المشفّر (HTTPS)، وقصر الوصول على فريق المبيعات، وعدم حفظ بياناتك الشخصية في متصفحك.',
        ],
      },
      {
        h: '7. حقوقك وطلب حذف البيانات',
        p: [
          'يحق لك في أي وقت طلب الاطلاع على بياناتك أو تصحيحها أو حذفها، أو طلب عدم التواصل معك مرة أخرى.',
          'لتقديم الطلب تواصل معنا عبر الوسائل الموضحة بالأسفل، وسنقوم بتنفيذه خلال مدة معقولة.',
        ],
      },
      { h: '8. التعديلات', p: ['قد نُحدّث هذه السياسة من وقت لآخر، ويظهر تاريخ آخر تحديث أعلى الصفحة.'] },
    ],
  },
  en: {
    title: 'Privacy Policy',
    intro:
      'This policy explains what data we collect when you use this marketing website for Muruj Compound Smouha, why we collect it, and how it is used and protected. This is a marketing website and is not the official developer website.',
    blocks: [
      {
        h: '1. Data we collect',
        p: ['When you fill in the registration form we collect:'],
        list: [
          'Name.',
          'Phone number.',
          'Email (optional).',
          'The unit type or area you are interested in.',
        ],
      },
      {
        h: '2. Data collected automatically',
        list: [
          'Visit source: campaign parameters (utm_source / utm_medium / utm_campaign / utm_term / utm_content) and Google Ads click IDs (gclid / gbraid / wbraid).',
          'Page URL and referrer.',
          'Device type (mobile / tablet / desktop) and submission time.',
          'IP address, temporarily, to protect the form against spam.',
        ],
      },
      {
        h: '3. Why we collect it',
        list: [
          'Only to contact you about Muruj Compound Smouha: answering your enquiry and sending available unit details, areas and payment plans.',
          'To understand which ads and channels brought you to us and improve our campaigns.',
          'To protect the website from abuse.',
        ],
      },
      {
        h: '4. Cookies and measurement tools',
        p: [
          'This website uses Google Analytics and Google Ads (and may use Google Tag Manager) to measure visits and record ad conversions. These tools may set cookies on your device.',
          'When you submit the form we may send Google a one-way SHA-256 hashed copy of your phone and email for ad measurement (Enhanced Conversions); the original data cannot be recovered from it.',
          'You can control or delete cookies in your browser settings and manage Google ads in your Google account ad settings.',
        ],
      },
      {
        h: '5. Data sharing',
        list: [
          'We do not sell or rent your data.',
          'Form data is sent to the sales team responsible for this website by email and stored in a secure spreadsheet (Google Sheets).',
          'It may be shared with the project developer only as needed to serve your request.',
        ],
      },
      {
        h: '6. Retention and security',
        p: [
          'We keep your data as long as needed to serve your request or until you ask us to delete it.',
          'We take reasonable measures to protect it: encrypted connections (HTTPS), access limited to the sales team, and no personal data stored in your browser.',
        ],
      },
      {
        h: '7. Your rights and deletion requests',
        p: [
          'You may at any time ask to access, correct or delete your data, or ask us not to contact you again.',
          'To make a request, contact us using the details below and we will act on it within a reasonable time.',
        ],
      },
      { h: '8. Changes', p: ['We may update this policy from time to time; the last update date is shown at the top of the page.'] },
    ],
  },
};

export default function Privacy() {
  const { lang, u } = useLang();
  const c = CONTENT[lang];

  useHead({
    title: ROUTE_SEO['/privacy'].title[lang],
    description: ROUTE_SEO['/privacy'].description[lang],
    path: '/privacy',
  });

  return (
    <article className="bg-stone-50 py-12 md:py-16">
      <div className="container-x max-w-3xl">
        <h1 className="text-3xl font-black text-brand-900 md:text-4xl">{c.title}</h1>
        <p className="mt-2 text-sm font-bold text-gold-700">
          {lang === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {UPDATED[lang]}
        </p>
        <p className="mt-6 leading-8 text-stone-700">{c.intro}</p>

        <div className="mt-8 space-y-8 rounded-2xl bg-white p-5 shadow-sm md:p-8">
          {c.blocks.map((b) => (
            <section key={b.h}>
              <h2 className="mb-3 text-xl font-extrabold text-brand-900">{b.h}</h2>
              {b.p?.map((t) => (
                <p key={t} className="mb-2 leading-8 text-stone-700">
                  {t}
                </p>
              ))}
              {b.list && (
                <ul className="list-disc space-y-1.5 ps-6 leading-8 text-stone-700 marker:text-gold-500">
                  {b.list.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section id="contact">
            <h2 className="mb-3 text-xl font-extrabold text-brand-900">{lang === 'ar' ? '9. التواصل معنا' : '9. Contact us'}</h2>
            <ul className="space-y-2 text-stone-700">
              <li>
                {u('callUs')}:{' '}
                <a href={telLink()} onClick={() => track('click_call', { location: 'privacy' })} className="font-bold text-brand-800 underline" dir="ltr">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                {u('whatsapp')}:{' '}
                <a href={whatsappLink(lang)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_whatsapp', { location: 'privacy' })} className="font-bold text-brand-800 underline">
                  {lang === 'ar' ? 'راسلنا على واتساب' : 'Message us on WhatsApp'}
                </a>
              </li>
              {SITE.email && (
                <li>
                  Email:{' '}
                  <a href={`mailto:${SITE.email}`} className="font-bold text-brand-800 underline">
                    {SITE.email}
                  </a>
                </li>
              )}
            </ul>
          </section>
        </div>

        <p className="mt-8 text-center">
          <Link to="/" className="font-bold text-brand-800 underline">
            {u('backHome')}
          </Link>
        </p>
      </div>
    </article>
  );
}
