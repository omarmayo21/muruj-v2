"""
Converts the raw images scraped from the 4 source pages (+ the developer brochure PDF
linked on alforat.com.eg) into optimized WebP files in /public/images and writes a
typed manifest to src/data/images.generated.ts.

Run:  python3 scripts/process-images.py   (requires Pillow; raw files in ../scrape)
"""
import json, os
from PIL import Image

RAW = os.path.join(os.path.dirname(__file__), "..", "..", "scrape")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
MANIFEST = os.path.join(os.path.dirname(__file__), "..", "src", "data", "images.generated.ts")
os.makedirs(OUT, exist_ok=True)

# key, raw file, output name, category, alt_ar, alt_en, source
IMAGES = [
  # --- Hero / overview ---
  ("villasStreet", "raw/af_cover.jpg", "muruj-alforat-villas-street", "exterior", "شارع الفيلات المستقلة في كمبوند الفرات داخل مروج سموحة", "Standalone villas street at Alforat Compound, Muruj Smouha", "alforat.com.eg"),
  ("apartmentTowers", "raw/sm_hero.webp", "muruj-apartment-towers-exterior", "exterior", "تصور واجهات العمارات السكنية في مروج سموحة", "Rendering of residential towers in Muruj Smouha", "smouha.org"),
  ("aerialNight", "raw/af_aerial.jpg", "muruj-alforat-aerial-view", "exterior", "منظر علوي ليلي لشوارع وفيلات كمبوند الفرات في مروج", "Aerial night view of Alforat Compound villas in Muruj", "alforat.com.eg / broker.com.eg"),
  ("landscapePath", "raw/br_g3.webp", "muruj-landscape-walkway", "landscape", "ممشى ومساحات خضراء ولاندسكيب بين الفيلات", "Landscaped walkway and green areas between villas", "broker.com.eg / alforat.com.eg"),
  ("clubhousePool", "raw/af_cam08.jpg", "muruj-alforat-clubhouse-pool", "facilities", "حمام السباحة ومنطقة الكلوب هاوس في كمبوند الفرات", "Clubhouse swimming pool at Alforat Compound", "alforat.com.eg"),
  ("kidsArea", "raw/af_cam1.jpg", "muruj-alforat-kids-area", "facilities", "منطقة ألعاب الأطفال وحمام السباحة وسط الفيلات", "Kids play area and pool among the villas", "alforat.com.eg"),
  ("apartmentFacades", "raw/sm_facades.webp", "muruj-apartment-facades", "exterior", "واجهات العمارات السكنية في مجتمع مروج", "Residential building facades in the Muruj community", "smouha.org"),
  # --- renders ---
  ("villaRender1", "raw/af_cam002.jpg", "muruj-alforat-villa-render-1", "exterior", "تصور فيلا مستقلة بحديقة أمامية وجراج", "Standalone villa rendering with front garden and parking", "alforat.com.eg"),
  ("villaRender2", "raw/af_cam01.jpg", "muruj-alforat-villa-render-2", "exterior", "تصور واجهة فيلا مستقلة في كمبوند الفرات", "Standalone villa facade rendering at Alforat Compound", "alforat.com.eg"),
  ("villaRender3", "raw/af_cam03.jpg", "muruj-alforat-villa-render-3", "exterior", "فيلا مستقلة مع أشجار الجاكرندا في مروج سموحة", "Standalone villa with jacaranda trees in Muruj Smouha", "alforat.com.eg"),
  ("villaRender4", "raw/af_cam06.jpg", "muruj-alforat-villa-render-4", "exterior", "واجهة فيلا مستقلة من ثلاثة أدوار", "Three-storey standalone villa facade", "alforat.com.eg"),
  # --- real site photos ---
  ("sitePhoto1", "raw/af_alf2.jpg", "muruj-alforat-site-photo-villas", "photos", "صورة فعلية لفيلات كمبوند الفرات في مروج سموحة", "Actual photo of Alforat Compound villas in Muruj Smouha", "alforat.com.eg"),
  ("sitePhoto2", "raw/af_m83.jpg", "muruj-alforat-site-photo-gate", "photos", "صورة فعلية لمدخل كمبوند الفرات واللاندسكيب", "Actual photo of Alforat Compound entrance and landscape", "alforat.com.eg"),
  ("sitePhoto3", "raw/af_sel1.jpg", "muruj-alforat-site-photo-street", "photos", "صورة فعلية لشارع داخلي بين الفيلات", "Actual photo of an internal street between villas", "alforat.com.eg"),
  ("sitePhoto4", "raw/af_sel8.jpg", "muruj-alforat-site-photo-boulevard", "photos", "صورة فعلية للبوليفارد الرئيسي بين صفوف الفيلات", "Actual photo of the main boulevard between villa rows", "alforat.com.eg"),
  ("sitePhoto5", "raw/af_sel11.jpg", "muruj-alforat-site-photo-court", "photos", "صورة فعلية للملعب متعدد الأغراض", "Actual photo of the multipurpose court", "alforat.com.eg"),
  ("sitePhoto6", "raw/af_sel13.jpg", "muruj-alforat-site-photo-mosque", "photos", "صورة فعلية لمبنى المسجد داخل الكمبوند", "Actual photo of the mosque building in the compound", "alforat.com.eg"),
  ("sitePhoto7", "raw/af_sel26.jpg", "muruj-alforat-site-photo-walkway", "photos", "صورة فعلية لممشى مضاء بأعمدة إنارة بجوار الفيلات", "Actual photo of a lit walkway next to the villas", "alforat.com.eg"),
  ("sitePhoto8", "raw/af_alf11.jpg", "muruj-alforat-site-photo-villa-side", "photos", "صورة فعلية لفيلا مستقلة وممر جانبي", "Actual photo of a standalone villa and side path", "alforat.com.eg"),
  ("sitePhoto9", "raw/af_alf14.jpg", "muruj-alforat-site-photo-villa-front", "photos", "صورة فعلية لواجهة فيلا مستقلة", "Actual photo of a standalone villa front", "alforat.com.eg"),
  # --- villa models ---
  ("v1Front", "raw/br_facade.webp", "alforat-villa-v1-front", "villas", "واجهة الفيلا المستقلة نموذج V1", "Standalone villa V1 front facade", "broker.com.eg"),
  ("v1Back", "raw/af_v1back.jpg", "alforat-villa-v1-back", "villas", "الواجهة الخلفية للفيلا المستقلة نموذج V1 مع حمام سباحة", "Standalone villa V1 back facade with pool", "alforat.com.eg"),
  ("v2Front", "raw/br_g2.webp", "alforat-villa-v2-front", "villas", "واجهة الفيلا المستقلة نموذج V2", "Standalone villa V2 front facade", "alforat.com.eg / broker.com.eg"),
  ("v2Back", "raw/af_v2back2.jpg", "alforat-villa-v2-back", "villas", "الواجهة الخلفية للفيلا المستقلة نموذج V2", "Standalone villa V2 back facade", "alforat.com.eg"),
  ("v3Front", "raw/af_v3front.jpg", "alforat-villa-v3-front", "villas", "واجهة الفيلا المستقلة نموذج V3", "Standalone villa V3 front facade", "alforat.com.eg"),
  ("v3Back", "raw/af_v3back.jpg", "alforat-villa-v3-back", "villas", "الحديقة الخلفية للفيلا المستقلة نموذج V3", "Standalone villa V3 backyard", "alforat.com.eg"),
  ("v4Front", "raw/af_v4front.jpg", "alforat-villa-v4-front", "villas", "واجهة الفيلا المستقلة نموذج V4", "Standalone villa V4 front facade", "alforat.com.eg"),
  ("v4Back", "raw/af_v4back.jpg", "alforat-villa-v4-back", "villas", "الواجهة الخلفية للفيلا المستقلة نموذج V4", "Standalone villa V4 back facade", "alforat.com.eg"),
  # --- facilities (developer) ---
  ("facPool", "raw/af_img88.png", "alforat-facility-swimming-pool", "facilities", "حمام سباحة", "Swimming pool", "alforat.com.eg"),
  ("facCourt", "raw/af_img99.png", "alforat-facility-multipurpose-court", "facilities", "ملعب متعدد الأغراض", "Multipurpose court", "alforat.com.eg"),
  ("facKids", "raw/af_img100.png", "alforat-facility-kids-playground", "facilities", "ملعب للأطفال", "Kids playground", "alforat.com.eg"),
  ("facMosque", "raw/af_img101.png", "alforat-facility-mosque", "facilities", "مسجد", "Mosque", "alforat.com.eg"),
  # --- plans ---
  ("masterplanMuruj", "mp_muruj.jpg", "muruj-smouha-master-plan", "plans", "المخطط العام لمجتمع مروج سموحة بجوار جرين بلازا ومحور المحمودية", "Muruj Smouha community master plan next to Green Plaza and Mahmoudia axis", "solvahomes.com"),
  ("masterplanAlforat", "raw/br_master.webp", "alforat-compound-master-plan", "plans", "المخطط العام لكمبوند الفرات للفيلات داخل مروج", "Alforat Compound villas master plan inside Muruj", "broker.com.eg / alforat.com.eg"),
  ("villaModelsKey", "mp_models.jpg", "alforat-villa-models-key-plan", "plans", "خريطة توزيع نماذج الفيلات V1 و V2 و V3 و V4", "Key plan of villa types V1, V2, V3 and V4", "alforat.com.eg (brochure)"),
  ("locationMap", "loc_map.jpg", "muruj-location-map", "plans", "خريطة موقع مروج والمسافات إلى كارفور ونادي سموحة والمحافظة الجديدة", "Muruj location map with drive times to Carrefour, Smouha Club and New Government", "alforat.com.eg (brochure)"),
  # --- floor plans ---
  ("planVee106", "raw/sm_vee106.webp", "vee-muruj-2-bedroom-106sqm-floor-plan", "floorplans", "مسقط شقة غرفتين 106 م² في ڤي مروج - ڤي سيبا 37 نموذج 2", "Vee Muruj 2-bedroom 106 m² floor plan - Vee Seba 37 type 2", "smouha.org"),
  ("planZinnia140", "raw/br_floor.webp", "zinnia-muruj-3-bedroom-140sqm-floor-plan", "floorplans", "مسقط شقة 3 غرف 140 م² في زينيا مروج - مبنى A شقة 1", "Zinnia Muruj 3-bedroom 140 m² floor plan - Building A flat 1", "broker.com.eg / smouha.org"),
  ("planHeights", "raw/sm_heights121.png", "muruj-heights-buildings-c-d-floor-plans", "floorplans", "مساقط مروج هايتس للمبنى C والمبنى D بمساحات من 121 إلى 180 م²", "Muruj Heights floor plans for buildings C and D, 121–180 m²", "smouha.org"),
]

def save(im, path, maxw, q):
    im = im.copy()
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=q, method=6)
    return im.width, im.height


# --- Remove third-party branding (developer/agency logos, seals) from specific source images ---
def _fill_cols_from_row(im, box, row):
    """Fill box column-by-column with the colour found at `row` (seamless over textured backgrounds)."""
    px = im.load()
    x0, y0, x1, y1 = box
    for x in range(x0, x1):
        c = px[x, row]
        for y in range(y0, y1):
            px[x, y] = c

def clean_branding(key, im):
    from PIL import ImageDraw
    if key == "planZinnia140":            # MWA + "Muruj Smouha Green City" logos, EGAD agency logo
        d = ImageDraw.Draw(im)
        d.rectangle((0, 24, 236, 82), fill=(101, 155, 173))
        d.rectangle((0, 558, 64, 604), fill=(255, 255, 255))
    elif key == "masterplanMuruj":        # government seal (top-left) + marketing logo (top-right)
        _fill_cols_from_row(im, (0, 0, 144, 74), 76)
        _fill_cols_from_row(im, (1136, 0, im.width, 26), 28)
    return im

manifest = {}
total = 0
for key, src, name, cat, alt_ar, alt_en, source in IMAGES:
    im = Image.open(os.path.join(RAW, src))
    im = im.convert("RGBA" if cat == "logo" else "RGB")
    im = clean_branding(key, im)
    q = 88 if cat in ("plans", "floorplans") else 78
    maxw = 1800 if cat in ("plans", "floorplans") else 1600
    w, h = save(im, os.path.join(OUT, f"{name}.webp"), maxw, q)
    entry = {"src": f"/images/{name}.webp", "width": w, "height": h, "alt": alt_ar, "altEn": alt_en, "category": cat, "source": source}
    if w > 800:
        sw, sh = save(im, os.path.join(OUT, f"{name}-sm.webp"), 768, q)
        entry["srcSm"] = f"/images/{name}-sm.webp"
        total += os.path.getsize(os.path.join(OUT, f"{name}-sm.webp"))
    if w > 560 and cat != "logo":
        save(im, os.path.join(OUT, f"{name}-xs.webp"), 480, min(q, 72))
        entry["srcXs"] = f"/images/{name}-xs.webp"
        total += os.path.getsize(os.path.join(OUT, f"{name}-xs.webp"))
    total += os.path.getsize(os.path.join(OUT, f"{name}.webp"))
    manifest[key] = entry

# OG image 1200x630 from the villas street
og = Image.open(os.path.join(RAW, "raw/af_cover.jpg")).convert("RGB")
r = 1200 / 630
w, h = og.size
nh = int(w / r)
og = og.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh)).resize((1200, 630), Image.LANCZOS)
og.save(os.path.join(OUT, "og-muruj.jpg"), "JPEG", quality=82, optimize=True)

with open(MANIFEST, "w", encoding="utf-8") as f:
    f.write("// AUTO-GENERATED by scripts/process-images.py — do not edit by hand.\n")
    f.write("import type { ImageAsset } from './types';\n\n")
    # Image sources are kept as comments only (never shipped in the client bundle)
    f.write("// Sources:\n" + "".join(f"//   {k}: {v.pop('source')}\n" for k, v in manifest.items()) + "\n")
    f.write("export const IMAGES = " + json.dumps(manifest, ensure_ascii=False, indent=2) + " as const satisfies Record<string, ImageAsset>;\n")
print(len(manifest), "images,", round(total / 1024), "KB total")
