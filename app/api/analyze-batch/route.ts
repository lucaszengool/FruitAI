import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { multiFruitAnalyzer } from '../../lib/multiFruitAnalyzer';

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
    
    // Add comparison and ranking
    const comparison = await multiFruitAnalyzer.compareAndRank(batchAnalysis.analyzedFruits);
    
    const response = {
      ...batchAnalysis,
      ranking: comparison.ranking,
      categories: comparison.categories,
      storageAdvice: batchAnalysis.analyzedFruits.map(fruit => ({
        item: fruit.item,
        advice: multiFruitAnalyzer.generateStorageAdvice(fruit)
      }))
    };
    
    console.log(`✅ Batch analysis complete: ${batchAnalysis.totalFruits} fruits processed`);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Batch analysis error:', error);
    return NextResponse.json({ 
      error: 'Batch analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}