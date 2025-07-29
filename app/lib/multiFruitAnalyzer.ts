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
    
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
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
                  url: base64Image,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the response
      let analysisData;
      try {
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : content;
        analysisData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Failed to parse batch analysis response:', parseError);
        throw new Error('Invalid response format from AI');
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
      throw new Error(`Batch analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const multiFruitAnalyzer = new MultiFruitAnalyzer();
export type { FruitAnalysisResult, BatchAnalysisResult };