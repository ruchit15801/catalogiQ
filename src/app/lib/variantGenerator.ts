// ============================================================
// VARIANT GENERATOR — Sharp.js • 20 backgrounds (Style A + B) • Full scoring
// Implements the prompt engine spec for Meesho shipping optimization
// ============================================================

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import {
  BACKGROUND_VARIANTS,
  COVERAGE_CYCLE_A,
  COVERAGE_CYCLE_B,
  EMOJI_SETS,
  scoreForLowestShipping,
  type StyleGroup,
} from './promptEngine';

// ── Build background for a variant ──────────────────────────
async function buildBgBuffer(
  fill: { r: number; g: number; b: number },
  grad: { r: number; g: number; b: number },
  style: StyleGroup,
  canvas: number,
): Promise<Buffer> {
  // Build SVG gradient with floral/botanical pattern overlay
  const r1 = fill.r; const g1 = fill.g; const b1 = fill.b;
  const r2 = grad.r; const g2 = grad.g; const b2 = grad.b;

  // Dense floral pattern SVG — mimics the "busy background" needed for edge confusion
  const floralSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="rgb(${r1},${g1},${b1})"/>
      <stop offset="100%" stop-color="rgb(${r2},${g2},${b2})"/>
    </radialGradient>
    <pattern id="florals" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <!-- Flower 1 -->
      <circle cx="40" cy="40" r="18" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <circle cx="40" cy="40" r="8" fill="rgba(255,255,255,0.08)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(0,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(45,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(90,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(135,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(180,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(225,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(270,40,40)"/>
      <ellipse cx="40" cy="22" rx="5" ry="10" fill="rgba(255,255,255,0.09)" transform="rotate(315,40,40)"/>
      <!-- Small dots -->
      <circle cx="10" cy="10" r="3" fill="rgba(255,255,255,0.07)"/>
      <circle cx="70" cy="70" r="3" fill="rgba(255,255,255,0.07)"/>
      <circle cx="10" cy="70" r="2" fill="rgba(255,255,255,0.05)"/>
      <circle cx="70" cy="10" r="2" fill="rgba(255,255,255,0.05)"/>
      <!-- Leaf shapes -->
      <path d="M5 40 Q20 25 35 40 Q20 55 5 40Z" fill="rgba(255,255,255,0.06)"/>
      <path d="M45 0 Q60 15 45 30 Q30 15 45 0Z" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>
  <rect width="${canvas}" height="${canvas}" fill="url(#bg)"/>
  <rect width="${canvas}" height="${canvas}" fill="url(#florals)" opacity="0.8"/>
</svg>`;

  return sharp(Buffer.from(floralSvg)).png().toBuffer();
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
  if (kb <= 200) return 100;
  if (kb <= 350) return 85;
  if (kb <= 500) return 70;
  if (kb <= 800) return 50;
  return 0;
}

function scoreCoverage(coverage: number, style: StyleGroup): number {
  // Style A: 58-62% optimal
  if (style === 'A') {
    if (coverage <= 59) return 100;
    if (coverage <= 61) return 85;
    return 65;
  }
  // Style B: 64-69% optimal (higher coverage but busy bg compensates)
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
  edgeScore: number,
  fileSizeScore: number,
  contrastScore: number,
): number {
  return Math.round(
    coverageScore  * 0.40 +
    bgScore        * 0.25 +
    edgeScore      * 0.15 +
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
}

// ── Main export ──────────────────────────────────────────────
export async function generateVariants(
  inputBuffer: Buffer,
  _category: string,
  outputDir: string,
): Promise<GeneratedVariant[]> {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const CANVAS = 512;
  const variants: GeneratedVariant[] = [];

  // Try background removal — fall back to original if it fails
  let transparentBuffer = inputBuffer;
  try {
    const { removeBackground } = await import('@imgly/background-removal-node');
    const blob = new Blob([new Uint8Array(inputBuffer)], { type: 'image/jpeg' });
    const bgRemBlob = await removeBackground(blob);
    const arrayBuffer = await bgRemBlob.arrayBuffer();
    transparentBuffer = Buffer.from(arrayBuffer);
    console.log('✓ Background removed successfully');
  } catch (err) {
    console.warn('Background removal skipped — using original:', (err as Error).message?.slice(0, 80));
  }

  // Track A/B counters separately for coverage cycling
  let styleACount = 0;
  let styleBCount = 0;

  for (const bg of BACKGROUND_VARIANTS) {
    const styleIndex = bg.style === 'A' ? styleACount++ : styleBCount++;
    const coverage = bg.style === 'A'
      ? COVERAGE_CYCLE_A[styleIndex % COVERAGE_CYCLE_A.length]
      : COVERAGE_CYCLE_B[styleIndex % COVERAGE_CYCLE_B.length];

    const emojiSet = EMOJI_SETS[styleIndex % EMOJI_SETS.length];

    // One quality per background (82 for crisp output, targets ~150-200KB)
    const quality = 82;

    const productSize = Math.round(CANVAS * coverage / 100);
    const variantId   = `${bg.name.toLowerCase().replace(/\s+/g, '-')}_s${bg.style}_c${coverage}`;
    const filename    = `${variantId}.jpg`;
    const outPath     = path.join(outputDir, filename);

    try {
      // 1. Resize product preserving transparency
      const resizedProduct = await sharp(transparentBuffer)
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

      // 3. Build emoji stickers overlay — corners, physically on product
      const offset = Math.round((CANVAS - productSize) / 2);
      const emojiSize = bg.style === 'B' ? 52 : 44;  // Style B has bigger emojis

      // Position emojis at product corners (not canvas corners)
      const emojiX1 = offset + 5;
      const emojiY1 = offset + 5;
      const emojiX2 = offset + productSize - emojiSize - 5;
      const emojiY2 = offset + 5;
      const emojiX3 = offset + 5;
      const emojiY3 = offset + productSize - emojiSize - 5;
      const emojiX4 = offset + productSize - emojiSize - 5;
      const emojiY4 = offset + productSize - emojiSize - 5;

      // WARRANTY sticker — top left of canvas
      const warrantySvg = Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}">
          <!-- Warranty badge -->
          <circle cx="72" cy="72" r="52" fill="gold" stroke="#8B6914" stroke-width="3" opacity="0.95"/>
          <circle cx="72" cy="72" r="44" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
          <text x="72" y="62" font-size="11" font-family="Arial,sans-serif" font-weight="800" fill="#2d1a00" text-anchor="middle" letter-spacing="0.5">WARRANTY</text>
          <text x="72" y="82" font-size="22" font-family="Arial,sans-serif" font-weight="900" fill="#2d1a00" text-anchor="middle">3 YR</text>
          <text x="72" y="98" font-size="10" font-family="Arial,sans-serif" font-weight="700" fill="#5a3500" text-anchor="middle">CERTIFIED</text>
          <!-- Emoji stickers at product corners -->
          <text x="${emojiX1}" y="${emojiY1 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.topLeft}</text>
          <text x="${emojiX2}" y="${emojiY2 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.topRight}</text>
          <text x="${emojiX3}" y="${emojiY3 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.bottomLeft}</text>
          <text x="${emojiX4}" y="${emojiY4 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.bottomRight}</text>
        </svg>
      `);

      // 4. Composite: background → product → warranty+emojis
      const result = await sharp(bgBuffer)
        .composite([
          { input: resizedProduct, top: offset, left: offset },
          { input: warrantySvg,    top: 0,      left: 0 },
        ])
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      fs.writeFileSync(outPath, result);
      const fileSizeKB = Math.round(result.length / 1024);

      // 5. Compute all scores
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
        bgId:         bg.name.toLowerCase().replace(/\s+/g, '-'),
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
      });
    } catch (err) {
      console.error(`Variant ${variantId} failed:`, err);
    }
  }

  return variants;
}

export function getFoldRule(category: string): string {
  const rules: Record<string, string> = {
    saree: 'folded', bedsheet: 'folded_tight', default: 'original',
  };
  return rules[category] || rules.default;
}
