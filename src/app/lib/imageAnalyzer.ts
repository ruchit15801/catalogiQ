// ============================================================
// IMAGE ANALYZER — Sharp-based product image analysis engine
// Computes: coverage %, bounding box, BG complexity, edge strength, contrast
// ============================================================

import sharp from 'sharp';

export interface ImageAnalysis {
  coveragePct: number;           // % of canvas occupied by non-background pixels
  boundingBox: {
    x: number; y: number;
    width: number; height: number;
    aspectRatio: number;
  };
  bgComplexityScore: number;     // 0–100 (higher = more complex background)
  edgeStrength: number;          // 0–100 (higher = stronger clean product edges)
  visualContrastScore: number;   // 0–100
  dominantBgColor: { r: number; g: number; b: number };
  imageWidth: number;
  imageHeight: number;
}

/**
 * Analyze a product image buffer.
 * Returns all key metrics used by the scoring engine.
 */
export async function analyzeImage(inputBuffer: Buffer): Promise<ImageAnalysis> {
  const img = sharp(inputBuffer, { failOn: 'none' });
  const meta = await img.metadata();
  const W = meta.width  || 512;
  const H = meta.height || 512;

  // ── 1. Flatten to RGBA raw pixels (resize to 256px for speed) ──
  const SAMPLE = 256;
  const raw = await sharp(inputBuffer, { failOn: 'none' })
    .resize(SAMPLE, SAMPLE, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const pixels = raw;               // 4 bytes per pixel: R G B A
  const total  = SAMPLE * SAMPLE;

  // ── 2. Background color detection (sample corners) ──
  const corners: number[][] = [];
  const cornerOffsets = [
    0, 3,
    (SAMPLE - 1) * 4,
    (SAMPLE * (SAMPLE - 1)) * 4,
    (SAMPLE * SAMPLE - 1) * 4,
  ];
  for (const off of cornerOffsets) {
    corners.push([pixels[off], pixels[off + 1], pixels[off + 2]]);
  }
  const dominantBgColor = {
    r: Math.round(corners.reduce((s, c) => s + c[0], 0) / corners.length),
    g: Math.round(corners.reduce((s, c) => s + c[1], 0) / corners.length),
    b: Math.round(corners.reduce((s, c) => s + c[2], 0) / corners.length),
  };

  // ── 3. Coverage: count non-background pixels ──
  const BG_THRESH = 35; // RGB distance threshold from BG color
  let productPixels = 0;
  let minX = SAMPLE, minY = SAMPLE, maxX = 0, maxY = 0;

  for (let i = 0; i < total; i++) {
    const off = i * 4;
    const r = pixels[off], g = pixels[off + 1], b = pixels[off + 2], a = pixels[off + 3];
    if (a < 30) continue; // transparent = background

    const dist = Math.sqrt(
      Math.pow(r - dominantBgColor.r, 2) +
      Math.pow(g - dominantBgColor.g, 2) +
      Math.pow(b - dominantBgColor.b, 2)
    );

    if (dist > BG_THRESH) {
      productPixels++;
      const px = i % SAMPLE;
      const py = Math.floor(i / SAMPLE);
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    }
  }

  const coveragePct = Math.round((productPixels / total) * 100);

  // ── 4. Bounding box (scaled back to original dimensions) ──
  const scaleX = W / SAMPLE;
  const scaleY = H / SAMPLE;
  const bbX = Math.round((minX > maxX ? 0 : minX) * scaleX);
  const bbY = Math.round((minY > maxY ? 0 : minY) * scaleY);
  const bbW = Math.round((maxX > minX ? maxX - minX : W) * scaleX);
  const bbH = Math.round((maxY > minY ? maxY - minY : H) * scaleY);

  // ── 5. Background complexity — std-dev of BG pixels ──
  const bgR: number[] = [], bgG: number[] = [], bgB: number[] = [];
  for (let i = 0; i < total; i++) {
    const off = i * 4;
    const r = pixels[off], g = pixels[off + 1], b = pixels[off + 2], a = pixels[off + 3];
    if (a < 30) continue;
    const dist = Math.sqrt(
      Math.pow(r - dominantBgColor.r, 2) +
      Math.pow(g - dominantBgColor.g, 2) +
      Math.pow(b - dominantBgColor.b, 2)
    );
    if (dist <= BG_THRESH) {
      bgR.push(r); bgG.push(g); bgB.push(b);
    }
  }
  const stdDev = (arr: number[]) => {
    if (!arr.length) return 0;
    const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
    return Math.sqrt(arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / arr.length);
  };
  const bgComplexityRaw = (stdDev(bgR) + stdDev(bgG) + stdDev(bgB)) / 3;
  const bgComplexityScore = Math.min(100, Math.round(bgComplexityRaw * 2.5));

  // ── 6. Edge strength — Sobel-like gradient at product boundary ──
  // Simplified: sample gradient magnitude at product pixels adjacent to BG
  let edgeSum = 0, edgeCount = 0;
  for (let y = 1; y < SAMPLE - 1; y++) {
    for (let x = 1; x < SAMPLE - 1; x++) {
      const idx = (y * SAMPLE + x) * 4;
      const rC = pixels[idx], gC = pixels[idx + 1], bC = pixels[idx + 2];
      const lumC = 0.299 * rC + 0.587 * gC + 0.114 * bC;

      const idxR = (y * SAMPLE + x + 1) * 4;
      const lumR = 0.299 * pixels[idxR] + 0.587 * pixels[idxR + 1] + 0.114 * pixels[idxR + 2];
      const idxB2 = ((y + 1) * SAMPLE + x) * 4;
      const lumB = 0.299 * pixels[idxB2] + 0.587 * pixels[idxB2 + 1] + 0.114 * pixels[idxB2 + 2];

      const grad = Math.sqrt(Math.pow(lumC - lumR, 2) + Math.pow(lumC - lumB, 2));
      if (grad > 15) { edgeSum += grad; edgeCount++; }
    }
  }
  const edgeStrength = Math.min(100, Math.round((edgeCount / total) * 400));

  // ── 7. Visual contrast — product vs background luminance difference ──
  let prodLum = 0, prodCount = 0, bgLum = 0, bgCount = 0;
  for (let i = 0; i < total; i++) {
    const off = i * 4;
    const r = pixels[off], g = pixels[off + 1], b = pixels[off + 2], a = pixels[off + 3];
    if (a < 30) continue;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const dist = Math.sqrt(
      Math.pow(r - dominantBgColor.r, 2) +
      Math.pow(g - dominantBgColor.g, 2) +
      Math.pow(b - dominantBgColor.b, 2)
    );
    if (dist > BG_THRESH) { prodLum += lum; prodCount++; }
    else { bgLum += lum; bgCount++; }
  }
  const avgProdLum = prodCount > 0 ? prodLum / prodCount : 128;
  const avgBgLum   = bgCount  > 0 ? bgLum  / bgCount  : 128;
  const visualContrastScore = Math.min(100, Math.round(Math.abs(avgProdLum - avgBgLum) * 0.8));

  return {
    coveragePct,
    boundingBox: {
      x: bbX, y: bbY,
      width: bbW, height: bbH,
      aspectRatio: bbH > 0 ? Math.round((bbW / bbH) * 100) / 100 : 1,
    },
    bgComplexityScore,
    edgeStrength,
    visualContrastScore,
    dominantBgColor,
    imageWidth: W,
    imageHeight: H,
  };
}
