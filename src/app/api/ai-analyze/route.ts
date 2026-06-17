import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const analysisType = (formData.get('type') as string) || 'product';

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';

    let prompt = '';
    if (analysisType === 'product') {
      prompt = `Analyze this product image for an Indian e-commerce marketplace listing. Provide a JSON response with:
{
  "productName": "detected product name",
  "category": "product category (clothing/electronics/home/beauty/etc)",
  "color": "primary color(s)",
  "material": "material if visible",
  "style": "style description",
  "targetAudience": "men/women/kids/unisex",
  "suggestedTitle": "SEO optimized title for Indian marketplace",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "suggestedKeywords": ["keyword1", "keyword2", ...],
  "backgroundAnalysis": {
    "currentBg": "description of current background",
    "bgQuality": "good/poor/needs-improvement",
    "recommendation": "what background would work best"
  },
  "shippingOptimization": {
    "imageCoverage": "estimated % of canvas the product covers",
    "recommendation": "how to optimize image for shipping cost reduction"
  }
}
Return ONLY valid JSON, no markdown or extra text.`;
    } else {
      prompt = `Describe this image in detail for an Indian e-commerce product listing. Include product type, colors, materials, and key features visible.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';

    if (analysisType === 'product') {
      try {
        const parsed = JSON.parse(content);
        return NextResponse.json({
          success: true,
          analysis: parsed,
          usage: response.usage,
        });
      } catch {
        return NextResponse.json({
          success: true,
          analysis: { raw: content },
          usage: response.usage,
        });
      }
    }

    return NextResponse.json({
      success: true,
      description: content,
      usage: response.usage,
    });

  } catch (error: unknown) {
    console.error('AI Image Analysis error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
