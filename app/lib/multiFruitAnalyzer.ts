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
      // Use the existing OpenAI client via the analyzer instance
      const openaiClient = new (await import('openai')).default({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: `You are an expert fruit and vegetable batch analyzer for grocery shopping. Analyze the image and identify ALL individual fruits/vegetables visible. For each fruit, provide detailed freshness analysis. Return a JSON response with this structure:

{
  "fruits": [
    {
      "item": "Name of fruit/vegetable",
      "freshness": "Score 0-100",
      "recommendation": "buy/check/avoid",
      "confidence": "0-100",
      "position": {"x": 0, "y": 0, "width": 100, "height": 100},
      "characteristics": {
        "color": "Color description",
        "texture": "Texture description",
        "blemishes": "Blemish description",
        "ripeness": "Ripeness stage"
      },
      "details": "Analysis explanation",
      "storageRecommendation": "Storage advice",
      "daysRemaining": "Estimated days until spoilage"
    }
  ],
  "summary": {
    "totalCount": "Total fruits detected",
    "averageFreshness": "Average freshness score",
    "bestFruit": "Name of freshest fruit",
    "worstFruit": "Name of least fresh fruit",
    "shoppingAdvice": "Overall shopping recommendation"
  }
}

Focus on practical grocery shopping decisions. Be specific about which fruits to buy first, which to avoid, and which need immediate consumption.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze all fruits/vegetables in this image. I'm grocery shopping and need to know which ones are the best quality and freshest. Help me make smart purchasing decisions."
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
        max_tokens: 2000,
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
          x: 10 + (index % 5) * 18,
          y: 10 + Math.floor(index / 5) * 20,
          width: 15,
          height: 15
        },
        storageRecommendation: fruit.storageRecommendation || 'Store in cool, dry place',
        daysRemaining: parseInt(fruit.daysRemaining) || 7,
        nutritionInfo: fruit.nutritionInfo,
        selectionTips: fruit.selectionTips,
        seasonInfo: fruit.seasonInfo,
        commonUses: fruit.commonUses
      })) || [];

      // Calculate summary statistics
      const totalFruits = analyzedFruits.length;
      const averageFreshness = totalFruits > 0 
        ? analyzedFruits.reduce((sum, fruit) => sum + fruit.freshness, 0) / totalFruits 
        : 0;
      
      const bestFruit = analyzedFruits.reduce((best, current) => 
        current.freshness > best.freshness ? current : best, analyzedFruits[0]);
      
      const worstFruit = analyzedFruits.reduce((worst, current) => 
        current.freshness < worst.freshness ? current : worst, analyzedFruits[0]);

      const shoppingRecommendation = this.generateShoppingAdvice(analyzedFruits, averageFreshness);

      const result: BatchAnalysisResult = {
        totalFruits,
        analyzedFruits,
        bestFruit,
        worstFruit,
        averageFreshness: Math.round(averageFreshness),
        shoppingRecommendation,
        analysisId: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Batch analysis completed: ${totalFruits} fruits analyzed`);
      return result;

    } catch (error) {
      console.error('Batch analysis error:', error);
      throw error;
    }
  }

  private generateShoppingAdvice(fruits: FruitAnalysisResult[], averageFreshness: number): string {
    const buyCount = fruits.filter(f => f.recommendation === 'buy').length;
    const avoidCount = fruits.filter(f => f.recommendation === 'avoid').length;
    const checkCount = fruits.filter(f => f.recommendation === 'check').length;

    if (averageFreshness >= 80) {
      return `Excellent selection! ${buyCount} fruits are perfect to buy. This batch has high quality overall.`;
    } else if (averageFreshness >= 60) {
      return `Good selection with some mixed quality. Buy the ${buyCount} fresh ones, check ${checkCount} carefully, and avoid ${avoidCount} poor quality items.`;
    } else {
      return `Poor quality batch. Consider looking for fresher options. Only ${buyCount} items are worth buying, avoid ${avoidCount} items that show spoilage.`;
    }
  }

  async compareAndRank(fruits: FruitAnalysisResult[]): Promise<{
    ranking: FruitAnalysisResult[];
    categories: {
      buyNow: FruitAnalysisResult[];
      checkFirst: FruitAnalysisResult[];
      avoidThese: FruitAnalysisResult[];
    };
  }> {
    // Sort by freshness score (highest first)
    const ranking = [...fruits].sort((a, b) => b.freshness - a.freshness);

    const categories = {
      buyNow: fruits.filter(f => f.recommendation === 'buy'),
      checkFirst: fruits.filter(f => f.recommendation === 'check'),
      avoidThese: fruits.filter(f => f.recommendation === 'avoid')
    };

    return { ranking, categories };
  }

  generateStorageAdvice(fruit: FruitAnalysisResult): string {
    const storageAdvice: { [key: string]: string } = {
      'apple': 'Store in refrigerator crisper drawer for up to 4-6 weeks',
      'banana': 'Store at room temperature, refrigerate when ripe to slow ripening',
      'orange': 'Store at room temperature for 1 week, or refrigerate for up to 3 weeks',
      'strawberry': 'Refrigerate immediately, consume within 3-7 days',
      'grape': 'Store in refrigerator, keep in perforated bag for up to 3 weeks',
      'tomato': 'Store at room temperature until ripe, then refrigerate',
      'avocado': 'Ripen at room temperature, then refrigerate for 3-5 days',
      'lemon': 'Store at room temperature for 1 week, or refrigerate for up to 4 weeks',
      'lime': 'Store at room temperature for 1 week, or refrigerate for up to 4 weeks'
    };

    const fruitKey = fruit.item.toLowerCase();
    return storageAdvice[fruitKey] || fruit.storageRecommendation || 'Store in cool, dry place away from direct sunlight';
  }
}

export const multiFruitAnalyzer = new MultiFruitAnalyzer();
export type { BatchAnalysisResult, FruitAnalysisResult };