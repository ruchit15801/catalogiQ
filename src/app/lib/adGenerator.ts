import sharp from 'sharp';
import { normalizeImageBuffer } from './imageUtils';

const CANVAS = 1024;

export interface AdVariantDef {
  id: string;
  name: string;
  type: 'simple' | 'premium';
  promptTheme: string;
  bgColor: { r: number; g: number; b: number };
  accentColor: { r: number; g: number; b: number };
}

export const AD_VARIANTS: AdVariantDef[] = [
  // SIMPLE
  {
    id: 'AD_S1',
    name: 'Clean Studio White',
    type: 'simple',
    promptTheme: 'Minimalist white photography studio, soft diffuse lighting, clean white infinite backdrop, highly professional ecommerce style, hyperrealistic, 8k.',
    bgColor: { r: 248, g: 250, b: 252 },
    accentColor: { r: 226, g: 232, b: 240 },
  },
  {
    id: 'AD_S2',
    name: 'Soft Pastel Platform',
    type: 'simple',
    promptTheme: 'Soft pastel pink and blue gradient studio backdrop, a clean round pedestal, aesthetic minimalist lighting, calming ecommerce ad style, photorealistic.',
    bgColor: { r: 252, g: 231, b: 243 },
    accentColor: { r: 224, g: 231, b: 255 },
  },
  // PREMIUM
  {
    id: 'AD_P1',
    name: 'Dark Silk & Gold',
    type: 'premium',
    promptTheme: 'Deep luxury dark charcoal silk fabric background, glowing gold accents, dramatic moody studio lighting, highly premium commercial ad, hyperdetailed 8k.',
    bgColor: { r: 15, g: 23, b: 42 },
    accentColor: { r: 51, g: 65, b: 85 },
  },
  {
    id: 'AD_P2',
    name: 'Golden Hour Sunlight',
    type: 'premium',
    promptTheme: 'Warm golden hour sunlight filtering through a window, harsh aesthetic shadows, natural lifestyle setting, premium organic ad photography, 8k.',
    bgColor: { r: 254, g: 243, b: 199 },
    accentColor: { r: 245, g: 158, b: 11 },
  },
  {
    id: 'AD_P3',
    name: 'Neon Cyberpunk',
    type: 'premium',
    promptTheme: 'Dark neon cyberpunk aesthetic, glowing purple and blue neon lights on a sleek reflective black platform, highly modern and futuristic ad style.',
    bgColor: { r: 76, g: 29, b: 149 },
    accentColor: { r: 0, g: 0, b: 0 },
  },
  {
    id: 'AD_P4',
    name: 'Ethereal Cloud',
    type: 'premium',
    promptTheme: 'Floating on soft white ethereal clouds, heavenly bright light, dreamy aesthetic, high-end surreal fashion and beauty ad style, photorealistic.',
    bgColor: { r: 240, g: 249, b: 255 },
    accentColor: { r: 125, g: 211, b: 252 },
  },
  {
    id: 'AD_P5',
    name: 'Clean Marble Surface',
    type: 'premium',
    promptTheme: 'Luxurious white carrara marble countertop, soft natural light, minimalist elegant aesthetic, premium high-end catalog photography, 8k resolution.',
    bgColor: { r: 248, g: 250, b: 252 },
    accentColor: { r: 241, g: 245, b: 249 },
  }
];

export async function generateAdVariants(
  inputBuffer: Buffer,
  productName: string,
  plan: 'free' | 'paid'
) {
  // 1. Remove background — skip on Vercel (will fallback to original)
  let transparentBuffer = inputBuffer;
  try {
    const { removeBackground } = await import('@imgly/background-removal-node');
    const blob = new Blob([new Uint8Array(inputBuffer)], { type: 'image/png' });
    const { pathToFileURL } = await import('url');
    const path = await import('path');
    const config = {
      publicPath: pathToFileURL(path.resolve('./node_modules/@imgly/background-removal-node/dist/')).href + "/",
    };
    const bgRemBlob = await removeBackground(blob, config);
    const arrayBuffer = await bgRemBlob.arrayBuffer();
    if (arrayBuffer.byteLength > 1024) {
      transparentBuffer = await normalizeImageBuffer(Buffer.from(arrayBuffer));
    } else {
      throw new Error("Background removal returned corrupted blob");
    }
  } catch (err) {
    console.warn('Background removal skipped for Ad:', err);
  }

  // Determine variants to generate
  const targetVariants = plan === 'paid' ? AD_VARIANTS : AD_VARIANTS.filter(v => v.type === 'simple');
  const results = [];

  // Product coverage in ads is usually smaller to make room for text (e.g., 50%)
  const productSize = Math.round(CANVAS * 0.5);
  const offset = Math.round((CANVAS - productSize) / 2);

  const resizedProduct = await sharp(transparentBuffer, { failOn: 'none' })
    .resize(productSize, productSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  for (const variant of targetVariants) {
    // Master Prompt for GPT-4o
    const masterPrompt = `Create a highly professional advertising image for the uploaded ${productName}.

Visual Theme:
${variant.promptTheme}

Keep the main product completely unchanged, unbranded, and do not distort its shape or color.
Integrate the product naturally into the scene with appropriate contact shadows and reflections.
The output should look like a luxury high-end commercial advertisement.`;

    try {
      // Build background using pure sharp (NO SVG — Vercel compatible)
      const bgBuffer = await sharp({
        create: { width: CANVAS, height: CANVAS, channels: 4, background: { ...variant.bgColor, alpha: 255 } }
      }).png().toBuffer();

      // Accent strip at bottom
      const accentStrip = await sharp({
        create: { width: CANVAS, height: Math.round(CANVAS * 0.2), channels: 4, background: { ...variant.accentColor, alpha: 100 } }
      }).png().toBuffer();

      const finalImage = await sharp(bgBuffer)
        .composite([
          { input: accentStrip, top: Math.round(CANVAS * 0.8), left: 0, blend: 'over' },
          { input: resizedProduct, top: offset, left: offset },
        ])
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();

      results.push({
        id: variant.id,
        name: variant.name,
        type: variant.type,
        imageBase64: `data:image/jpeg;base64,${finalImage.toString('base64')}`,
        masterPrompt
      });
    } catch (e) {
      console.error('Failed to generate ad variant:', variant.name, e);
    }
  }

  return results;
}
