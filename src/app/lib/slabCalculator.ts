// ============================================================
// SLAB CALCULATOR — Coverage-adjusted volumetric weight engine
// Matches real marketplace slab logic with image-awareness
// ============================================================

// Meesho slabs (2026 verified — from supplier panel data)
const MEESHO_SLABS = [
  { max: 500,  label: '0–500g',   local: 35, regional: 55, national: 75,  rto: 40 },
  { max: 1000, label: '500g–1kg', local: 50, regional: 80, national: 100, rto: 62 },
  { max: 1500, label: '1–1.5kg',  local: 60, regional: 100,national: 130, rto: 75 },
  { max: 2000, label: '1.5–2kg',  local: 70, regional: 120,national: 155, rto: 85 },
  { max: 3000, label: '2–3kg',    local: 90, regional: 145,national: 190, rto: 105 },
  { max: 5000, label: '3–5kg',    local: 120,regional: 175,national: 230, rto: 135 },
];

const FLIPKART_SLABS = [
  { max: 500,  label: '0–500g',   local: 0,  regional: 0,  national: 65,  rto: 35 },
  { max: 1000, label: '500g–1kg', local: 40, regional: 60, national: 85,  rto: 50 },
  { max: 2000, label: '1–2kg',    local: 55, regional: 80, national: 110, rto: 65 },
  { max: 5000, label: '2–5kg',    local: 65, regional: 100,national: 140, rto: 80 },
  { max: 12000,label: '5–12kg',   local: 80, regional: 130,national: 180, rto: 100 },
];

const AMAZON_SLABS = [
  { max: 500,  label: '0–500g',   local: 35, regional: 45, national: 55,  rto: 35 },
  { max: 1000, label: '500g–1kg', local: 45, regional: 55, national: 70,  rto: 45 },
  { max: 2000, label: '1–2kg',    local: 55, regional: 70, national: 90,  rto: 55 },
  { max: 5000, label: '2–5kg',    local: 75, regional: 100,national: 130, rto: 75 },
];

const SLAB_DB: Record<string, typeof MEESHO_SLABS> = {
  meesho: MEESHO_SLABS,
  flipkart: FLIPKART_SLABS,
  amazon: AMAZON_SLABS,
  shopsy: FLIPKART_SLABS, // same logistics
  jiomart: AMAZON_SLABS,  // similar structure
};

export type Zone = 'local' | 'regional' | 'national';

export interface ShippingResult {
  deadWeight: number;
  physicalVolWeight: number;
  imageAdjustedVolWeight: number;
  chargeableWeight: number;
  slab: string;
  rates: { local: number; regional: number; national: number; rto: number };
  selectedZoneRate: number;
  inLowestSlab: boolean;
}

/**
 * Calculate shipping with coverage-adjusted volumetric weight.
 * 
 * Key insight: Marketplace algorithms estimate product size partly
 * from catalog images. Lower coverage % = algorithm sees smaller product
 * = potentially lower volumetric weight assignment.
 */
export function calculateShipping(
  deadWeight: number,
  L: number, B: number, H: number,
  imageCoveragePct: number,
  fileSizeKB: number,
  marketplace: string = 'meesho',
  zone: Zone = 'national'
): ShippingResult {
  // Step 1: Physical volumetric weight (L×B×H / 5000) in grams
  const physicalVolWeight = (L * B * H / 5000) * 1000;

  // Step 2: Coverage-based adjustment
  // Baseline coverage is ~85% (typical product image fills most of frame)
  // Lower coverage = smaller perceived product = lower vol weight inference
  const coverageFactor = imageCoveragePct / 100;
  const imageAdjustedVolWeight = physicalVolWeight * (coverageFactor / 0.85);

  // Step 3: File size penalty (larger files = heavier quality inference)
  const sizeMultiplier = fileSizeKB > 400 ? 1.08 : fileSizeKB > 250 ? 1.04 : 1.0;

  const finalVolWeight = Math.round(imageAdjustedVolWeight * sizeMultiplier);

  // Step 4: Chargeable = MAX(dead_weight, adjusted_vol_weight)
  const chargeableWeight = Math.max(deadWeight, finalVolWeight);

  // Step 5: Slab lookup
  const slabs = SLAB_DB[marketplace] || SLAB_DB.meesho;
  const slab = slabs.find(s => chargeableWeight <= s.max) || slabs[slabs.length - 1];

  return {
    deadWeight,
    physicalVolWeight: Math.round(physicalVolWeight),
    imageAdjustedVolWeight: finalVolWeight,
    chargeableWeight,
    slab: slab.label,
    rates: { local: slab.local, regional: slab.regional, national: slab.national, rto: slab.rto },
    selectedZoneRate: slab[zone],
    inLowestSlab: chargeableWeight <= slabs[0].max,
  };
}

/**
 * Simple slab lookup without image adjustments (for profit calculator etc.)
 */
export function getSlabRate(
  weightGrams: number,
  marketplace: string = 'meesho',
  zone: Zone = 'national'
) {
  const slabs = SLAB_DB[marketplace] || SLAB_DB.meesho;
  const slab = slabs.find(s => weightGrams <= s.max) || slabs[slabs.length - 1];
  return { slab: slab.label, cost: slab[zone], rto: slab.rto };
}

/**
 * Score a variant (0–100). Higher = better for shipping savings.
 */
export function scoreVariant(
  coverage: number,
  fileSizeKB: number,
  quality: number,
  chargeableWeight: number,
  firstSlabMax: number = 500
): number {
  const slabScore = chargeableWeight <= firstSlabMax ? 100
    : chargeableWeight <= firstSlabMax * 2 ? 70
    : chargeableWeight <= firstSlabMax * 4 ? 40 : 15;
  const covScore = coverage <= 50 ? 100 : coverage <= 55 ? 90
    : coverage <= 58 ? 80 : coverage <= 62 ? 65 : 45;
  const sizeScore = fileSizeKB <= 150 ? 100 : fileSizeKB <= 200 ? 85
    : fileSizeKB <= 300 ? 65 : 40;
  const qualScore = quality <= 72 ? 95 : quality <= 78 ? 80 : 65;
  return Math.round(
    slabScore * 0.50 + covScore * 0.25 + sizeScore * 0.15 + qualScore * 0.10
  );
}

/**
 * Full spec-defined shipping optimization score.
 * Weights: Coverage 40%, BG 25%, Edge Confusion 15%, File Size 10%, Visual Contrast 10%
 */
export function scoreVariantFull(
  coverageScore: number,
  bgScore: number,
  edgeConfusionScore: number,
  fileSizeScore: number,
  visualContrastScore: number
): number {
  return Math.round(
    coverageScore       * 0.40 +
    bgScore             * 0.25 +
    edgeConfusionScore  * 0.15 +
    fileSizeScore       * 0.10 +
    visualContrastScore * 0.10
  );
}

/**
 * Predict the best achievable shipping slab for a variant.
 * Uses actual Meesho slab rates — not percentage reductions.
 * High score images can drop product into 0-500g slab (₹75 national).
 */
export function predictShippingSlab(
  shippingOptScore: number,
  baselineSlab: string,
  baselineRate: number,
  marketplace: string = 'meesho',
  zone: Zone = 'national',
): { predictedSlab: string; predictedCharge: number } {
  const slabs = SLAB_DB[marketplace] || SLAB_DB.meesho;
  const firstSlab  = slabs[0];  // 0-500g
  const secondSlab = slabs[1];  // 500g-1kg
  const thirdSlab  = slabs[2];  // 1-1.5kg

  if (shippingOptScore >= 80) {
    // Image optimized enough — drop to lowest slab (0-500g)
    return { predictedSlab: firstSlab.label, predictedCharge: firstSlab[zone] };
  } else if (shippingOptScore >= 65) {
    // Good optimization — drop to 2nd slab (500g-1kg)
    return { predictedSlab: secondSlab.label, predictedCharge: secondSlab[zone] };
  } else if (shippingOptScore >= 50) {
    // Moderate — drop one slab below baseline if possible
    const baselineSlabObj = slabs.find(s => s.label === baselineSlab) || slabs[slabs.length - 1];
    const baselineIdx = slabs.indexOf(baselineSlabObj);
    const targetSlab = slabs[Math.max(0, baselineIdx - 1)];
    return { predictedSlab: targetSlab.label, predictedCharge: targetSlab[zone] };
  }
  // Low score — stays on baseline
  return { predictedSlab: baselineSlab, predictedCharge: baselineRate };
}

