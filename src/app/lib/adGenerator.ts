import sharp from 'sharp';
import path from 'path';

const CANVAS = 1024;

export interface AdVariantDef {
  id: string;
  name: string;
  type: 'simple' | 'premium';
  promptTheme: string;
  svgBackground: string;
  svgOverlay: string;
}

export const AD_VARIANTS: AdVariantDef[] = [
  // SIMPLE
  {
    id: 'AD_S1',
    name: 'Clean Studio White',
    type: 'simple',
    promptTheme: 'Minimalist white photography studio, soft diffuse lighting, clean white infinite backdrop, highly professional ecommerce style, hyperrealistic, 8k.',
    svgBackground: `<rect width="1024" height="1024" fill="#F8FAFC"/>`,
    svgOverlay: `
      <rect x="50" y="50" width="924" height="924" fill="none" stroke="#E2E8F0" stroke-width="2"/>
      <text x="512" y="100" font-family="sans-serif" font-size="24" font-weight="bold" fill="#64748B" text-anchor="middle" letter-spacing="8">NEW COLLECTION</text>
    `
  },
  {
    id: 'AD_S2',
    name: 'Soft Pastel Platform',
    type: 'simple',
    promptTheme: 'Soft pastel pink and blue gradient studio backdrop, a clean round pedestal, aesthetic minimalist lighting, calming ecommerce ad style, photorealistic.',
    svgBackground: `
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCE7F3" />
          <stop offset="100%" stop-color="#E0E7FF" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g1)"/>
    `,
    svgOverlay: `
      <text x="512" y="940" font-family="sans-serif" font-size="28" font-weight="bold" fill="#475569" text-anchor="middle" letter-spacing="4">ESSENTIALS</text>
    `
  },
  // PREMIUM
  {
    id: 'AD_P1',
    name: 'Dark Silk & Gold',
    type: 'premium',
    promptTheme: 'Deep luxury dark charcoal silk fabric background, glowing gold accents, dramatic moody studio lighting, highly premium commercial ad, hyperdetailed 8k.',
    svgBackground: `
      <defs>
        <radialGradient id="g2" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#0F172A" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g2)"/>
    `,
    svgOverlay: `
      <rect x="60" y="60" width="904" height="904" fill="none" stroke="#FBBF24" stroke-width="2" stroke-opacity="0.8"/>
      <rect x="412" y="45" width="200" height="30" fill="#0F172A"/>
      <text x="512" y="68" font-family="sans-serif" font-size="20" font-weight="bold" fill="#FBBF24" text-anchor="middle" letter-spacing="6">PREMIUM</text>
    `
  },
  {
    id: 'AD_P2',
    name: 'Golden Hour Sunlight',
    type: 'premium',
    promptTheme: 'Warm golden hour sunlight filtering through a window, harsh aesthetic shadows, natural lifestyle setting, premium organic ad photography, 8k.',
    svgBackground: `
      <defs>
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF3C7" />
          <stop offset="100%" stop-color="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g3)"/>
      <polygon points="0,0 1024,1024 0,1024" fill="rgba(0,0,0,0.05)"/>
    `,
    svgOverlay: `
      <text x="80" y="100" font-family="sans-serif" font-size="36" font-weight="900" fill="#78350F" letter-spacing="2">LATEST</text>
      <text x="80" y="140" font-family="sans-serif" font-size="36" font-weight="900" fill="#78350F" letter-spacing="2">ARRIVALS</text>
    `
  },
  {
    id: 'AD_P3',
    name: 'Neon Cyberpunk',
    type: 'premium',
    promptTheme: 'Dark neon cyberpunk aesthetic, glowing purple and blue neon lights on a sleek reflective black platform, highly modern and futuristic ad style.',
    svgBackground: `
      <defs>
        <radialGradient id="g4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4C1D95" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g4)"/>
    `,
    svgOverlay: `
      <text x="512" y="950" font-family="sans-serif" font-size="40" font-weight="bold" fill="#A78BFA" text-anchor="middle" letter-spacing="10">FUTURE IS NOW</text>
    `
  },
  {
    id: 'AD_P4',
    name: 'Ethereal Cloud',
    type: 'premium',
    promptTheme: 'Floating on soft white ethereal clouds, heavenly bright light, dreamy aesthetic, high-end surreal fashion and beauty ad style, photorealistic.',
    svgBackground: `
      <defs>
        <linearGradient id="g5" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#F0F9FF" />
          <stop offset="100%" stop-color="#7DD3FC" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#g5)"/>
    `,
    svgOverlay: `
      <circle cx="512" cy="512" r="450" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-opacity="0.5"/>
    `
  },
  {
    id: 'AD_P5',
    name: 'Clean Marble Surface',
    type: 'premium',
    promptTheme: 'Luxurious white carrara marble countertop, soft natural light, minimalist elegant aesthetic, premium high-end catalog photography, 8k resolution.',
    svgBackground: `
      <rect width="1024" height="1024" fill="#F8FAFC"/>
      <line x1="0" y1="800" x2="1024" y2="800" stroke="#E2E8F0" stroke-width="4"/>
      <rect x="0" y="800" width="1024" height="224" fill="#F1F5F9"/>
    `,
    svgOverlay: `
      <text x="512" y="90" font-family="serif" font-size="28" font-style="italic" fill="#334155" text-anchor="middle">Exclusive Collection</text>
    `
  }
];

export async function generateAdVariants(
  inputBuffer: Buffer,
  productName: string,
  plan: 'free' | 'paid'
) {
  // 1. Remove background
  let transparentBuffer = inputBuffer;
  try {
    const { removeBackground } = await import('@imgly/background-removal-node');
    const blob = new Blob([new Uint8Array(inputBuffer)], { type: 'image/jpeg' });
    const { pathToFileURL } = await import('url');
    const config = {
      publicPath: pathToFileURL(path.resolve('./node_modules/@imgly/background-removal-node/dist/')).href + "/",
    };
    const bgRemBlob = await removeBackground(blob, config);
    const arrayBuffer = await bgRemBlob.arrayBuffer();
    transparentBuffer = Buffer.from(arrayBuffer);
  } catch (err) {
    console.warn('Background removal skipped for Ad:', err);
  }

  // Determine variants to generate
  const targetVariants = plan === 'paid' ? AD_VARIANTS : AD_VARIANTS.filter(v => v.type === 'simple');
  const results = [];

  // Product coverage in ads is usually smaller to make room for text (e.g., 50%)
  const productSize = Math.round(CANVAS * 0.5);
  const offset = Math.round((CANVAS - productSize) / 2);

  const resizedProduct = await sharp(transparentBuffer)
    .resize(productSize, productSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  for (const variant of targetVariants) {
    // Background SVG
    const bgSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}">${variant.svgBackground}</svg>`);
    
    // Overlay SVG
    const overlaySvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}">${variant.svgOverlay}</svg>`);

    // Master Prompt for GPT-4o
    const masterPrompt = `Create a highly professional advertising image for the uploaded ${productName}.

Visual Theme:
${variant.promptTheme}

Keep the main product completely unchanged, unbranded, and do not distort its shape or color.
Integrate the product naturally into the scene with appropriate contact shadows and reflections.
The output should look like a luxury high-end commercial advertisement.`;

    try {
      const finalImage = await sharp(bgSvg)
        .composite([
          { input: resizedProduct, top: offset, left: offset },
          { input: overlaySvg, top: 0, left: 0 }
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
