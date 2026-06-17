// ============================================================
// PROMPT ENGINE — 20 background variants for shipping optimization
// Style A (tight frame / cool tone) + Style B (full bleed / warm jewel tone)
// Based on user's shipping optimization document
// ============================================================

export type StyleGroup = 'A' | 'B';

export interface BackgroundVariant {
  name: string;
  desc: string;
  style: StyleGroup;
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

// 10 Style A (cool tone, tight frame) + 10 Style B (warm jewel tone, full bleed)
export const BACKGROUND_VARIANTS: BackgroundVariant[] = [
  // ── Style A — cool tone, tight frame ──────────────────────────────────────
  {
    style: 'A', name: 'Navy Blue Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense floral pattern using navy blue and white flowers (peonies/roses), dark moody tone, cool and detailed',
    fillColor: { r: 15, g: 25, b: 70 }, gradColor: { r: 30, g: 60, b: 120 },
  },
  {
    style: 'A', name: 'Slate Blue Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense slate blue floral pattern with grey-white flowers, calm moody cool tone',
    fillColor: { r: 55, g: 70, b: 100 }, gradColor: { r: 100, g: 115, b: 150 },
  },
  {
    style: 'A', name: 'Teal Ocean Floral', type: 'floral', complexity: 'high',
    desc: 'dense dark teal and turquoise floral pattern with white flowers, ocean-botanical cool mood',
    fillColor: { r: 10, g: 70, b: 80 }, gradColor: { r: 20, g: 120, b: 130 },
  },
  {
    style: 'A', name: 'Steel Blue Floral', type: 'floral', complexity: 'high',
    desc: 'dense steel blue and silver floral pattern, crisp cool botanical tone',
    fillColor: { r: 40, g: 80, b: 120 }, gradColor: { r: 90, g: 130, b: 180 },
  },
  {
    style: 'A', name: 'Midnight Indigo Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense midnight blue and indigo floral pattern with silver-white flowers, starry night cool mood',
    fillColor: { r: 20, g: 10, b: 60 }, gradColor: { r: 50, g: 30, b: 100 },
  },
  {
    style: 'A', name: 'Arctic Frost Floral', type: 'floral', complexity: 'high',
    desc: 'dense pale icy blue and white floral pattern, frosty cool botanical tone',
    fillColor: { r: 200, g: 225, b: 250 }, gradColor: { r: 220, g: 240, b: 255 },
  },
  {
    style: 'A', name: 'Sapphire Cool Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense sapphire blue floral pattern with white-grey flowers, jewel-toned cool mood',
    fillColor: { r: 10, g: 40, b: 130 }, gradColor: { r: 30, g: 70, b: 180 },
  },
  {
    style: 'A', name: 'Denim Blue Floral', type: 'floral', complexity: 'high',
    desc: 'dense denim blue and powder blue floral pattern, soft cool botanical tone',
    fillColor: { r: 80, g: 110, b: 160 }, gradColor: { r: 130, g: 160, b: 210 },
  },
  {
    style: 'A', name: 'Moonlight Grey Floral', type: 'floral', complexity: 'high',
    desc: 'dense moonlight grey-blue floral pattern with white blossoms, cool muted mood',
    fillColor: { r: 100, g: 110, b: 130 }, gradColor: { r: 160, g: 170, b: 190 },
  },
  {
    style: 'A', name: 'Glacier Teal Floral', type: 'floral', complexity: 'high',
    desc: 'dense glacier teal and ice-white floral pattern, cool crisp botanical tone',
    fillColor: { r: 30, g: 100, b: 110 }, gradColor: { r: 80, g: 180, b: 190 },
  },

  // ── Style B — warm jewel tone, full bleed ─────────────────────────────────
  {
    style: 'B', name: 'Deep Burgundy Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense dark burgundy and maroon floral pattern (large roses/peonies), warm moody rich tone, full bleed',
    fillColor: { r: 80, g: 10, b: 25 }, gradColor: { r: 130, g: 20, b: 40 },
  },
  {
    style: 'B', name: 'Crimson Rose Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense crimson red floral pattern with dark roses, bold warm romantic mood, full bleed',
    fillColor: { r: 140, g: 15, b: 25 }, gradColor: { r: 90, g: 5, b: 15 },
  },
  {
    style: 'B', name: 'Golden Amber Floral', type: 'floral', complexity: 'high',
    desc: 'dense floral pattern with golden amber and brown tones (autumn florals), warm dark base, full bleed',
    fillColor: { r: 100, g: 60, b: 10 }, gradColor: { r: 160, g: 100, b: 20 },
  },
  {
    style: 'B', name: 'Wine Plum Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense plum and wine colored floral pattern, deep warm moody botanical, full bleed',
    fillColor: { r: 80, g: 20, b: 60 }, gradColor: { r: 120, g: 40, b: 90 },
  },
  {
    style: 'B', name: 'Maroon Rose Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense deep maroon floral pattern with large rose blooms, vintage warm romantic mood, full bleed',
    fillColor: { r: 100, g: 15, b: 30 }, gradColor: { r: 70, g: 10, b: 20 },
  },
  {
    style: 'B', name: 'Chocolate Brown Floral', type: 'floral', complexity: 'high',
    desc: 'dense chocolate brown floral pattern with tan flowers, warm earthy botanical mood, full bleed',
    fillColor: { r: 80, g: 45, b: 20 }, gradColor: { r: 120, g: 75, b: 40 },
  },
  {
    style: 'B', name: 'Magenta Orchid Floral', type: 'floral', complexity: 'high',
    desc: 'dense magenta and fuchsia floral pattern with orchid blooms, vibrant warm exotic mood, full bleed',
    fillColor: { r: 160, g: 20, b: 100 }, gradColor: { r: 200, g: 50, b: 130 },
  },
  {
    style: 'B', name: 'Mahogany Red Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense mahogany and brick red floral pattern with dark leaves, rich warm vintage mood, full bleed',
    fillColor: { r: 110, g: 30, b: 20 }, gradColor: { r: 80, g: 20, b: 10 },
  },
  {
    style: 'B', name: 'Copper Rust Floral', type: 'floral', complexity: 'high',
    desc: 'dense copper and rust orange floral pattern, warm autumnal botanical mood, full bleed',
    fillColor: { r: 150, g: 70, b: 20 }, gradColor: { r: 100, g: 45, b: 10 },
  },
  {
    style: 'B', name: 'Garnet Wine Floral', type: 'dark_floral', complexity: 'high',
    desc: 'dense garnet and dark wine floral pattern with gold accents, jewel-toned warm mood, full bleed',
    fillColor: { r: 100, g: 10, b: 30 }, gradColor: { r: 140, g: 20, b: 50 },
  },
];

// Coverage cycles — Style A 58-62% (tight), Style B 64-69% (full bleed)
export const COVERAGE_CYCLE_A = [58, 60, 59, 61, 58, 60, 62, 59, 61, 60];
export const COVERAGE_CYCLE_B = [66, 68, 65, 67, 66, 64, 69, 65, 68, 67];

export const EMOJI_SETS: EmojiSet[] = [
  { topLeft: '😍', topRight: '🤩', bottomLeft: '😘', bottomRight: '🥰' },
  { topLeft: '😍', topRight: '😂', bottomLeft: '😉', bottomRight: '❤️' },
  { topLeft: '🤩', topRight: '🔥', bottomLeft: '💯', bottomRight: '😍' },
  { topLeft: '💖', topRight: '🎉', bottomLeft: '👍', bottomRight: '😊' },
];

export interface GeneratedPromptVariant {
  variantIndex: number;
  styleGroup: StyleGroup;
  backgroundName: string;
  coverage: number;
  bg: BackgroundVariant;
  emojis: EmojiSet;
  prompt: string;
}

/**
 * Scoring for lowest shipping — as per the document's formula
 */
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

/**
 * Get coverage for a given variant index
 */
export function getCoverageForVariant(bg: BackgroundVariant, indexWithinStyle: number): number {
  if (bg.style === 'A') return COVERAGE_CYCLE_A[indexWithinStyle % 10];
  return COVERAGE_CYCLE_B[indexWithinStyle % 10];
}
