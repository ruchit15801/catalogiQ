import { NextRequest, NextResponse } from 'next/server';
import { generateAdVariants } from '@/app/lib/adGenerator';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const productName = (formData.get('productName') as string) || 'Product';
    const plan = (formData.get('plan') as string) || 'free';

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Call Ad Generator Engine
    const results = await generateAdVariants(
      inputBuffer,
      productName,
      plan as 'free' | 'paid'
    );

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Ad Generation Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate ads' }, { status: 500 });
  }
}
