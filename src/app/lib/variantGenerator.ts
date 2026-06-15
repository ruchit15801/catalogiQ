// ============================================================
// VARIANT GENERATOR — Sharp.js based image processing engine
// Generates 30-50 variants with different coverages, BGs, quality
// ============================================================

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Category-specific fold rules (affects coverage targets)
const FOLD_RULES: Record<string, string> = {
  'saree': 'folded',
  'bedsheet': 'folded_tight',
  'curtain': 'folded_tight',
  'yoga-mat': 'rolled',
  'necklace': 'coiled',
  'jeans': 'folded_thirds',
  'jacket': 'folded_compact',
  'default': 'original',
};

// Background packs — solid colors that work well on marketplaces
const BG_PACKS = [
  { id: 'pastel-pink',   fill: { r: 255, g: 214, b: 224 } },
  { id: 'mint-green',    fill: { r: 200, g: 247, b: 232 } },
  { id: 'lavender',      fill: { r: 237, g: 217, b: 255 } },
  { id: 'warm-coral',    fill: { r: 255, g: 160, b: 140 } },
  { id: 'soft-yellow',   fill: { r: 255, g: 244, b: 200 } },
  { id: 'sky-blue',      fill: { r: 200, g: 230, b: 255 } },
  { id: 'peach',         fill: { r: 255, g: 218, b: 185 } },
  { id: 'studio-white',  fill: { r: 248, g: 248, b: 248 } },
];

// Coverage targets per category — lower = smaller perceived product
const COVERAGE_MAP: Record<string, number[]> = {
  'saree':       [48, 52, 55, 58],
  'bedsheet':    [50, 54, 58, 62],
  'jewellery':   [42, 48, 52, 56],
  'electronics': [55, 58, 62, 65],
  'clothing':    [50, 55, 58, 62],
  'footwear':    [52, 56, 60, 64],
  'default':     [50, 55, 58, 62],
};

export interface GeneratedVariant {
  id: string;
  filename: string;
  coverage: number;
  bgId: string;
  bgColor: string;
  fileSizeKB: number;
  quality: number;
  width: number;
  height: number;
}

/**
 * Generate all image variants using Sharp.js.
 * Each variant has a different background, coverage %, and JPEG quality.
 */
export async function generateVariants(
  inputBuffer: Buffer,
  category: string,
  outputDir: string
): Promise<GeneratedVariant[]> {
  // Ensure output dir exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const coverages = COVERAGE_MAP[category] || COVERAGE_MAP['default'];
  const qualities = [72, 80]; // Two quality levels — lower = smaller file
  const CANVAS = 1024; // Standard marketplace image size
  const variants: GeneratedVariant[] = [];

  // Get original image metadata
  const metadata = await sharp(inputBuffer).metadata();
  const origWidth = metadata.width || CANVAS;
  const origHeight = metadata.height || CANVAS;

  for (const bg of BG_PACKS) {
    for (const coverage of coverages) {
      for (const quality of qualities) {
        const productSize = Math.round(CANVAS * coverage / 100);
        const variantId = `${bg.id}_c${coverage}_q${quality}`;
        const filename = `${variantId}.jpg`;
        const outPath = path.join(outputDir, filename);

        try {
          // Step 1: Resize product to target coverage size
          const resizedProduct = await sharp(inputBuffer)
            .resize(productSize, productSize, {
              fit: 'contain',
              background: { ...bg.fill, alpha: 0 },
            })
            .png() // intermediate PNG to preserve transparency
            .toBuffer();

          // Step 2: Create canvas with background color
          const canvas = sharp({
            create: {
              width: CANVAS,
              height: CANVAS,
              channels: 3,
              background: bg.fill,
            },
          });

          // Step 3: Composite product onto center of canvas
          const offset = Math.round((CANVAS - productSize) / 2);
          const result = await canvas
            .composite([{
              input: resizedProduct,
              top: offset,
              left: offset,
            }])
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();

          // Write to disk
          fs.writeFileSync(outPath, result);
          const stats = fs.statSync(outPath);

          variants.push({
            id: variantId,
            filename,
            coverage,
            bgId: bg.id,
            bgColor: `rgb(${bg.fill.r},${bg.fill.g},${bg.fill.b})`,
            fileSizeKB: Math.round(stats.size / 1024),
            quality,
            width: CANVAS,
            height: CANVAS,
          });
        } catch (err) {
          console.error(`Failed to generate variant ${variantId}:`, err);
          // Skip failed variants, continue with rest
        }
      }
    }
  }

  return variants;
}

/**
 * Get fold rule for a category
 */
export function getFoldRule(category: string): string {
  return FOLD_RULES[category] || FOLD_RULES['default'];
}

/**
 * Get available categories
 */
export function getCategories(): string[] {
  return Object.keys(COVERAGE_MAP).filter(k => k !== 'default');
}
