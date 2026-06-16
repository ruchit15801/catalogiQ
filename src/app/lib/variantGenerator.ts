// ============================================================
// VARIANT GENERATOR — Sharp.js • 10 rich backgrounds • Full scoring
// ============================================================

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// ── Background definitions ──────────────────────────────────
export const BG_PACKS: {
  id: string;
  name: string;
  type: string;
  complexity: 'high' | 'medium' | 'low';
  fill: { r: number; g: number; b: number };
  gradient?: { r2: number; g2: number; b2: number };
}[] = [
  {
    id: 'floral-background',
    name: 'Floral Background',
    type: 'floral',
    complexity: 'high',
    fill: { r: 255, g: 236, b: 240 },
    gradient: { r2: 255, g2: 192, b2: 203 },
  },
  {
    id: 'warm-gradient',
    name: 'Warm Gradient',
    type: 'gradient',
    complexity: 'medium',
    fill: { r: 255, g: 220, b: 180 },
    gradient: { r2: 255, g2: 160, b2: 100 },
  },
  {
    id: 'premium-dark-floral',
    name: 'Premium Dark Floral',
    type: 'dark_floral',
    complexity: 'high',
    fill: { r: 30, g: 20, b: 40 },
    gradient: { r2: 60, g2: 10, b2: 80 },
  },
  {
    id: 'bokeh-background',
    name: 'Bokeh Background',
    type: 'bokeh',
    complexity: 'high',
    fill: { r: 20, g: 30, b: 80 },
    gradient: { r2: 80, g2: 20, b2: 120 },
  },
  {
    id: 'color-block',
    name: 'Color Block Background',
    type: 'color_block',
    complexity: 'medium',
    fill: { r: 245, g: 230, b: 255 },
    gradient: { r2: 200, g2: 230, b2: 255 },
  },
  {
    id: 'abstract-pattern',
    name: 'Abstract Pattern Background',
    type: 'abstract',
    complexity: 'high',
    fill: { r: 240, g: 250, b: 220 },
    gradient: { r2: 180, g2: 240, b2: 200 },
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark Background',
    type: 'luxury',
    complexity: 'high',
    fill: { r: 15, g: 15, b: 25 },
    gradient: { r2: 40, g2: 30, b2: 60 },
  },
  {
    id: 'dual-tone-gradient',
    name: 'Dual Tone Gradient',
    type: 'gradient',
    complexity: 'medium',
    fill: { r: 255, g: 200, b: 220 },
    gradient: { r2: 200, g2: 220, b2: 255 },
  },
  {
    id: 'soft-blur',
    name: 'Soft Blur Background',
    type: 'blur',
    complexity: 'medium',
    fill: { r: 230, g: 240, b: 255 },
    gradient: { r2: 220, g2: 255, b2: 240 },
  },
  {
    id: 'ai-mixed',
    name: 'AI Optimized Mixed Background',
    type: 'ai_mixed',
    complexity: 'high',
    fill: { r: 25, g: 25, b: 50 },
    gradient: { r2: 80, g2: 40, b2: 100 },
  },
];

// Coverage targets — always target 55–60% for best shipping score
const COVERAGE_TARGETS = [55, 57, 59];

export interface GeneratedVariant {
  id: string;
  filename: string;
  variantName: string;
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

// ── Scoring helpers ─────────────────────────────────────────

function scoreCoverage(coverage: number): number {
  if (coverage >= 55 && coverage <= 60) return 100;
  if (coverage > 60 && coverage <= 65) return 70;
  if (coverage > 65) return 40;
  if (coverage >= 50 && coverage < 55) return 75;
  return 30;
}

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
  if (kb <= 200) return 100;
  if (kb <= 350) return 85;
  if (kb <= 500) return 70;
  if (kb <= 800) return 50;
  return 0; // penalty
}

function scoreVisualContrast(bgType: string, coverage: number): number {
  const darkBgs = ['premium-dark-floral', 'luxury-dark', 'bokeh-background', 'ai-mixed'];
  const base = darkBgs.some(d => bgType.includes(d.split('-')[0])) ? 80 : 60;
  return Math.min(100, base + (coverage - 50));
}

function calcShippingOptScore(
  coverageScore: number,
  bgScore: number,
  edgeScore: number,
  fileSizeScore: number,
  contrastScore: number
): number {
  return Math.round(
    coverageScore  * 0.40 +
    bgScore        * 0.25 +
    edgeScore      * 0.15 +
    fileSizeScore  * 0.10 +
    contrastScore  * 0.10
  );
}

// ── Build gradient background as flat SVG overlay ───────────
async function buildBgBuffer(
  bg: typeof BG_PACKS[0],
  canvas: number
): Promise<Buffer> {
  const { r, g, b } = bg.fill;
  const g2 = bg.gradient || { r2: r, g2: g, b2: b };

  let svgContent = '';

  if (bg.type === 'floral' || bg.type === 'dark_floral') {
    // Gradient + decorative circles to simulate floral texture
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgb(${r},${g},${b})"/>
          <stop offset="100%" stop-color="rgb(${g2.r2},${g2.g2},${g2.b2})"/>
        </linearGradient>
      </defs>
      <rect width="${canvas}" height="${canvas}" fill="url(#g)"/>
      ${Array.from({length: 28}, (_,i) => {
        const cx = (i * 79) % canvas;
        const cy = (i * 113) % canvas;
        const rad = 18 + (i % 5) * 10;
        const op = 0.12 + (i % 4) * 0.06;
        return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="rgb(${Math.min(255,r+40)},${Math.min(255,g+40)},${Math.min(255,b+40)})" opacity="${op}"/>`;
      }).join('')}
    </svg>`;
  } else if (bg.type === 'bokeh') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">
      <defs>
        <radialGradient id="g">
          <stop offset="0%" stop-color="rgb(${r},${g},${b})"/>
          <stop offset="100%" stop-color="rgb(${g2.r2},${g2.g2},${g2.b2})"/>
        </radialGradient>
      </defs>
      <rect width="${canvas}" height="${canvas}" fill="url(#g)"/>
      ${Array.from({length: 22}, (_,i) => {
        const cx = (i * 97 + 30) % canvas;
        const cy = (i * 137 + 20) % canvas;
        const rad = 20 + (i % 6) * 15;
        const op = 0.08 + (i % 5) * 0.07;
        return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="white" opacity="${op}"/>`;
      }).join('')}
    </svg>`;
  } else if (bg.type === 'abstract') {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgb(${r},${g},${b})"/>
          <stop offset="100%" stop-color="rgb(${g2.r2},${g2.g2},${g2.b2})"/>
        </linearGradient>
      </defs>
      <rect width="${canvas}" height="${canvas}" fill="url(#g)"/>
      ${Array.from({length: 12}, (_,i) => {
        const x1 = (i * 83) % canvas;
        const y1 = (i * 61) % canvas;
        const x2 = (i * 113 + 100) % canvas;
        const y2 = (i * 79 + 80) % canvas;
        const op = 0.10 + (i % 4) * 0.05;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgb(${Math.min(255,r-30)},${Math.min(255,g-30)},${Math.min(255,b-30)})" stroke-width="${3 + i % 4}" opacity="${op}"/>`;
      }).join('')}
    </svg>`;
  } else if (bg.type === 'color_block') {
    const half = Math.round(canvas / 2);
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">
      <rect width="${canvas}" height="${canvas}" fill="rgb(${r},${g},${b})"/>
      <rect x="${half}" width="${half}" height="${canvas}" fill="rgb(${g2.r2},${g2.g2},${g2.b2})" opacity="0.85"/>
    </svg>`;
  } else {
    // Gradient (warm, dual-tone, soft-blur, luxury, ai-mixed)
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgb(${r},${g},${b})"/>
          <stop offset="100%" stop-color="rgb(${g2.r2},${g2.g2},${g2.b2})"/>
        </linearGradient>
      </defs>
      <rect width="${canvas}" height="${canvas}" fill="url(#g)"/>
    </svg>`;
  }

  return await sharp(Buffer.from(svgContent))
    .resize(canvas, canvas)
    .png()
    .toBuffer();
}

// ── Main export ─────────────────────────────────────────────

export async function generateVariants(
  inputBuffer: Buffer,
  _category: string,
  outputDir: string
): Promise<GeneratedVariant[]> {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const CANVAS = 512; // exactly 512×512 as spec
  const qualities = [75, 82];
  const variants: GeneratedVariant[] = [];

  for (const bg of BG_PACKS) {
    for (const coverage of COVERAGE_TARGETS) {
      for (const quality of qualities) {
        const productSize = Math.round(CANVAS * coverage / 100);
        const variantId   = `${bg.id}_c${coverage}_q${quality}`;
        const filename    = `${variantId}.jpg`;
        const outPath     = path.join(outputDir, filename);

        try {
          // 1. Resize product to target coverage, preserve transparency
          const resizedProduct = await sharp(inputBuffer)
            .resize(productSize, productSize, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer();

          // 2. Build rich background
          const bgBuffer = await buildBgBuffer(bg, CANVAS);

          // 3. Composite product centered on background
          const offset = Math.round((CANVAS - productSize) / 2);
          const result = await sharp(bgBuffer)
            .composite([{ input: resizedProduct, top: offset, left: offset }])
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();

          fs.writeFileSync(outPath, result);
          const fileSizeKB = Math.round(result.length / 1024);

          // 4. Compute all scores
          const coverageScore    = scoreCoverage(coverage);
          const bgScore          = scoreBgComplexity(bg.complexity);
          const edgeConfusionScore = scoreEdgeConfusion(bg.type);
          const fileSizeScore    = scoreFileSize(fileSizeKB);
          const visualContrastScore = scoreVisualContrast(bg.id, coverage);
          const shippingOptScore = calcShippingOptScore(
            coverageScore, bgScore, edgeConfusionScore, fileSizeScore, visualContrastScore
          );
          const confidence = Math.min(99, Math.round(shippingOptScore * 0.85 + Math.random() * 10 + 5));

          variants.push({
            id: variantId,
            filename,
            variantName: bg.name,
            coverage,
            bgId: bg.id,
            bgName: bg.name,
            bgType: bg.type,
            bgComplexity: bg.complexity,
            bgColor: `rgb(${bg.fill.r},${bg.fill.g},${bg.fill.b})`,
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
