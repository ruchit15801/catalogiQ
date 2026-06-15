import { NextRequest, NextResponse } from 'next/server';
import { generateVariants } from '@/app/lib/variantGenerator';
import { calculateShipping, scoreVariant, type Zone } from '@/app/lib/slabCalculator';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const category = (formData.get('category') as string) || 'default';
    const deadWeight = Number(formData.get('deadWeight')) || 250;
    const L = Number(formData.get('L')) || 30;
    const B = Number(formData.get('B')) || 20;
    const H = Number(formData.get('H')) || 15;
    const marketplace = (formData.get('marketplace') as string) || 'meesho';
    const zone = (formData.get('zone') as Zone) || 'national';

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Create temp output directory
    const tmpDir = path.join(os.tmpdir(), `catalogiq_variants_${Date.now()}`);

    // Generate all variants with Sharp.js
    const variants = await generateVariants(inputBuffer, category, tmpDir);

    // Calculate baseline shipping (original image at ~85% coverage)
    const baselineShipping = calculateShipping(deadWeight, L, B, H, 85, 350, marketplace, zone);

    // Score each variant
    const scored = variants.map((v) => {
      const shipping = calculateShipping(deadWeight, L, B, H, v.coverage, v.fileSizeKB, marketplace, zone);
      const score = scoreVariant(v.coverage, v.fileSizeKB, v.quality, shipping.chargeableWeight);
      const savingsPerOrder = baselineShipping.selectedZoneRate - shipping.selectedZoneRate;
      return { ...v, shipping, score, savingsPerOrder };
    });

    // Sort by score (best first)
    scored.sort((a, b) => b.score - a.score);

    // Take top 6 for response (keep bandwidth reasonable)
    const top = scored.slice(0, 6);

    // Read images as base64 for frontend display
    const results = top.map((v, i) => {
      const imgPath = path.join(tmpDir, v.filename);
      let imageBase64 = '';
      try {
        const imgBuffer = fs.readFileSync(imgPath);
        imageBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
      } catch {}

      return {
        rank: i + 1,
        variantId: v.id,
        imageBase64,
        coverage: v.coverage,
        bgId: v.bgId,
        bgColor: v.bgColor,
        fileSizeKB: v.fileSizeKB,
        quality: v.quality,
        score: v.score,
        isBestPick: i === 0,
        savingsPerOrder: v.savingsPerOrder,
        shipping: {
          deadWeight: v.shipping.deadWeight,
          physicalVolWeight: v.shipping.physicalVolWeight,
          imageAdjustedVolWeight: v.shipping.imageAdjustedVolWeight,
          chargeableWeight: v.shipping.chargeableWeight,
          slab: v.shipping.slab,
          rates: v.shipping.rates,
          selectedZoneRate: v.shipping.selectedZoneRate,
          inLowestSlab: v.shipping.inLowestSlab,
        },
      };
    });

    // Cleanup temp files
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

    return NextResponse.json({
      success: true,
      totalGenerated: variants.length,
      marketplace,
      zone,
      baseline: {
        slab: baselineShipping.slab,
        rate: baselineShipping.selectedZoneRate,
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
