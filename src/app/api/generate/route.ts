import { NextRequest, NextResponse } from 'next/server';
import { generateVariants } from '@/app/lib/variantGenerator';
import { analyzeImage }     from '@/app/lib/imageAnalyzer';
import { calculateShipping, predictShippingSlab, type Zone } from '@/app/lib/slabCalculator';
import fs   from 'fs';
import path from 'path';
import os   from 'os';

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

    // ── Step 2: Baseline shipping (original image, unoptimized ~85% coverage) 
    const baselineShipping = calculateShipping(
      deadWeight, L, B, H, originalAnalysis.coveragePct || 85, 350, marketplace, zone
    );

    // ── Step 3: Generate all 20 variants (Style A x10 + Style B x10) ─────────
    const tmpDir  = path.join(os.tmpdir(), `catalogiq_${Date.now()}`);
    const variants = await generateVariants(inputBuffer, category, tmpDir);
    const totalGenerated = variants.length; // should be 20

    // ── Step 4: Score + shipping for each variant ──────────────────────────
    const scored = variants.map((v) => {
      const shipping = calculateShipping(
        deadWeight, L, B, H, v.coverage, v.fileSizeKB, marketplace, zone
      );
      const { predictedSlab, predictedCharge } = predictShippingSlab(
        v.shippingOptScore, shipping.slab, shipping.selectedZoneRate, marketplace, zone
      );
      // Savings vs baseline (original unoptimized image)
      const savingsPerOrder = Math.max(0, baselineShipping.selectedZoneRate - predictedCharge);

      return {
        ...v,
        shipping,
        savingsPerOrder,
        predictedSlab,
        predictedCharge,
      };
    });

    // ── Step 5: Sort by predictedCharge ASCENDING (cheapest shipping first) ─
    // Within same charge, sort by shippingOptScore descending (better image first)
    scored.sort((a, b) => {
      if (a.predictedCharge !== b.predictedCharge) {
        return a.predictedCharge - b.predictedCharge; // cheapest first
      }
      return b.shippingOptScore - a.shippingOptScore; // then by score desc
    });

    // ── Step 6: Plans — Free=5 (lowest cost), Paid=20 (all) ─────────────────
    // Free users get only the 5 cheapest (best deal) variants
    // Paid users get all 20, grouped as: Lowest / Mid / Higher cost
    const returnCount = planTier === 'paid' ? 20 : 5;
    const top = scored.slice(0, returnCount);

    // ── Build response with base64 images ───────────────────────────────────
    // Determine tier labels for UI display
    const minCharge = scored[0]?.predictedCharge ?? 0;
    const maxCharge = scored[scored.length - 1]?.predictedCharge ?? 0;
    const midThreshold = minCharge + Math.round((maxCharge - minCharge) * 0.4);
    const highThreshold = minCharge + Math.round((maxCharge - minCharge) * 0.7);

    const results = top.map((v, i) => {
      const imgPath = path.join(tmpDir, v.filename);
      let imageBase64 = '';
      try {
        const buf = fs.readFileSync(imgPath);
        imageBase64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
      } catch {}

      // Classify cost tier
      const costTier: 'lowest' | 'medium' | 'higher' =
        v.predictedCharge <= midThreshold ? 'lowest' :
        v.predictedCharge <= highThreshold ? 'medium' : 'higher';

      return {
        rank:               i + 1,
        variantId:          v.id,
        variantName:        v.variantName,
        styleGroup:         v.styleGroup,
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
        costTier,
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
        masterPrompt:       v.masterPrompt,
      };
    });

    // Cleanup temp files
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

    return NextResponse.json({
      success: true,
      totalGenerated,
      returnCount,
      marketplace,
      zone,
      plan: planTier,
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
      // Cost range info for context
      costRange: {
        min: scored[0]?.predictedCharge ?? 0,
        max: scored[scored.length - 1]?.predictedCharge ?? 0,
        mid: midThreshold,
      },
      results,
    });

  } catch (error: unknown) {
    console.error('Generate API error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
