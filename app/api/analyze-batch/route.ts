import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { multiFruitAnalyzer } from '../../lib/multiFruitAnalyzer';
import { translateAnalysisResult } from '../../lib/translator';

export async function POST(request: NextRequest) {
  console.log('🔍 API analyze-batch called');
  
  try {
    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not found in environment');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        details: 'Server configuration error'
      }, { status: 500 });
    }
    
    // Optional authentication - works for both authenticated and guest users
    try {
      await auth();
      console.log('✅ Authentication check passed');
    } catch (authError) {
      console.log('⚠️ Authentication check failed, continuing as guest:', authError);
    }
    
    const body = await request.json();
    const { image } = body;
    
    if (!image) {
      console.error('❌ No image provided in request');
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate image format
    const isValidImageData = image.startsWith('data:image/') || (typeof image === 'string' && image.length > 100);
    if (!isValidImageData) {
      console.error('❌ Invalid image data format');
      console.error('🔍 Image data preview:', image.substring(0, 100));
      return NextResponse.json({ 
        error: 'Invalid image data format',
        details: 'Image must be a valid base64 data URL'
      }, { status: 400 });
    }

    console.log('🛒 Starting batch fruit analysis...');
    console.log('📸 Image data length:', image.length);
    console.log('🔍 Image format check:', image.substring(0, 50));
    console.log('📊 Request content-type:', request.headers.get('content-type'));
    
    // Analyze multiple fruits in the image
    console.log('⚙️ Calling multiFruitAnalyzer.analyzeBatch...');
    const analysisStart = Date.now();
    
    const batchAnalysis = await multiFruitAnalyzer.analyzeBatch(image);
    
    const analysisTime = Date.now() - analysisStart;
    console.log(`📊 Analysis completed in ${analysisTime}ms`);
    console.log('📊 Analysis result keys:', Object.keys(batchAnalysis));
    
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
    let translatedResponse = response;
    
    try {
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
      
      if (targetLanguage !== 'en') {
        console.log(`🌐 Translating response to ${targetLanguage}...`);
        translatedResponse = await translateAnalysisResult(response, targetLanguage);
        console.log('✅ Translation completed');
      }
    } catch (translationError) {
      console.error('Translation failed, using original response:', translationError);
      // Continue with untranslated response
    }
    
    return NextResponse.json(translatedResponse);
  } catch (error) {
    console.error('❌ Batch analysis error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Provide more detailed error information
    let errorMessage = 'Batch analysis failed';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.message;
    } else {
      errorDetails = String(error);
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}