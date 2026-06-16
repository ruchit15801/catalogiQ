import { NextRequest, NextResponse } from 'next/server';
import { generateVariants } from '@/app/lib/variantGenerator';
import { analyzeImage }     from '@/app/lib/imageAnalyzer';
import { calculateShipping, predictShippingSlab, type Zone } from '@/app/lib/slabCalculator';
import fs   from 'fs';
import path from 'path';
import os   from 'os';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const formData  = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const category  = (formData.get('category')    as string) || 'default';
    const deadWeight= Number(formData.get('deadWeight'))      || 250;
    const L         = Number(formData.get('L'))               || 30;
    const B         = Number(formData.get('B'))               || 20;
    const H         = Number(formData.get('H'))               || 15;
    const marketplace=(formData.get('marketplace') as string) || 'meesho';
    const zone      = (formData.get('zone')        as Zone)   || 'national';
    const planTier  = (formData.get('plan')        as string) || 'free';

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // ── Step 1: Analyze original image ─────────────────────────────────────
    const originalAnalysis = await analyzeImage(inputBuffer);

    // ── Step 2: Baseline shipping (original ~85% coverage) ─────────────────
    const baselineShipping = calculateShipping(
      deadWeight, L, B, H, originalAnalysis.coveragePct || 85, 350, marketplace, zone
    );

    // ── Step 3: Generate variants ───────────────────────────────────────────
    const tmpDir  = path.join(os.tmpdir(), `catalogiq_${Date.now()}`);
    const variants = await generateVariants(inputBuffer, category, tmpDir);

    // ── Step 4: Score + shipping for each variant ───────────────────────────
    const totalGenerated = variants.length;

    const scored = variants.map((v) => {
      const shipping = calculateShipping(
        deadWeight, L, B, H, v.coverage, v.fileSizeKB, marketplace, zone
      );
      const savingsPerOrder = baselineShipping.selectedZoneRate - shipping.selectedZoneRate;
      const { predictedSlab, predictedCharge } = predictShippingSlab(
        v.shippingOptScore, shipping.slab, shipping.selectedZoneRate
      );

      return {
        ...v,
        shipping,
        savingsPerOrder,
        predictedSlab,
        predictedCharge,
      };
    });

    // ── Step 5: Sort by shipping opt score (spec) ───────────────────────────
    scored.sort((a, b) => b.shippingOptScore - a.shippingOptScore);

    // ── Step 6: Return top 3 (free) or top 5 (paid) ─────────────────────────
    const returnCount = planTier === 'paid' ? 5 : 3;
    const top = scored.slice(0, returnCount);

    // ── Build response with base64 images ──────────────────────────────────
    const results = top.map((v, i) => {
      const imgPath = path.join(tmpDir, v.filename);
      let imageBase64 = '';
      try {
        const buf = fs.readFileSync(imgPath);
        imageBase64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
      } catch {}

      return {
        rank:               i + 1,
        variantId:          v.id,
        variantName:        v.variantName,
        imageBase64,
        // Coverage
        coverage:           v.coverage,
        coverageScore:      v.coverageScore,
        // Background
        bgId:               v.bgId,
        bgName:             v.bgName,
        bgType:             v.bgType,
        bgComplexity:       v.bgComplexity,
        bgColor:            v.bgColor,
        bgScore:            v.bgScore,
        // Scoring breakdown
        edgeConfusionScore: v.edgeConfusionScore,
        fileSizeScore:      v.fileSizeScore,
        visualContrastScore:v.visualContrastScore,
        shippingOptScore:   v.shippingOptScore,
        confidence:         v.confidence,
        // File
        fileSizeKB:         v.fileSizeKB,
        quality:            v.quality,
        isBestPick:         i === 0,
        // Shipping
        predictedSlab:      v.predictedSlab,
        predictedCharge:    v.predictedCharge,
        savingsPerOrder:    v.savingsPerOrder,
        shipping: {
          deadWeight:             v.shipping.deadWeight,
          physicalVolWeight:      v.shipping.physicalVolWeight,
          imageAdjustedVolWeight: v.shipping.imageAdjustedVolWeight,
          chargeableWeight:       v.shipping.chargeableWeight,
          slab:                   v.shipping.slab,
          rates:                  v.shipping.rates,
          selectedZoneRate:       v.shipping.selectedZoneRate,
          inLowestSlab:           v.shipping.inLowestSlab,
        },
      };
    });

    // Cleanup
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

    return NextResponse.json({
      success: true,
      totalGenerated,
      returnCount,
      marketplace,
      zone,
      plan: planTier,
      // Original image analysis
      originalAnalysis: {
        coveragePct:        originalAnalysis.coveragePct,
        boundingBox:        originalAnalysis.boundingBox,
        bgComplexityScore:  originalAnalysis.bgComplexityScore,
        edgeStrength:       originalAnalysis.edgeStrength,
        visualContrastScore:originalAnalysis.visualContrastScore,
        imageWidth:         originalAnalysis.imageWidth,
        imageHeight:        originalAnalysis.imageHeight,
      },
      baseline: {
        slab:             baselineShipping.slab,
        rate:             baselineShipping.selectedZoneRate,
        chargeableWeight: baselineShipping.chargeableWeight,
      },
      results,
    });

  } catch (error: unknown) {
    console.error('Generate API error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
