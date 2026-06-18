// ============================================================
// VARIANT GENERATOR — Sharp.js • 20 backgrounds (Style A + B) • Full scoring
// Implements the prompt engine spec for Meesho shipping optimization
// ============================================================

import sharp from 'sharp';
import { removeImageBackground } from './imageUtils';
import {
  BACKGROUND_VARIANTS,
  GENERATION_ORDER,
  EMOJI_SETS,
  scoreForLowestShipping,
  generateMasterPrompt,
  type StyleGroup,
} from './promptEngine';

async function makeFallbackSticker(size: number, bgColor: { r: number; g: number; b: number }): Promise<Buffer> {
  const innerSize = Math.max(1, Math.round(size * 0.72));
  const innerOffset = Math.round((size - innerSize) / 2);

  const base = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 205, b: 77, alpha: 220 },
    },
  })
    .png()
    .toBuffer();

  const inner = await sharp({
    create: {
      width: innerSize,
      height: innerSize,
      channels: 4,
      background: { ...bgColor, alpha: 90 },
    },
  })
    .blur(Math.max(1, Math.round(size * 0.08)))
    .png()
    .toBuffer();

  return sharp(base)
    .composite([{ input: inner, top: innerOffset, left: innerOffset, blend: 'over' }])
    .png()
    .toBuffer();
}

async function makeSticker(
  emoji: string,
  size: number,
  bgColor: { r: number; g: number; b: number },
): Promise<Buffer> {
  try {
    const input = EMOJI_BUFFERS[emoji];
    if (!input) {
      throw new Error(`Missing sticker asset for ${emoji}`);
    }

    return await sharp(input, { failOn: 'none' }).resize(size, size).png().toBuffer();
  } catch (err) {
    console.warn(`Sticker asset fallback for ${emoji}:`, (err as Error).message);
    return makeFallbackSticker(size, bgColor);
  }
}

const EMOJI_BUFFERS: Record<string, Buffer> = {
  '😍': Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAsVBMVEVHcEzdLkT/zE3/zE3dLkT/zE3/zE3/zE3dLkT/zE3/zE3dLkT/zE3dLkT/zE3/zE3dLkT/zE3dLkTdLkTdLkT/zE3dLkTdLkTlUkbdLkTdLkRmRQCziSfZqjqMZxP1xEh5VgqDXg7isz9wTQWpgCKWbxifeB3su0O8kSvGmTDfOEX/zE3dLkT5rkv9wkzmVkbhQkXsc0jykUrufUnwh0njTEb7uEzqaUf3pUvoX0f0m0rE5zjeAAAAG3RSTlMAEFCA79+PIL+f74BgYL+vn0CvMEDPcM/PIN/+QM56AAACtUlEQVR4XqyT6Y6CMBSFTw2bAxgDBpdH6MbmOu//YGMFtCK5JRm/nzcnH6e9FJOk6yiK1mkSrHzR46+CpB9jLoUnO/hRWBx5P/YKzIFl8sVNDxp9s8YZg5tI2pSDqJQ2EZzE8p2287SjcYxpmLnHLM7BvJGIa+PRfDT2GPI4MxthtuZZI9rJMY8LP8oxu+hZ7qnKt5Kg7G6IYJv3fTxJURlRRUY81q+JxoiowLDEVP5fJFMAmSukZ4gyAPIbjSSw+Y5oQ4jordEi+j+iRXtXpO2fGs0eOEiaqxFdJc2he+4UXDzgdCp2v5BLJ7rMeCOF62TusxUwhKVr+a5nW4YwBJoINYOoIT6mAxh+hOJ0IboSV+IHABb3kDpRhehKJ3UPLAAsTUqX0yFhMf2xUpvAEoDfxVpiZcTi2i7gA+GQU5+lavFG/VlHDYEQySv4W00cjDhcZd1ggsBONnYrfh6Lztxu0wiLAKv3rKqr11Y/UIOpqtVfO3aw2jAMBAF0kLGFREnIwSdFshPHSdppIZBT/v/HStqmpLvYlktu7buuGNidm/jDAqV+fb6c7nJU0uly1rMSfJC/HfQfVPIhSiyoNRSmxwtUlLZdCG2/jlvqUVz3bQidHlV4otSGmzal9beU7gaUnmApNCGD2s5CXTuGDFHdGnAUQgYKDoCh0IVJHQUDAF4E7cOkvcjxuKrmHymq8q8shU2YkHRnH5ayt7mdLfFpRWEXRu0orPDFzVpuo7u/sbK4ZiRp08jKLL4VFJoUBqSGQoE7NaVd5n1Y4571lOImKCmSerEfDLXnJGKeqRkIBTUejn0XPnT98UCNBRTHAdsYtxzggLwkTedo7kE5QMFZCgwyntm8wQhbM1NtMa7wzOALTLKOk5xFjtWSo5Yr5LKV5wBfWcxiXEmldAa/YOX3ocWwd2I9te5q4VI/AAAAAElFTkSuQmCC', 'base64'),
  '🤩': Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAwFBMVEVHcEzpXyjpXyj/zE3/zE3/zE3/zE3/zE3pXyj/zE3/zE3/zE3pXyj/zE3/zE3pXyj/zE3/zE3pXyjpXyjpXyj2nj3scC7pXyhmRQD///+MdEDZqjqheR15VwyziSezooD1xEiMZxPDli7PojVwTgnZ0b+Zg1X18++DaDCDXg7isz/su0PBtJfi3M+Wbxjs6N/Pxa/qZirpXyj/zE36sUT1mDvtcS78vkjzjzj+xUvxiDbvejHwgTT7uEb3oz/4qkGrhqadAAAAGHRSTlMAvISA349QIJ/vn68Yv2BAQM8wWOeXz3CFJ6ihAAADbklEQVR4XoyVWZLqMBRD7VRMAgTogoZeh+dMwP539WjHsYp+HtBfSuIYdM0NedelOuGhObJDLb3qAzs28E7VhWTUCiGqxdjsAgOqd5vFrV7BNs05i191hDRsKxPasoaQzgXPSdDF+e3XXma1/2pdMP3jKuGkZEFqyVWZipymEmhysUxJVCx65jlPH6NJkPAyeZBZcylOJ1Y9VsBd+cKUuq+cR4h1CdA1JPggrdKjcY2FVsyolZUDD7FrnLPTIsi4dGjsCYcbOHoX5UgtotIy5fTyf1J31SOPx62UNu7wUV87ME4/Ff0WST1QcFTftPo5vTBnMFIckNK0M6FFzkckClCOUyZR0hY4H5Ja0tEyp0yi3e/Ubgl3lH80JoI3v5/3Np7gwztn4PHz7N7v+FcmjurfQX0c83IaB2LLcX38UkM2dtTgLOZAfs/r2HGlhvRibd17J/fFFTgq9+M37l+PRfwmrO+i77ZA7YPxkTyxqGPi3q3dzBbBnXE41reBP83wV7shR1SAhhVQ6q89KfSOEo+EhfsPDi4W1giuDSYIWzJykGH64ADFrX/iAQMS5i8PoesZnIDqpzm8hO7z1AcMSHNoG9MFpySQcD8CaPyYE/0EQIPBPS0J/wUz/KvGXnZUBYIADFfSCmFONMOu5NLI/a4mrGYx7/9ax9Om1AJLW3fnW7gw5k+XHSANDxm/9KW1H/oHKfS5/yrUhRaBfdgvQiv+ixYR44POe6nR5/oQI2K6Z50VbFgowqs2jXQWGr35zHSUtngVsdAG1iyEb2ChNWzZZB+HtuAuQscyqRoUxVVSHhchF2A1H62pd2djOSRJYDTBRZIM5bg7q5t5aEU3fxLjWbV7oTIrowjd/B2+a7QmWd0sd82hByTJ0ShKuVMWaOTTjUePbDabUR0fZ45mLDYZPbL5vmVIgmExYD0ESDK+ZwY7nrV4EySnkSLjKQnwpmUHOLj4ZhctWunuQ9/XwwMfzkLG9564nnDhCvjWey5cqUksyR2i4I7PShqf0qzjg8GHI3mBoiKfhMEMZ2L2BxQc9hPjwIyauDDFB9Jw4tSjg99MFxXIFFE3zQhHyIVQpzEacappMWJHLsmoI1DvdRSIHM8+4znwhOvbdnwXnlNWi/IUvORa/OdfLth4/SIK7Lx8NWbJ4mWdLfn1oewvWmXuA4BdPx0AAAAASUVORK5CYII=', 'base64'),
  '😘': Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAwFBMVEVHcEz/zE3/zE3/zE3/zE3/zE3/zE3/zE3/zE3/zE3/zE3/zE3/zE3dLkTdLkTdLkTdLkTdLkTiQkXdLkTdLkTdLkTrYD3/wkXdLkT/zE1mRQDdLkT/rDOziSf1xEjZqjrPojWfeB15VgqDXg7GmTBwTQWpgCKWbxifeB3su0OWbxj/tDr/xkj/vUHiQkPqX0D/rzX8njX/tjv/uj3ufUm8kSvmVkblTUL1hzfubD79wkz0m0r3pUvfNkPykUr5rEqPNarcAAAAGXRSTlMAUL9g34+AIJ/vr0DP7zDPvxiA32BQn5+fqGZe6gAAAtxJREFUeF69mOdy2zAMgGVb03bSdBfa23tkz7bv/1ZVKTY4hQcKyvX8/bR8n0EChGgYGpyJNTZBYo6tiWO8g5FrgoLpjoZZHMsDAs/ixzWbgpbpjBeNC724jKhsDxh4dl84c2Ay1wY18oCNp0mgDYMgl+fCQNw+T1xmue/7EctEexaZL2HERO/Pau2/8p59GknPbYWeCBi8yZ3T5j3+F05ep0kMHLxuPc1bT9FqsgXwmasbJD1L1LCwlYUV2p2JEwG5OMx8LTwl4Yl8SZ6lVA3M2oVpPeAjfhV1EzGToimKStCKUNWJaipTj8HXQBL5XTJAoN0lCwawSjNZskWMIkuIPBhImbcmFHl4ODqkzTfzFEjiNsF196C4qscXpLqghCnuVICp/F4lMxP3mVBsYs6QiHX66+5zx5goosKXFMBnoiYf6MZWLsWhLkHFMsYa0aqjWWCoan8YGyY3okWFDyrFZBrAEKGHNqGI3mxsekge0yI6/fghEqkiVkH+/WwZJYJo+fepKmIdkarTzOKoYojw0LJBEc3pRSb8F0w8IoP4dbi7e3zpHBELhvN7HwjunvDQYhvRNJ6iqSDU7C5/BpJ7wDbiQA+ZLM9M9oJNeAheucHG1r/bSVnn2Oyvw8sA2T8939y8AJjcK+hiLV+K2zB8CN6yf3aV15G+2yewC8PHQOXTgBdkIY78lRCpnOMrmyfaEKIfjcjhLy2FIyE6w2uNllg0tiWQEQV40aJJbte+8MRC9ECKDLensluNaFBXoagjhQ94GeVVdpP+cE/kv8FmV/a2ER2ogBrm3MqGI64NOTvHmzazsuG6Ceme8jSMmAUJ21DJ28VH/t9QFMHmTUifvxpdXFZltyFha7v4Yii4nMoWpSQXtz98w0URJqqyBcew4TI8Xn83CGxdZRcpSLabzdVutwWbO0DAys7XtytqgMAfaSQrYqRxiiELf+xzikEUfzR20mHd+8eHfwAwbKSgoKyy5QAAAABJRU5ErkJggg==', 'base64'),
  '🥰': Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAwFBMVEVHcEzdLkT/zE3dLkT/zE3/zE3dLkT/zE3/zE3/zE3dLkT/zE3/zE3dLkTdLkTdLkTdLkT/zE3eMET/xkjdLkT/x0jdLkTdLkT/zE3dLkTdLkTiQEL/rDP/zE3/rDPdLkTtu0P/ykv/xEifeB3xfz/YqTn/tDrGmTDjQ0L/rzX/vkHisz/nUUHfNkOxhyZwTQX1xEj5kzaDXg7vbjv9pDTrYkB5Vgr/uUCWbxj7nDW8kSv5rktmRQCMZxP0m0rxjEmleXe5AAAAHXRSTlMAv1AQ74/vIN+fIL9ggFBjz4CfQI+vQDDP36/fn5xhyBoAAANOSURBVHhe7ZjXcuMgFECxrWa5xDVxsgvq7r23JP//VwvGUWLgonh3Z/ZlzxNzMzlzC8hCSINdNksOvuKUzLJNg24ll2tV0cfqEWWRLzpYwik2vAs1F7X4KlfQ5mIaWEGw23hXLGbkTtjUbGMlQTf2FDSgbIoYoEv6ngp1SnUD8oSEeEpUDbc7GGR4hyhvYJju90V1jLUioEeu6OFd1pW2UXmeQQ/c7IVKVAE8MANCxrLHKsD9gWs7yKIHYV44m4CmtBI9OWH/CHOHuiQVNzHsG1EHf4sdIev+jeeEO0CD9HSZ6caDcR0uDCZgprS6PvNgwwYnrzelHd+EPFZEV5qAAOwTWdCk+m9pqIk4bXwX4YCp3vEnbe6x8b0Mu8PgJsC7ZOI/xkQM9cjmSTIHYjIGeDhG+zNlPwJiEnlg9r3zlR4QE2E7wIE83ATEBBzlzEbnL4zAmDC3shxcMsGr778y0RKICZQVw++l/38x9YCYuAFKUowlMvPZyp+xNJQxkZLc6/mZMuXrKVsDMbHbWIKJfL702RqICSDl8HvCWooBovv5t6L/IufveBz5iGy3SZYg2W7lI2IqNvbe12n8vWJrm+JjhJ+l2XQOaeZTdmqn8mPEVpx+RjRSaUYRtahOv40Ux395vrA8ChX6x4+/SPk6/OGvMHG20TG5ZDZKjtGWRbhH+fDPY8AEwT1h8BbHJxyEp/f4LcwDP5DzCPZE1BPsyKLvUcbrjUeZVMGf7N5MrZn1+LvNYeJdmHicJyqyw3hM3as16YanDVvGhHT9SJ0O8Or+QkVV6yqP03fW/oKQoR8JWc2i6xgHissE9Xgp43Q1OVATxsk0bfty+nlyCCETSVSwPBVjQgYBDgKM/YTiY7rWXQGe0YOnhhWnuSetpPvoCyBa0YbfcZd4RDmdCGIgji2Hfk8UCjcAy0WoBYhiQnbau8Tiy+CqCIHN5vPXmeLJzU2roPb0L+OnZOdkUQ+jAVemZTgghx/UU3tCHBdOSE+w+4mqLw8opQJvRz11JFCTPBs+ey1GHom4lljYOruwjo1knizJE2akw8vSm54XmZ4iT0dvqhWabX1d7SaCcT863ihAn8Y4hmkjPRWLlVXN+FiXR9m4rVylkPH5EOYXFgQ0NJT3iZAAAAAASUVORK5CYII=', 'base64')
};

// ── Build background for a variant (pure sharp, no SVG — Vercel compatible) ──
async function buildBgBuffer(
  fill: { r: number; g: number; b: number },
  grad: { r: number; g: number; b: number },
  _style: StyleGroup,
  canvas: number,
): Promise<Buffer> {
  // Create base solid color background
  const base = await sharp({
    create: { width: canvas, height: canvas, channels: 4, background: { ...fill, alpha: 255 } }
  }).png().toBuffer();

  // Create a gradient-like overlay using the grad color with transparency
  const overlay = await sharp({
    create: { width: canvas, height: Math.round(canvas / 2), channels: 4, background: { ...grad, alpha: 80 } }
  }).png().toBuffer();

  // Composite gradient overlay onto base
  return sharp(base)
    .composite([{ input: overlay, top: Math.round(canvas / 2), left: 0, blend: 'over' }])
    .png()
    .toBuffer();
}

// ── Scoring functions ────────────────────────────────────────

function scoreBgComplexity(complexity: 'high' | 'medium' | 'low'): number {
  return complexity === 'high' ? 100 : complexity === 'medium' ? 60 : 20;
}

function scoreEdgeConfusion(bgType: string): number {
  const high = ['floral', 'dark_floral', 'bokeh', 'abstract', 'ai_mixed', 'luxury'];
  const med  = ['gradient', 'blur', 'color_block'];
  if (high.includes(bgType)) return 90 + Math.floor(Math.random() * 10);
  if (med.includes(bgType))  return 55 + Math.floor(Math.random() * 15);
  return 30;
}

function scoreFileSize(kb: number): number {
  if (kb <= 150) return 100;
  if (kb <= 250) return 95;
  if (kb <= 350) return 85;
  if (kb <= 500) return 70;
  if (kb <= 1000) return 50; // Under 1MB
  return 0;
}

function scoreCoverage(coverage: number, style: StyleGroup): number {
  // Style A: 58-62% optimal
  if (style === 'A') {
    if (coverage <= 59) return 100;
    if (coverage <= 61) return 85;
    return 65;
  }
  // Style B: 64-68% optimal (higher coverage but busy bg compensates)
  if (coverage <= 65) return 95;
  if (coverage <= 67) return 80;
  return 60;
}

function scoreVisualContrast(bgType: string, coverage: number): number {
  const darkBgs = ['dark_floral', 'luxury', 'bokeh', 'ai_mixed'];
  const base = darkBgs.includes(bgType) ? 85 : 60;
  return Math.min(100, base + Math.floor((100 - coverage) / 5));
}

function calcShippingOptScore(
  coverageScore: number,
  bgScore: number,
  edgeConfusionScore: number,
  fileSizeScore: number,
  contrastScore: number,
): number {
  return Math.round(
    coverageScore  * 0.40 +
    bgScore        * 0.25 +
    edgeConfusionScore      * 0.15 +
    fileSizeScore  * 0.10 +
    contrastScore  * 0.10,
  );
}

// ── Generated variant interface ──────────────────────────────
export interface GeneratedVariant {
  id: string;
  filename: string;
  variantName: string;
  styleGroup: StyleGroup;
  coverage: number;
  bgId: string;
  bgName: string;
  bgType: string;
  bgComplexity: 'high' | 'medium' | 'low';
  bgColor: string;
  fileSizeKB: number;
  quality: number;
  width: number;
  height: number;
  // Scoring
  coverageScore: number;
  bgScore: number;
  edgeConfusionScore: number;
  fileSizeScore: number;
  visualContrastScore: number;
  shippingOptScore: number;
  confidence: number;
  // Dynamic prompt
  masterPrompt: string;
  buffer: Buffer; // Hold image directly in memory
}

// ── Main export ──────────────────────────────────────────────
export async function generateVariants(
  inputBuffer: Buffer,
  category: string,
): Promise<GeneratedVariant[]> {
  const CANVAS = 1024;
  const variants: GeneratedVariant[] = [];
  let lastError: unknown;

  const transparentBuffer = await removeImageBackground(inputBuffer);

  // Iterate over GENERATION_ORDER as specified
  for (const variantId of GENERATION_ORDER) {
    const bg = BACKGROUND_VARIANTS.find(b => b.id === variantId);
    if (!bg) continue;

    const emojiSet = EMOJI_SETS[bg.emojiSetIndex];
    const coverage = bg.coverage;
    const quality = 70; // Lowered to 70 to avoid 4.5MB Vercel serverless payload limit

    const productSize = Math.round(CANVAS * coverage / 100);
    const filename    = `${variantId.toLowerCase()}_${bg.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const productName = category || "Product";

    try {
      // 1. Resize product preserving transparency
      const resizedProduct = await sharp(transparentBuffer, { failOn: 'none' })
        .resize(productSize, productSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // 2. Build rich floral background
      const bgBuffer = await buildBgBuffer(
        bg.fillColor,
        bg.gradColor,
        bg.style,
        CANVAS,
      );

      // 3. Build emoji stickers overlay — positioned on product, overlapping edges
      const offset = Math.round((CANVAS - productSize) / 2);
      const emojiSize = bg.style === 'B' ? 104 : 88;  // Style B has bigger emojis

      // Position emojis directly overlapping the corners of the product boundary
      const emojiX1 = offset - Math.round(emojiSize / 4);
      const emojiY1 = offset - Math.round(emojiSize / 4);
      
      const emojiX2 = offset + productSize - emojiSize + Math.round(emojiSize / 4);
      const emojiY2 = offset - Math.round(emojiSize / 4);
      
      const emojiX3 = offset - Math.round(emojiSize / 4);
      const emojiY3 = offset + productSize - emojiSize + Math.round(emojiSize / 4);
      
      const emojiX4 = offset + productSize - emojiSize + Math.round(emojiSize / 4);
      const emojiY4 = offset + productSize - emojiSize + Math.round(emojiSize / 4);

      const eTL = await makeSticker(emojiSet.topLeft, emojiSize, bg.gradColor);
      const eTR = await makeSticker(emojiSet.topRight, emojiSize, bg.gradColor);
      const eBL = await makeSticker(emojiSet.bottomLeft, emojiSize, bg.gradColor);
      const eBR = await makeSticker(emojiSet.bottomRight, emojiSize, bg.gradColor);

      // 4. Composite: background → product → emojis
      const result = await sharp(bgBuffer)
        .composite([
          { input: resizedProduct, top: offset, left: offset },
          { input: eTL, top: emojiY1, left: emojiX1 },
          { input: eTR, top: emojiY2, left: emojiX2 },
          { input: eBL, top: emojiY3, left: emojiX3 },
          { input: eBR, top: emojiY4, left: emojiX4 },
        ])
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      const fileSizeKB = Math.round(result.length / 1024);
      
      // Ensure file size is logged if > 1MB
      if (fileSizeKB > 1024) {
          console.warn(`Variant ${variantId} is larger than 1MB: ${fileSizeKB}KB`);
      }

      // 5. Generate Master Prompt for this variant
      const masterPrompt = generateMasterPrompt(productName, bg, emojiSet);

      // 6. Compute all scores
      const coverageScore      = scoreCoverage(coverage, bg.style);
      const bgScore            = scoreBgComplexity(bg.complexity);
      const edgeConfusionScore = scoreEdgeConfusion(bg.type);
      const fileSizeScore      = scoreFileSize(fileSizeKB);
      const visualContrastScore = scoreVisualContrast(bg.type, coverage);
      const shippingOptScore   = calcShippingOptScore(
        coverageScore, bgScore, edgeConfusionScore, fileSizeScore, visualContrastScore,
      );
      const confidence = Math.min(99, Math.round(shippingOptScore * 0.85 + Math.random() * 10 + 5));

      variants.push({
        id: variantId,
        filename,
        variantName: bg.name,
        styleGroup: bg.style,
        coverage,
        bgId:         bg.name.toLowerCase().replace(/\\s+/g, '-'),
        bgName:       bg.name,
        bgType:       bg.type,
        bgComplexity: bg.complexity,
        bgColor:      `rgb(${bg.fillColor.r},${bg.fillColor.g},${bg.fillColor.b})`,
        fileSizeKB,
        quality,
        width: CANVAS,
        height: CANVAS,
        coverageScore,
        bgScore,
        edgeConfusionScore,
        fileSizeScore,
        visualContrastScore,
        shippingOptScore,
        confidence,
        masterPrompt,
        buffer: result,
      });
    } catch (err) {
      console.error(`Variant ${variantId} failed:`, err);
      lastError = err;
    }
  }

  if (variants.length === 0 && lastError) {
    throw new Error(`All variants failed. Last error: ${(lastError as Error).message}`);
  }

  return variants;
}

export function getFoldRule(category: string): string {
  const rules: Record<string, string> = {
    saree: 'folded', bedsheet: 'folded_tight', default: 'original',
  };
  return rules[category] || rules.default;
}
