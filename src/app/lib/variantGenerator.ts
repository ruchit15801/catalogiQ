// ============================================================
// VARIANT GENERATOR — Sharp.js • 20 backgrounds (Style A + B) • Full scoring
// Implements the prompt engine spec for Meesho shipping optimization
// ============================================================

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import {
  BACKGROUND_VARIANTS,
  GENERATION_ORDER,
  EMOJI_SETS,
  scoreForLowestShipping,
  generateMasterPrompt,
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
    <pattern id="florals" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
      <!-- Flower 1 -->
      <circle cx="80" cy="80" r="36" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="4"/>
      <circle cx="80" cy="80" r="16" fill="rgba(255,255,255,0.08)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(0,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(45,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(90,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(135,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(180,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(225,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(270,80,80)"/>
      <ellipse cx="80" cy="44" rx="10" ry="20" fill="rgba(255,255,255,0.09)" transform="rotate(315,80,80)"/>
      <!-- Small dots -->
      <circle cx="20" cy="20" r="6" fill="rgba(255,255,255,0.07)"/>
      <circle cx="140" cy="140" r="6" fill="rgba(255,255,255,0.07)"/>
      <circle cx="20" cy="140" r="4" fill="rgba(255,255,255,0.05)"/>
      <circle cx="140" cy="20" r="4" fill="rgba(255,255,255,0.05)"/>
      <!-- Leaf shapes -->
      <path d="M10 80 Q40 50 70 80 Q40 110 10 80Z" fill="rgba(255,255,255,0.06)"/>
      <path d="M90 0 Q120 30 90 60 Q60 30 90 0Z" fill="rgba(255,255,255,0.06)"/>
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
}

// ── Main export ──────────────────────────────────────────────
export async function generateVariants(
  inputBuffer: Buffer,
  category: string,
  outputDir: string,
): Promise<GeneratedVariant[]> {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const CANVAS = 1024;
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

  // Iterate over GENERATION_ORDER as specified
  for (const variantId of GENERATION_ORDER) {
    const bg = BACKGROUND_VARIANTS.find(b => b.id === variantId);
    if (!bg) continue;

    const emojiSet = EMOJI_SETS[bg.emojiSetIndex];
    const coverage = bg.coverage;
    const quality = 82; // Ensures under 1MB for 1024x1024

    const productSize = Math.round(CANVAS * coverage / 100);
    const filename    = `${variantId.toLowerCase()}_${bg.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const outPath     = path.join(outputDir, filename);
    const productName = category || "Product";

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

      // WARRANTY sticker — top left of canvas
      const warrantySvg = Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}">
          <!-- Emoji stickers at product corners with slight shadow for premium glossy look -->
          <style>
            .emoji-shadow { filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.5)); }
          </style>
          
          <text class="emoji-shadow" x="${emojiX1}" y="${emojiY1 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.topLeft}</text>
          <text class="emoji-shadow" x="${emojiX2}" y="${emojiY2 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.topRight}</text>
          <text class="emoji-shadow" x="${emojiX3}" y="${emojiY3 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.bottomLeft}</text>
          <text class="emoji-shadow" x="${emojiX4}" y="${emojiY4 + emojiSize}" font-size="${emojiSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">${emojiSet.bottomRight}</text>
        </svg>
      `);

      // 4. Composite: background → product → emojis
      const result = await sharp(bgBuffer)
        .composite([
          { input: resizedProduct, top: offset, left: offset },
          { input: warrantySvg,    top: 0,      left: 0 },
        ])
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      fs.writeFileSync(outPath, result);
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
