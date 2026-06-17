// ============================================================
// PROMPT ENGINE — Exact Reference Style Variant Generation
// ============================================================

export type StyleGroup = 'A' | 'B';

export interface BackgroundVariant {
  id: string;
  style: StyleGroup;
  name: string;
  coverage: number;
  emojiSetIndex: number;
  // For Sharp-based rendering
  fillColor: { r: number; g: number; b: number };
  gradColor: { r: number; g: number; b: number };
  type: string;
  complexity: 'high' | 'medium' | 'low';
}

export interface EmojiSet {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

export const EMOJI_SETS: EmojiSet[] = [
  { topLeft: '😍', topRight: '🤩', bottomLeft: '😘', bottomRight: '🥰' }, // Set A
  { topLeft: '🤩', topRight: '😍', bottomLeft: '🥰', bottomRight: '😘' }, // Set B
  { topLeft: '🥰', topRight: '😘', bottomLeft: '😍', bottomRight: '🤩' }, // Set C
  { topLeft: '😘', topRight: '🥰', bottomLeft: '🤩', bottomRight: '😍' }, // Set D
];

// Exact variants defined in the reference document
export const BACKGROUND_VARIANTS: BackgroundVariant[] = [
  // Style A
  { id: 'A1', style: 'A', name: 'Navy White Floral Garden', coverage: 58, emojiSetIndex: 0, type: 'dark_floral', complexity: 'high', fillColor: { r: 15, g: 25, b: 70 }, gradColor: { r: 30, g: 60, b: 120 } },
  { id: 'A2', style: 'A', name: 'Royal Blue Rose Wallpaper', coverage: 60, emojiSetIndex: 1, type: 'dark_floral', complexity: 'high', fillColor: { r: 10, g: 30, b: 90 }, gradColor: { r: 20, g: 50, b: 140 } },
  { id: 'A3', style: 'A', name: 'Sapphire Floral Pattern', coverage: 62, emojiSetIndex: 2, type: 'floral', complexity: 'high', fillColor: { r: 10, g: 40, b: 130 }, gradColor: { r: 30, g: 70, b: 180 } },
  { id: 'A4', style: 'A', name: 'Blue Peony Wallpaper', coverage: 58, emojiSetIndex: 3, type: 'floral', complexity: 'high', fillColor: { r: 40, g: 80, b: 120 }, gradColor: { r: 90, g: 130, b: 180 } },
  { id: 'A5', style: 'A', name: 'Indigo Floral Luxury', coverage: 60, emojiSetIndex: 0, type: 'dark_floral', complexity: 'high', fillColor: { r: 20, g: 10, b: 60 }, gradColor: { r: 50, g: 30, b: 100 } },
  { id: 'A6', style: 'A', name: 'Ocean Bloom Wallpaper', coverage: 62, emojiSetIndex: 1, type: 'floral', complexity: 'high', fillColor: { r: 10, g: 70, b: 80 }, gradColor: { r: 20, g: 120, b: 130 } },
  { id: 'A7', style: 'A', name: 'Teal Botanical Garden', coverage: 58, emojiSetIndex: 2, type: 'floral', complexity: 'high', fillColor: { r: 5, g: 50, b: 60 }, gradColor: { r: 10, g: 90, b: 100 } },
  { id: 'A8', style: 'A', name: 'Frost Blue Floral', coverage: 60, emojiSetIndex: 3, type: 'floral', complexity: 'high', fillColor: { r: 180, g: 210, b: 240 }, gradColor: { r: 210, g: 230, b: 250 } },
  { id: 'A9', style: 'A', name: 'Midnight Blue Floral', coverage: 61, emojiSetIndex: 0, type: 'dark_floral', complexity: 'high', fillColor: { r: 10, g: 15, b: 40 }, gradColor: { r: 20, g: 30, b: 80 } },
  { id: 'A10', style: 'A', name: 'Cool Sapphire Garden', coverage: 62, emojiSetIndex: 1, type: 'dark_floral', complexity: 'high', fillColor: { r: 15, g: 35, b: 110 }, gradColor: { r: 35, g: 65, b: 160 } },

  // Style B
  { id: 'B1', style: 'B', name: 'Burgundy Rose Garden', coverage: 64, emojiSetIndex: 0, type: 'dark_floral', complexity: 'high', fillColor: { r: 80, g: 10, b: 25 }, gradColor: { r: 130, g: 20, b: 40 } },
  { id: 'B2', style: 'B', name: 'Crimson Floral Luxury', coverage: 66, emojiSetIndex: 1, type: 'dark_floral', complexity: 'high', fillColor: { r: 140, g: 15, b: 25 }, gradColor: { r: 90, g: 5, b: 15 } },
  { id: 'B3', style: 'B', name: 'Wine Red Floral Wallpaper', coverage: 68, emojiSetIndex: 2, type: 'dark_floral', complexity: 'high', fillColor: { r: 100, g: 10, b: 30 }, gradColor: { r: 140, g: 20, b: 50 } },
  { id: 'B4', style: 'B', name: 'Plum Flower Garden', coverage: 65, emojiSetIndex: 3, type: 'dark_floral', complexity: 'high', fillColor: { r: 80, g: 20, b: 60 }, gradColor: { r: 120, g: 40, b: 90 } },
  { id: 'B5', style: 'B', name: 'Mahogany Floral Luxury', coverage: 67, emojiSetIndex: 0, type: 'dark_floral', complexity: 'high', fillColor: { r: 110, g: 30, b: 20 }, gradColor: { r: 80, g: 20, b: 10 } },
  { id: 'B6', style: 'B', name: 'Dark Ruby Floral', coverage: 64, emojiSetIndex: 1, type: 'dark_floral', complexity: 'high', fillColor: { r: 90, g: 10, b: 20 }, gradColor: { r: 140, g: 15, b: 30 } },
  { id: 'B7', style: 'B', name: 'Purple Rose Garden', coverage: 66, emojiSetIndex: 2, type: 'floral', complexity: 'high', fillColor: { r: 130, g: 20, b: 100 }, gradColor: { r: 180, g: 40, b: 140 } },
  { id: 'B8', style: 'B', name: 'Black Cherry Floral', coverage: 68, emojiSetIndex: 3, type: 'dark_floral', complexity: 'high', fillColor: { r: 50, g: 5, b: 15 }, gradColor: { r: 90, g: 10, b: 25 } },
  { id: 'B9', style: 'B', name: 'Velvet Burgundy Wallpaper', coverage: 65, emojiSetIndex: 0, type: 'dark_floral', complexity: 'high', fillColor: { r: 120, g: 15, b: 35 }, gradColor: { r: 70, g: 10, b: 20 } },
  { id: 'B10', style: 'B', name: 'Dark Jewel Tone Floral', coverage: 67, emojiSetIndex: 1, type: 'dark_floral', complexity: 'high', fillColor: { r: 60, g: 15, b: 50 }, gradColor: { r: 100, g: 25, b: 80 } },
];

export const GENERATION_ORDER = [
  'A1', 'A2', 'A5', 'A8', 'B1', 'B2', 'B5', 'B9', 'A3', 'B3', 
  'A4', 'B4', 'A6', 'B6', 'A7', 'B7', 'A9', 'B8', 'A10', 'B10'
];

export function generateMasterPrompt(productName: string, bg: BackgroundVariant, emojiSet: EmojiSet): string {
  return `Transform the uploaded ${productName} image into the exact visual style of the reference.

Keep product completely unchanged.

Canvas:
1024x1024

Product Coverage:
${bg.coverage}%

Background:
${bg.name}

Create a dense luxury floral wallpaper background.

Emoji Stickers:

Attach directly on product surface.

Top Left:
${emojiSet.topLeft}

Top Right:
${emojiSet.topRight}

Bottom Left:
${emojiSet.bottomLeft}

Bottom Right:
${emojiSet.bottomRight}

Requirements:

* Glossy sticker appearance
* Overlapping product edges
* Physically attached look
* Product centered
* High detail floral wallpaper
* Premium ecommerce aesthetic
* Photorealistic
* No watermark
* No text
* No logo modification
* No product modification

Output must match the reference composition exactly.`;
}

export function scoreForLowestShipping(
  styleGroup: StyleGroup,
  coverage: number,
  fileSizeKB: number,
): number {
  // Coverage scoring is style-relative
  const covScore = styleGroup === 'A'
    ? (coverage <= 59 ? 100 : coverage <= 61 ? 85 : 65)
    : (coverage <= 65 ? 95 : coverage <= 67 ? 80 : 60);

  // File size: smaller = lighter inferred weight
  const sizeScore = fileSizeKB <= 150 ? 100 : fileSizeKB <= 200 ? 85 : fileSizeKB <= 250 ? 65 : 40;

  return Math.round(covScore * 0.65 + sizeScore * 0.35);
}
