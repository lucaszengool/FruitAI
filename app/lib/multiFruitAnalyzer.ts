import OpenAI from 'openai';

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
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 30000, // 30 second timeout
        maxRetries: 2,  // Retry up to 2 times
      });
      
      const systemPrompt = `You are an expert fruit and vegetable individual item analyzer for smart shopping decisions.

CRITICAL REQUIREMENTS:
1. COUNT EVERY SINGLE INDIVIDUAL ITEM - If you see 15 pears, analyze each one separately as "Pear #1", "Pear #2", etc.
2. NEVER group items together - each physical fruit/vegetable gets its own analysis
3. NUMBER each item uniquely even if they're the same type
4. Provide comprehensive shopping-focused information for each item
5. Give precise position coordinates for each individual item
6. Include all details that help with purchasing decisions

Return a JSON object with this exact structure:
{
  "fruits": [
    {
      "item": "Item Name #1",
      "freshness": 85,
      "recommendation": "buy|check|avoid",
      "details": "Detailed visual analysis",
      "confidence": 90,
      "characteristics": {
        "color": "description",
        "texture": "description", 
        "blemishes": "description",
        "ripeness": "description"
      },
      "position": {"x": 25, "y": 30, "width": 12, "height": 15},
      "storageRecommendation": "specific storage advice",
      "daysRemaining": 7,
      "nutritionInfo": {
        "calories": "per 100g info",
        "vitamins": "key vitamins",
        "fiber": "fiber content",
        "minerals": "key minerals",
        "benefits": "health benefits"
      },
      "selectionTips": "how to choose the best ones",
      "seasonInfo": "peak season information",
      "commonUses": "cooking and eating suggestions",
      "ripeTiming": "when it will be perfect to eat",
      "pairings": "what foods it goes well with",
      "medicinalUses": "traditional health uses"
    }
  ]
}`;

      const userPrompt = 'URGENT: Look at this image and count EVERY SINGLE individual fruit/vegetable. If you see 15 pears, I need 15 separate detailed analyses - not one general analysis. Each fruit must be numbered (#1, #2, #3, etc.) with individual positions and comprehensive information including nutrition, storage, selection criteria, preparation tips, variety info, cooking methods, health benefits, and sustainability notes. This is for smart shopping decisions.';

      console.log('📡 Making OpenAI API call...');
      const requestStart = Date.now();
      
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image.startsWith('data:image') ? base64Image : `data:image/jpeg;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.1,
      });

      const requestTime = Date.now() - requestStart;
      console.log(`📊 OpenAI request completed in ${requestTime}ms`);
      console.log('📊 OpenAI response usage:', response.usage);
      
      const content = response.choices[0]?.message?.content;
      console.log('🔍 Response content length:', content?.length || 0);
      
      if (!content) {
        console.error('❌ No content in OpenAI response');
        console.error('📝 Full response:', JSON.stringify(response, null, 2));
        throw new Error('No response from OpenAI');
      }

      // Parse the response
      let analysisData;
      try {
        console.log('Raw AI response:', content);
        
        // Try to extract JSON from markdown code blocks first
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        let jsonStr = jsonMatch ? jsonMatch[1] : content;
        
        // Clean up the JSON string
        jsonStr = jsonStr.trim();
        
        // Try parsing the cleaned JSON
        analysisData = JSON.parse(jsonStr);
        
        // Validate that the response has the expected structure
        if (!analysisData.fruits || !Array.isArray(analysisData.fruits)) {
          console.error('Invalid response structure - no fruits array:', analysisData);
          throw new Error('Response missing fruits array');
        }
        
        console.log('Parsed analysis data:', analysisData);
        
      } catch (parseError) {
        console.error('Failed to parse batch analysis response:', parseError);
        console.error('Content that failed to parse:', content);
        
        // Create a fallback response structure
        analysisData = {
          fruits: [{
            item: 'Detected Item',
            freshness: 75,
            recommendation: 'check',
            details: 'AI analysis temporarily unavailable. Manual inspection recommended.',
            confidence: 50,
            characteristics: {
              color: 'Check for uniform color',
              texture: 'Feel for firmness',
              blemishes: 'Look for spots or damage',
              ripeness: 'Assess visually and by touch'
            },
            position: { x: 50, y: 50, width: 15, height: 20 },
            storageRecommendation: 'Store in cool, dry place',
            daysRemaining: 3,
            nutritionInfo: {
              calories: 'Varies by item',
              vitamins: 'Check nutrition labels',
              fiber: 'Good source typically',
              minerals: 'Varies by type',
              benefits: 'Fresh produce provides nutrients'
            },
            selectionTips: 'Choose items that feel firm and look fresh',
            seasonInfo: 'Seasonal availability varies',
            commonUses: 'Follow standard preparation methods'
          }]
        };
        
        console.log('Using fallback analysis data due to parsing error');
      }

      // Process the results
      const analyzedFruits: FruitAnalysisResult[] = analysisData.fruits?.map((fruit: any, index: number) => ({
        item: fruit.item || 'Unknown Fruit',
        freshness: Math.max(0, Math.min(100, parseInt(fruit.freshness) || 50)),
        recommendation: ['buy', 'check', 'avoid'].includes(fruit.recommendation) 
          ? fruit.recommendation
          : 'check',
        details: fruit.details || 'Analysis completed',
        confidence: Math.max(0, Math.min(100, parseInt(fruit.confidence) || 75)),
        characteristics: {
          color: fruit.characteristics?.color || 'Natural',
          texture: fruit.characteristics?.texture || 'Standard',
          blemishes: fruit.characteristics?.blemishes || 'None visible',
          ripeness: fruit.characteristics?.ripeness || 'Good'
        },
        position: fruit.position || { 
          x: 15 + (index % 4) * 20,
          y: 15 + Math.floor(index / 4) * 25,
          width: 12,
          height: 15
        },
        storageRecommendation: fruit.storageRecommendation || 'Store in cool, dry place',
        daysRemaining: parseInt(fruit.daysRemaining) || 7,
        nutritionInfo: fruit.nutritionInfo,
        selectionTips: fruit.selectionTips,
        seasonInfo: fruit.seasonInfo,
        commonUses: fruit.commonUses,
        ripeTiming: fruit.ripeTiming,
        pairings: fruit.pairings,
        medicinalUses: fruit.medicinalUses
      })) || [];

      // Calculate summary statistics
      const totalFruits = analyzedFruits.length;
      const averageFreshness = totalFruits > 0 
        ? Math.round(analyzedFruits.reduce((sum, fruit) => sum + fruit.freshness, 0) / totalFruits)
        : 0;
      
      const bestFruit = analyzedFruits.reduce((best, current) => 
        current.freshness > best.freshness ? current : best, analyzedFruits[0]);
      
      const worstFruit = analyzedFruits.reduce((worst, current) => 
        current.freshness < worst.freshness ? current : worst, analyzedFruits[0]);

      const result: BatchAnalysisResult = {
        totalFruits,
        analyzedFruits,
        bestFruit,
        worstFruit,
        averageFreshness,
        shoppingRecommendation: `Found ${totalFruits} items with ${averageFreshness}% average freshness. Prioritize items with higher freshness scores.`,
        analysisId: `batch-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Batch analysis complete: ${totalFruits} fruits analyzed`);
      return result;

    } catch (error) {
      console.error('❌ Batch analysis failed:', error);
      console.error('🔍 Error type:', typeof error);
      console.error('📝 Error message:', error instanceof Error ? error.message : String(error));
      console.error('📚 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Check for specific OpenAI errors and provide fallback
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          console.error('🔑 OpenAI API key issue detected');
        } else if (error.message.includes('rate limit')) {
          console.error('📈 OpenAI rate limit exceeded');
        } else if (error.message.includes('timeout')) {
          console.error('⏰ OpenAI request timeout');
        } else if (error.message.includes('network')) {
          console.error('🌐 Network connectivity issue');
        } else if (error.message.includes('unsupported image') || error.message.includes('400')) {
          console.error('🖼️ Image format issue with OpenAI');
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
        }
      }
      
      throw new Error(`Batch analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const multiFruitAnalyzer = new MultiFruitAnalyzer();
export type { FruitAnalysisResult, BatchAnalysisResult };