import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { multiFruitAnalyzer } from '../../lib/multiFruitAnalyzer';
import { translateAnalysisResult } from '../../lib/translator';

export async function POST(request: NextRequest) {
  try {
    // Optional authentication - works for both authenticated and guest users
    await auth();
    
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    console.log('🛒 Starting batch fruit analysis...');
    
    // Analyze multiple fruits in the image
    const batchAnalysis = await multiFruitAnalyzer.analyzeBatch(image);
    
    // Create categories for shopping decisions
    const buyNow = batchAnalysis.analyzedFruits.filter(fruit => fruit.recommendation === 'buy');
    const checkFirst = batchAnalysis.analyzedFruits.filter(fruit => fruit.recommendation === 'check');
    const avoidThese = batchAnalysis.analyzedFruits.filter(fruit => fruit.recommendation === 'avoid');
    
    const response = {
      ...batchAnalysis,
      ranking: batchAnalysis.analyzedFruits.sort((a, b) => b.freshness - a.freshness),
      categories: {
        buyNow,
        checkFirst,
        avoidThese
      },
      storageAdvice: batchAnalysis.analyzedFruits.map(fruit => ({
        item: fruit.item,
        advice: fruit.storageRecommendation || 'Store in cool, dry place'
      }))
    };
    
    console.log(`✅ Batch analysis complete: ${batchAnalysis.totalFruits} fruits processed`);
    
    // Translate all response content based on user's language
    const userAgent = request.headers.get('user-agent') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    
    // Detect language from headers
    let targetLanguage = 'en';
    if (acceptLanguage.includes('zh')) {
      targetLanguage = 'zh';
    } else if (acceptLanguage.includes('es')) {
      targetLanguage = 'es';
    } else if (acceptLanguage.includes('fr')) {
      targetLanguage = 'fr';
    }
    
    const translatedResponse = await translateAnalysisResult(response, targetLanguage);
    
    return NextResponse.json(translatedResponse);
  } catch (error) {
    console.error('Batch analysis error:', error);
    return NextResponse.json({ 
      error: 'Batch analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}