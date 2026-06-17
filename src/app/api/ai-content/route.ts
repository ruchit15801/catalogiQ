import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, prompt, wordCount = 150, keywordsCount = 15, model = 'gpt-4o-mini' } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('mock')) {
      return NextResponse.json({ success: false, error: 'OpenAI API key not configured' }, { status: 500 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'title') {
      systemPrompt = `You are an expert e-commerce copywriter specializing in Indian marketplaces like Meesho, Flipkart, and Amazon India. 
Generate compelling, SEO-optimized product titles that maximize click-through rates and conversions.
Use emojis strategically, include key selling points, and follow marketplace best practices.`;
      
      userPrompt = `Generate 8 different product listing titles for: "${prompt}"

Each title should:
- Be 60-100 characters (marketplace optimal)
- Include relevant emojis (1-2 per title)
- Highlight key benefits (Free Shipping, COD, Quality, etc.)
- Use power words (Premium, Trending, Bestseller, etc.)
- Include relevant search terms naturally

Return exactly 8 titles, each on a new line separated by a blank line.`;

    } else if (type === 'description') {
      systemPrompt = `You are an expert Indian e-commerce product description writer. 
Create detailed, SEO-rich descriptions for Indian marketplaces (Meesho, Flipkart, Amazon India).
Use emojis, bullet points, and structured formatting for maximum readability and conversion.`;
      
      userPrompt = `Write a comprehensive product description for: "${prompt}"

The description should be approximately ${wordCount} words and include:
- Engaging headline with emoji
- 2-3 sentences of compelling product overview
- "✅ Product Highlights:" section with 5-6 bullet points
- Size & Fit information
- What's in the Box
- Shipping & Returns info (Free delivery above ₹299, 7-day returns, COD)
- Why Choose Us section
- Relevant hashtags/tags at the end

Format with proper emoji bullets and sections.`;

    } else if (type === 'keywords') {
      systemPrompt = `You are an SEO specialist for Indian e-commerce platforms. 
Generate high-performing, search-optimized keywords for Indian marketplace product listings.`;
      
      userPrompt = `Generate ${keywordsCount} SEO-optimized keywords for this product: "${prompt}"

Include:
- Primary keywords (2-3 words)
- Long-tail keywords (4-6 words)  
- Category keywords
- Feature-based keywords
- Buyer intent keywords (buy, online, price, best, cheap, etc.)
- Location-specific terms where relevant (India, online, COD)

Return as a comma-separated list of keywords only, no numbering or extra text.`;

    } else {
      return NextResponse.json({ success: false, error: 'Invalid type. Use: title, description, or keywords' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: type === 'description' ? 800 : 500,
    });

    const output = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      output,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
      model: completion.model,
    });

  } catch (error: unknown) {
    console.error('AI Content API error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    const isAuthError = msg.includes('401') || msg.includes('Unauthorized') || msg.includes('API key');
    return NextResponse.json(
      { success: false, error: isAuthError ? 'Invalid OpenAI API key' : msg },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
