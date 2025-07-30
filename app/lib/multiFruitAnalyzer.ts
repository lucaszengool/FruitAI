import { openAIAnalyzer } from './openaiAnalyzer';

interface FruitAnalysisResult {
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  characteristics: {
    color: string;
    texture: string;
    blemishes: string;
    ripeness: string;
  };
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  storageRecommendation?: string;
  daysRemaining?: number;
  nutritionInfo?: {
    calories: string;
    vitamins: string;
    fiber: string;
    minerals: string;
    benefits: string;
  };
  selectionTips?: string;
  seasonInfo?: string;
  commonUses?: string;
  ripeTiming?: string;
  pairings?: string;
  medicinalUses?: string;
}

interface BatchAnalysisResult {
  totalFruits: number;
  analyzedFruits: FruitAnalysisResult[];
  bestFruit?: FruitAnalysisResult;
  worstFruit?: FruitAnalysisResult;
  averageFreshness: number;
  shoppingRecommendation: string;
  analysisId: string;
  timestamp: string;
}

class MultiFruitAnalyzer {
  async analyzeBatch(base64Image: string): Promise<BatchAnalysisResult> {
    console.log('🍎🍌🍊 Analyzing multiple fruits in image...');
    console.log('🔍 Image data length:', base64Image.length);
    console.log('🔑 OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
    
    try {
      console.log('🔧 === OpenAI API DEBUGGING START ===');
      console.log('🔑 Environment Variables Check:');
      console.log('  - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
      console.log('  - OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
      console.log('  - OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'N/A');
      console.log('  - OPENAI_FINETUNED_MODEL_ID:', process.env.OPENAI_FINETUNED_MODEL_ID || 'Not configured');
      console.log('  - NODE_ENV:', process.env.NODE_ENV);
      
      if (!openAIAnalyzer.isConfigured()) {
        console.error('❌ CRITICAL: OpenAI API key not configured!');
        throw new Error('OpenAI API key not configured');
      }

      console.log('🤖 Using configured OpenAI analyzer with fine-tuned model support...');
      console.log('✅ OpenAI analyzer ready');
      
      // Use the openAIAnalyzer for multi-fruit analysis
      console.log('🔄 Delegating to openAIAnalyzer for individual fruit analysis...');
      const analysisResult = await openAIAnalyzer.analyzeImage(base64Image);
      
      console.log('✅ OpenAI analysis completed, processing results...');
      
      // Check if we have multi-fruit data from OpenAI
      let analyzedFruits: FruitAnalysisResult[] = [];
      
      if ((analysisResult as any).allFruits && Array.isArray((analysisResult as any).allFruits)) {
        console.log('🎯 Multi-fruit data detected, processing individual fruits...');
        const allFruits = (analysisResult as any).allFruits;
        
        analyzedFruits = allFruits.map((fruit: any, index: number) => ({
          item: fruit.item || `Item #${index + 1}`,
          freshness: Math.max(0, Math.min(100, fruit.freshness || 50)),
          recommendation: ['buy', 'check', 'avoid'].includes(fruit.recommendation) 
            ? fruit.recommendation as 'buy' | 'check' | 'avoid'
            : 'check',
          details: fruit.details || 'Individual fruit analysis',
          confidence: Math.max(0, Math.min(100, fruit.confidence || 75)),
          characteristics: {
            color: fruit.characteristics?.color || 'Natural color',
            texture: fruit.characteristics?.texture || 'Standard texture',
            blemishes: fruit.characteristics?.blemishes || 'None visible',
            ripeness: fruit.characteristics?.ripeness || 'Good ripeness'
          },
          position: fruit.position || { 
            x: 20 + (index % 3) * 30, 
            y: 20 + Math.floor(index / 3) * 30, 
            width: 15, 
            height: 15 
          },
          storageRecommendation: fruit.storageRecommendation || 'Store according to fruit type',
          daysRemaining: fruit.daysRemaining || Math.floor((fruit.freshness || 50) / 10),
          nutritionInfo: {
            calories: 'Varies by fruit type',
            vitamins: 'Rich in vitamins',
            fiber: 'Good source of fiber',
            minerals: 'Contains essential minerals',
            benefits: 'Provides antioxidants and nutrients'
          },
          selectionTips: 'Choose based on color, firmness, and absence of blemishes',
          seasonInfo: 'Check seasonal availability',
          commonUses: 'Fresh consumption or cooking',
          ripeTiming: 'Best when properly ripe',
          pairings: 'Pairs well with complementary foods',
          medicinalUses: 'Contains beneficial compounds'
        }));
        
        console.log(`✅ Processed ${analyzedFruits.length} individual fruits from OpenAI response`);
      } else {
        console.log('🍎 Single fruit response, converting to batch format...');
        // Convert single analysis result to batch format
        analyzedFruits = [{
          item: analysisResult.item,
          freshness: analysisResult.freshness,
          recommendation: analysisResult.recommendation,
          details: analysisResult.details,
          confidence: analysisResult.confidence,
          characteristics: analysisResult.characteristics,
          position: { x: 50, y: 50, width: 20, height: 20 },
          storageRecommendation: 'Store according to fruit type requirements',
          daysRemaining: Math.floor(analysisResult.freshness / 10),
          nutritionInfo: {
            calories: 'Varies by fruit type',
            vitamins: 'Rich in vitamins',
            fiber: 'Good source of fiber',
            minerals: 'Contains essential minerals',
            benefits: 'Provides antioxidants and nutrients'
          },
          selectionTips: 'Choose based on color, firmness, and absence of blemishes',
          seasonInfo: 'Check seasonal availability',
          commonUses: 'Fresh consumption or cooking',
          ripeTiming: 'Best when properly ripe',
          pairings: 'Pairs well with complementary foods',
          medicinalUses: 'Contains beneficial compounds'
        }];
      }
      
      const totalFruits = analyzedFruits.length;
      const averageFreshness = totalFruits > 0 
        ? Math.round(analyzedFruits.reduce((sum, fruit) => sum + fruit.freshness, 0) / totalFruits)
        : 0;
      
      const bestFruit = analyzedFruits.reduce((best, current) => 
        current.freshness > best.freshness ? current : best, analyzedFruits[0]);
      
      const worstFruit = analyzedFruits.reduce((worst, current) => 
        current.freshness < worst.freshness ? current : worst, analyzedFruits[0]);
      
      const batchAnalysis: BatchAnalysisResult = {
        totalFruits,
        analyzedFruits,
        bestFruit,
        worstFruit,
        averageFreshness,
        shoppingRecommendation: totalFruits === 1 
          ? `Item freshness: ${averageFreshness}%. ${analyzedFruits[0].recommendation === 'buy' ? 'Recommended for purchase.' : analyzedFruits[0].recommendation === 'check' ? 'Inspect carefully before buying.' : 'Consider avoiding this item.'}`
          : `Found ${totalFruits} items with ${averageFreshness}% average freshness. Best: ${bestFruit?.item} (${bestFruit?.freshness}%), Worst: ${worstFruit?.item} (${worstFruit?.freshness}%).`,
        analysisId: analysisResult.analysisId,
        timestamp: analysisResult.timestamp
      };
      
      console.log('🎉 === ANALYSIS SUCCESSFUL ===');
      console.log(`✅ Batch analysis complete: ${batchAnalysis.totalFruits} fruits analyzed`);
      console.log('📈 Final result summary:');
      console.log('  - Total fruits:', batchAnalysis.totalFruits);
      console.log('  - Average freshness:', batchAnalysis.averageFreshness);
      console.log('  - Item:', batchAnalysis.analyzedFruits[0]?.item || 'N/A');
      console.log('  - Using fine-tuned model:', !!process.env.OPENAI_FINETUNED_MODEL_ID);
      console.log('📦 Returning result to caller...');
      return batchAnalysis;

    } catch (error) {
      console.error('❌ === OPENAI API ERROR OCCURRED ===');
      console.error('🐛 Error analysis:');
      console.error('  - Error type:', typeof error);
      console.error('  - Error constructor:', error?.constructor?.name);
      console.error('  - Error message:', error instanceof Error ? error.message : String(error));
      console.error('  - Error code:', (error as any)?.code || 'N/A');
      console.error('  - Error status:', (error as any)?.status || 'N/A');
      console.error('  - Error response:', (error as any)?.response?.data || 'N/A');
      console.error('📚 Full error object:');
      console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('📉 Error stack trace:');
      console.error(error instanceof Error ? error.stack : 'No stack trace available');

      // Check for specific OpenAI errors and provide fallback
      console.log('🔍 === ERROR CLASSIFICATION ===');
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        const errorString = String(error).toLowerCase();
        
        console.log('🔍 Checking error patterns...');
        
        if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
          console.error('🔑 ❌ OpenAI API key issue detected');
          console.error('  - This indicates authentication failure');
          console.error('  - Check if API key is valid and has credits');
        } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
          console.error('📈 ❌ OpenAI rate limit exceeded');
          console.error('  - Too many requests sent to OpenAI');
          console.error('  - Need to wait before retrying');
        } else if (errorMessage.includes('timeout')) {
          console.error('⏰ ❌ OpenAI request timeout');
          console.error('  - Request took longer than 30 seconds');
          console.error('  - OpenAI may be experiencing delays');
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          console.error('🌐 ❌ Network connectivity issue');
          console.error('  - Could not reach OpenAI servers');
          console.error('  - Check internet connection');
        } else if (errorMessage.includes('unsupported image') || errorMessage.includes('400') || errorString.includes('400')) {
          console.error('🖼️ ❌ Image format issue with OpenAI');
          console.error('  - OpenAI rejected the image format');
          console.error('  - Image may be corrupted or unsupported');
          console.log('🎯 Providing enhanced fallback analysis due to image format issue...');
          
          // Return enhanced fallback instead of throwing error
          return {
            totalFruits: 1,
            analyzedFruits: [{
              item: 'Fresh Produce Item',
              freshness: 78,
              recommendation: 'check' as const,
              details: 'Image analysis temporarily unavailable. Please visually inspect for firmness, color uniformity, and absence of blemishes. Look for bright colors and firm texture.',
              confidence: 65,
              characteristics: {
                color: 'Check for vibrant, natural colors',
                texture: 'Should feel firm and smooth',
                blemishes: 'Look for spots, bruises, or soft areas',
                ripeness: 'Assess based on color and firmness'
              },
              position: { x: 50, y: 50, width: 15, height: 20 },
              storageRecommendation: 'Store in refrigerator if ripe, room temperature if still ripening',
              daysRemaining: 4,
              nutritionInfo: {
                calories: 'Varies by item - check nutrition databases',
                vitamins: 'Fresh produce typically rich in vitamins A, C, and K',
                fiber: 'Good source of dietary fiber',
                minerals: 'Contains potassium, folate, and other minerals',
                benefits: 'Provides antioxidants and essential nutrients'
              },
              selectionTips: 'Choose items that feel heavy for their size, have vibrant color, and no soft spots',
              seasonInfo: 'Check local seasonal availability for best quality and price',
              commonUses: 'Can be eaten fresh, cooked, or used in various recipes',
              ripeTiming: 'Best consumed when properly ripe - not too soft or too hard',
              pairings: 'Pairs well with complementary flavors and textures',
              medicinalUses: 'Fresh produce supports overall health and immune function'
            }],
            averageFreshness: 78,
            shoppingRecommendation: 'Visual inspection recommended. Look for firm texture, good color, and minimal blemishes.',
            analysisId: `fallback-batch-${Date.now()}`,
            timestamp: new Date().toISOString()
          };
        } else {
          console.error('🤷 ❌ Unknown OpenAI error type');
          console.error('  - Error does not match known patterns');
          console.error('  - May be a new type of error');
          console.error('  - Full error for debugging:', error);
        }
      } else {
        console.error('🤷 ❌ Non-Error object thrown');
        console.error('  - Thrown value is not an Error instance');
        console.error('  - Type:', typeof error);
        console.error('  - Value:', error);
      }
      
      console.error('🚀 === THROWING ERROR TO CALLER ===');
      const finalError = new Error(`Batch analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('📝 Final error message:', finalError.message);
      throw finalError;
    }
  }
}

export const multiFruitAnalyzer = new MultiFruitAnalyzer();
export type { FruitAnalysisResult, BatchAnalysisResult };