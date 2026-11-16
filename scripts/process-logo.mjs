/**
 * Inspects public/logo.jpg and generates all cleaned, transparent, upscaled,
 * and icon/OG variants in /public without altering the logo design.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = path.join(root, 'public');
const srcPath = path.join(pub, 'logo.jpg');
const origPath = path.join(pub, 'logo-original.jpg');

// 1. Keep original as /public/logo-original.jpg
if (!fs.existsSync(origPath) && fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, origPath);
}

const jpgBase64 = fs.readFileSync(origPath).toString('base64');
const winChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch(fs.existsSync(winChrome) ? { channel: 'chrome' } : {});
const page = await browser.newPage();

const result = await page.evaluate(async (b64) => {
  const loadImg = (src) =>
    new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = src;
    });

  const img = await loadImg(`data:image/jpeg;base64,${b64}`);
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  const c0 = document.createElement('canvas');
  c0.width = W;
  c0.height = H;
  const ctx0 = c0.getContext('2d');
  ctx0.drawImage(img, 0, 0);
  const imgData = ctx0.getImageData(0, 0, W, H);
  const d = imgData.data;

  // Inspect main colors and bounding box
  let minX = W, minY = H, maxX = 0, maxY = 0;
  const oliveR = [], oliveG = [], oliveB = [];
  const brightR = [], brightG = [], brightB = [];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const minC = Math.min(r, g, b);
      if (minC < 232) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      // Solid interior pixels for accurate color sampling
      if (minC < 140) {
        if (g - r > 52 && g > 140) {
          brightR.push(r); brightG.push(g); brightB.push(b);
        } else {
          oliveR.push(r); oliveG.push(g); oliveB.push(b);
        }
      }
    }
  }

  const median = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)] || 0;
  };
  const toHex = (r, g, b) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

  const oliveRGB = [median(oliveR), median(oliveG), median(oliveB)];
  const brightRGB = [median(brightR), median(brightG), median(brightB)];
  const oliveHex = toHex(...oliveRGB);
  const brightHex = toHex(...brightRGB);

  // Crop to tight bounding box
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const cCrop = document.createElement('canvas');
  cCrop.width = cropW;
  cCrop.height = cropH;
  const ctxCrop = cCrop.getContext('2d');
  ctxCrop.drawImage(c0, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  // Upscale 3x with high-quality resampling first, then apply unsharp mask + clean alpha matting
  const scale = 3;
  const upW = cropW * scale;
  const upH = cropH * scale;
  const cUp = document.createElement('canvas');
  cUp.width = upW;
  cUp.height = upH;
  const ctxUp = cUp.getContext('2d');
  ctxUp.imageSmoothingEnabled = true;
  ctxUp.imageSmoothingQuality = 'high';
  ctxUp.drawImage(cCrop, 0, 0, upW, upH);

  const upData = ctxUp.getImageData(0, 0, upW, upH);
  const ud = upData.data;

  // Mild 3x3 unsharp mask to crisp up edges from the 447px JPEG source
  const copy = new Uint8ClampedArray(ud);
  const amount = 0.45;
  for (let y = 1; y < upH - 1; y++) {
    for (let x = 1; x < upW - 1; x++) {
      const idx = (y * upW + x) * 4;
      for (let c = 0; c < 3; c++) {
        const blur =
          (copy[((y - 1) * upW + x) * 4 + c] +
            copy[((y + 1) * upW + x) * 4 + c] +
            copy[(y * upW + (x - 1)) * 4 + c] +
            copy[(y * upW + (x + 1)) * 4 + c] +
            copy[idx + c] * 4) /
          8;
        ud[idx + c] = Math.min(255, Math.max(0, Math.round(copy[idx + c] + (copy[idx + c] - blur) * amount)));
      }
    }
  }

  // Create transparent dark-on-light canvas and transparent light-on-dark canvas
  // Using color-unmixing against white (255,255,255) so anti-aliased edge pixels have zero white halo
  const cTrans = document.createElement('canvas');
  cTrans.width = upW;
  cTrans.height = upH;
  const ctxTrans = cTrans.getContext('2d');
  const transData = ctxTrans.createImageData(upW, upH);
  const td = transData.data;

  const cLight = document.createElement('canvas');
  cLight.width = upW;
  cLight.height = upH;
  const ctxLight = cLight.getContext('2d');
  const lightData = ctxLight.createImageData(upW, upH);
  const ld = lightData.data;

  // Precompute foreground chroma difference (G - R) and dilate by radius 6
  // so 4:2:0 JPEG chroma subsampling at letter edges never causes edge colour fringing
  const rawDiff = new Float32Array(upW * upH);
  for (let i = 0, p = 0; i < ud.length; i += 4, p++) {
    const drop = 255 - Math.min(ud[i], ud[i + 1], ud[i + 2]);
    if (drop > 65) {
      rawDiff[p] = ud[i + 1] - ud[i];
    } else {
      rawDiff[p] = -999;
    }
  }
  const dilatedDiff = new Float32Array(upW * upH);
  const rad = 6;
  for (let y = 0; y < upH; y++) {
    const y0 = Math.max(0, y - rad), y1 = Math.min(upH - 1, y + rad);
    for (let x = 0; x < upW; x++) {
      const x0 = Math.max(0, x - rad), x1 = Math.min(upW - 1, x + rad);
      let maxD = -999;
      for (let yy = y0; yy <= y1; yy++) {
        const rowOff = yy * upW;
        for (let xx = x0; xx <= x1; xx++) {
          const v = rawDiff[rowOff + xx];
          if (v > maxD) maxD = v;
        }
      }
      dilatedDiff[y * upW + x] = maxD;
    }
  }

  for (let i = 0, p = 0; i < ud.length; i += 4, p++) {
    const r = ud[i], g = ud[i + 1], b = ud[i + 2];
    const drop = 255 - Math.min(r, g, b);
    let alpha = (drop - 22) / (170 - 22);
    alpha = Math.max(0, Math.min(1, alpha));
    alpha = alpha * alpha * (3 - 2 * alpha);

    if (alpha <= 0.005) {
      td[i + 3] = 0;
      ld[i + 3] = 0;
      continue;
    }

    const diff = dilatedDiff[p] > -900 ? dilatedDiff[p] : g - r;
    const t = Math.max(0, Math.min(1, (diff - 38) / 18));
    const smoothT = t * t * (3 - 2 * t);

    td[i] = Math.round(oliveRGB[0] * (1 - smoothT) + brightRGB[0] * smoothT);
    td[i + 1] = Math.round(oliveRGB[1] * (1 - smoothT) + brightRGB[1] * smoothT);
    td[i + 2] = Math.round(oliveRGB[2] * (1 - smoothT) + brightRGB[2] * smoothT);
    td[i + 3] = Math.round(alpha * 255);

    // Light variant for dark backgrounds:
    // Olive-green structural elements -> crisp white (#FFFFFF)
    // Bright leaf-green elements -> luminous soft leaf-green (#74D65E)
    ld[i] = Math.round(255 * (1 - smoothT) + 116 * smoothT);
    ld[i + 1] = Math.round(255 * (1 - smoothT) + 214 * smoothT);
    ld[i + 2] = Math.round(255 * (1 - smoothT) + 94 * smoothT);
    ld[i + 3] = Math.round(alpha * 255);
  }

  ctxTrans.putImageData(transData, 0, 0);
  ctxLight.putImageData(lightData, 0, 0);

  // Helper to render centered with even padding at a target width
  const renderLogo = (sourceCanvas, targetWidth, padRatio = 0.06) => {
    const innerW = Math.round(targetWidth * (1 - padRatio * 2));
    const aspect = sourceCanvas.height / sourceCanvas.width;
    const innerH = Math.round(innerW * aspect);
    const padX = Math.round((targetWidth - innerW) / 2);
    const padY = padX;
    const targetHeight = innerH + padY * 2;

    const out = document.createElement('canvas');
    out.width = targetWidth;
    out.height = targetHeight;
    const ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, padX, padY, innerW, innerH);
    return { canvas: out, width: targetWidth, height: targetHeight };
  };

  // Helper to render square icon (logo centered on clean white background with subtle border radius or full bleed)
  const renderSquareIcon = (sourceCanvas, size, padRatio = 0.1) => {
    const out = document.createElement('canvas');
    out.width = size;
    out.height = size;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const maxDim = Math.round(size * (1 - padRatio * 2));
    const aspect = sourceCanvas.height / sourceCanvas.width;
    const drawW = maxDim;
    const drawH = Math.round(drawW * aspect);
    const dx = Math.round((size - drawW) / 2);
    const dy = Math.round((size - drawH) / 2);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, dx, dy, drawW, drawH);
    return out;
  };

  // Helper to render 1200x630 OG image
  const renderOgImage = (sourceCanvas) => {
    const out = document.createElement('canvas');
    out.width = 1200;
    out.height = 630;
    const ctx = out.getContext('2d');

    // Rich brand background with subtle warm-white card in center so the original green logo pops cleanly
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#1e2c15');
    grad.addColorStop(0.5, '#2d421f');
    grad.addColorStop(1, '#182411');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle radial glow
    const rad = ctx.createRadialGradient(600, 315, 50, 600, 315, 520);
    rad.addColorStop(0, 'rgba(116, 214, 94, 0.18)');
    rad.addColorStop(1, 'rgba(116, 214, 94, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 1200, 630);

    // Clean centered card with rounded corners
    const cardW = 680, cardH = 440;
    const cardX = (1200 - cardW) / 2;
    const cardY = (630 - cardH) / 2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 32);
    ctx.fill();

    // Draw logo centered inside the card
    const drawW = 500;
    const aspect = sourceCanvas.height / sourceCanvas.width;
    const drawH = Math.round(drawW * aspect);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, (1200 - drawW) / 2, (630 - drawH) / 2, drawW, drawH);
    return out;
  };

  const toB64 = (canvas, mime, q = 0.92) => canvas.toDataURL(mime, q).split(',')[1];

  const logo512 = renderLogo(cTrans, 512, 0.05);
  const logo1024 = renderLogo(cTrans, 1024, 0.05);
  const logoLight512 = renderLogo(cLight, 512, 0.05);

  const fav16 = renderSquareIcon(cTrans, 16, 0.06);
  const fav32 = renderSquareIcon(cTrans, 32, 0.06);
  const apple180 = renderSquareIcon(cTrans, 180, 0.1);
  const icon192 = renderSquareIcon(cTrans, 192, 0.1);
  const icon512 = renderSquareIcon(cTrans, 512, 0.1);
  const ogCanvas = renderOgImage(cTrans);

  return {
    meta: {
      origW: W,
      origH: H,
      bbox: { minX, minY, maxX, maxY, cropW, cropH },
      oliveRGB,
      oliveHex,
      brightRGB,
      brightHex,
      logo512W: logo512.width,
      logo512H: logo512.height,
      logo1024W: logo1024.width,
      logo1024H: logo1024.height,
    },
    files: {
      'logo.webp': toB64(logo512.canvas, 'image/webp', 0.92),
      'logo.png': toB64(logo512.canvas, 'image/png'),
      'logo@2x.webp': toB64(logo1024.canvas, 'image/webp', 0.92),
      'logo-light.png': toB64(logoLight512.canvas, 'image/png'),
      'favicon-32.png': toB64(fav32, 'image/png'),
      'apple-touch-icon.png': toB64(apple180, 'image/png'),
      'icon-192.png': toB64(icon192, 'image/png'),
      'icon-512.png': toB64(icon512, 'image/png'),
      'og-image.jpg': toB64(ogCanvas, 'image/jpeg', 0.88),
    },
    fav16Png: toB64(fav16, 'image/png'),
    fav32Png: toB64(fav32, 'image/png'),
  };
}, jpgBase64);

await browser.close();

// Write all generated image files
for (const [name, b64] of Object.entries(result.files)) {
  fs.writeFileSync(path.join(pub, name), Buffer.from(b64, 'base64'));
}

// Build valid multi-resolution favicon.ico (16x16 + 32x32 PNGs inside ICO container)
function buildIco(png16Buf, png32Buf) {
  const images = [
    { w: 16, h: 16, buf: png16Buf },
    { w: 32, h: 32, buf: png32Buf },
  ];
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(images.length, 4);

  const dirEntries = [];
  let offset = 6 + images.length * 16;
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.w, 0);
    entry.writeUInt8(img.h, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += img.buf.length;
  }
  return Buffer.concat([header, ...dirEntries, ...images.map((i) => i.buf)]);
}

const icoBuf = buildIco(Buffer.from(result.fav16Png, 'base64'), Buffer.from(result.fav32Png, 'base64'));
fs.writeFileSync(path.join(pub, 'favicon.ico'), icoBuf);

console.log('Logo processing complete:', JSON.stringify(result.meta, null, 2));
