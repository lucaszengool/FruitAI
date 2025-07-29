import { openAIAnalyzer } from './openaiAnalyzer';
import { getLanguageCode } from './languageDetector';

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
      const openaiClient = new (await import('openai')).default({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      const systemPrompt = `You are an expert fruit and vegetable batch analyzer.

CRITICAL INSTRUCTIONS:
1. Count EVERY individual fruit/vegetable visible in the image
2. If you see multiple of the same fruit (like 15 pears), analyze each one separately
3. Give each fruit a unique number: "Pear #1", "Pear #2", "Pear #3", etc.
4. Provide exact position coordinates for each individual item
5. Be thorough with detailed analysis for each item

Return JSON:
{
  "fruits": [
    {
      "item": "Name with number (e.g., Green Pear #1)",
      "freshness": "Score 0-100",
      "recommendation": "buy/check/avoid",
      "confidence": "0-100",
      "position": {"x": "left percentage", "y": "top percentage", "width": 8, "height": 12},
      "characteristics": {
        "color": "Specific color details",
        "texture": "Surface texture",
        "blemishes": "Any spots or marks",
        "ripeness": "Ripeness stage"
      },
      "details": "Detailed condition analysis",
      "storageRecommendation": "Storage advice",
      "daysRemaining": "Days until spoilage",
      "nutritionInfo": {
        "calories": "Per 100g calories",
        "vitamins": "Key vitamins",
        "fiber": "Fiber content",
        "minerals": "Minerals",
        "benefits": "Health benefits"
      },
      "selectionTips": "Selection tips",
      "seasonInfo": "Seasonal info",
      "commonUses": "Common uses",
      "ripeTiming": "Ripening timing",
      "pairings": "Food pairings",
      "medicinalUses": "Medicinal uses"
    }
  ]
}

EXAMPLE: If you see 10 pears, list: Pear #1, Pear #2, Pear #3... Pear #10 with individual positions and analysis for each.`;

      const userPrompt = 'CRITICAL: Analyze EVERY individual fruit/vegetable in this image separately. Count ALL items - if there are 15 pears, I need 15 separate analyses labeled as individual items. Provide precise position coordinates for each fruit. Provide comprehensive analysis including nutrition, selection tips, seasonal info, and usage recommendations.';

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