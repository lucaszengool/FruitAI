import OpenAI from 'openai';

interface OpenAIAnalysisResult {
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
  timestamp: string;
  analysisId: string;
}

class OpenAIFruitAnalyzer {
  private client: OpenAI;
  private fineTunedModelId: string | null = null;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Set fine-tuned model ID if available
    this.fineTunedModelId = process.env.OPENAI_FINETUNED_MODEL_ID || null;
  }

  async analyzeImage(base64Image: string): Promise<OpenAIAnalysisResult> {
    try {
      console.log('🔍 Analyzing image with OpenAI Vision API...');
      
      // Use fine-tuned model if available, otherwise use GPT-4 Vision
      const model = this.fineTunedModelId || 'gpt-4o';
      
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are an expert fruit and vegetable freshness analyzer. Analyze the provided image and identify EVERY INDIVIDUAL fruit/vegetable visible.

IMPORTANT: Respond in ENGLISH ONLY. Use English names for all fruits and vegetables.

CRITICAL REQUIREMENTS:
1. COUNT EACH INDIVIDUAL ITEM - If you see 5 apples, analyze each one separately
2. NUMBER each item uniquely (e.g., "Apple #1", "Apple #2", "Apple #3")
3. Provide detailed freshness analysis for each individual fruit/vegetable
4. Give precise position coordinates for each item in the image

Return a JSON response with this EXACT structure:
{
  "fruits": [
    {
      "item": "Fruit/Vegetable Name #1",
      "freshness": 85,
      "recommendation": "buy",
      "details": "Detailed visual analysis of this specific item",
      "confidence": 90,
      "characteristics": {
        "color": "Color description for this item",
        "texture": "Texture description for this item", 
        "blemishes": "Blemish description for this item",
        "ripeness": "Ripeness description for this item"
      },
      "position": {"x": 25, "y": 30, "width": 12, "height": 15},
      "storageRecommendation": "Specific storage advice",
      "daysRemaining": 7
    }
  ]
}

FRESHNESS SCORING (0-100):
- 90-100: Perfect, premium quality - vibrant color, firm, no blemishes
- 80-89: Very good, buy confidently - good color, mostly firm, minimal imperfections
- 70-79: Good, recommended - acceptable color, some softness, few blemishes
- 60-69: Fair, check before buying - fading color, noticeable softness, visible blemishes
- 50-59: Poor, consider avoiding - dull color, soft spots, multiple blemishes
- 0-49: Bad, definitely avoid - brown/black spots, very soft, signs of rot

POSITION COORDINATES:
- x, y: Center position as percentage of image (0-100)
- width, height: Item size as percentage of image (0-100)

RECOMMENDATIONS:
- "buy": Fresh, good quality, recommended purchase
- "check": Inspect carefully, may be acceptable depending on use
- "avoid": Poor quality, not recommended for purchase

IMPORTANT: Analyze each visible fruit/vegetable individually. If you see multiple items of the same type, number them separately and analyze each one's specific condition.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and identify EVERY individual fruit/vegetable visible. Count each item separately and provide detailed freshness analysis for each one. If you see multiple fruits of the same type, number them individually (Apple #1, Apple #2, etc.) and analyze each one's specific condition. IMPORTANT: Respond in English only - use English names for all fruits and vegetables."
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
        max_tokens: 1000,
        temperature: 0.1, // Low temperature for consistent analysis
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Parse JSON response
      let analysisData;
      try {
        // Extract JSON from markdown code block if present
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : content;
        analysisData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        console.log('Raw response:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Check if this is a multi-fruit response or single fruit response
      let result: OpenAIAnalysisResult;
      
      if (analysisData.fruits && Array.isArray(analysisData.fruits) && analysisData.fruits.length > 0) {
        console.log(`🍎 Multi-fruit response detected: ${analysisData.fruits.length} fruits found`);
        
        // For multi-fruit responses, we'll return the first fruit but store all fruits info in details
        const firstFruit = analysisData.fruits[0];
        const allFruitsInfo = analysisData.fruits.map((fruit: any, index: number) => 
          `${fruit.item || `Item #${index + 1}`}: ${fruit.freshness || 'N/A'}% fresh (${fruit.recommendation || 'check'})`
        ).join('; ');
        
        result = {
          item: analysisData.fruits.length === 1 ? firstFruit.item : `${analysisData.fruits.length} items detected`,
          freshness: Math.max(0, Math.min(100, firstFruit.freshness || 50)),
          recommendation: ['buy', 'check', 'avoid'].includes(firstFruit.recommendation) 
            ? firstFruit.recommendation 
            : 'check',
          details: analysisData.fruits.length === 1 
            ? (firstFruit.details || 'Analysis completed')
            : `Multiple items: ${allFruitsInfo}. Full analysis: ${JSON.stringify(analysisData.fruits)}`,
          confidence: Math.max(0, Math.min(100, firstFruit.confidence || 75)),
          characteristics: {
            color: firstFruit.characteristics?.color || 'Natural',
            texture: firstFruit.characteristics?.texture || 'Standard',
            blemishes: firstFruit.characteristics?.blemishes || 'None visible',
            ripeness: firstFruit.characteristics?.ripeness || 'Good'
          },
          timestamp: new Date().toISOString(),
          analysisId: `openai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        // Store the full fruits data in a special property for the multiFruitAnalyzer to use
        (result as any).allFruits = analysisData.fruits;
        
      } else {
        // Single fruit response (legacy format)
        console.log('🍎 Single fruit response detected');
        result = {
          item: analysisData.item || 'Unknown',
          freshness: Math.max(0, Math.min(100, analysisData.freshness || 50)),
          recommendation: ['buy', 'check', 'avoid'].includes(analysisData.recommendation) 
            ? analysisData.recommendation 
            : 'check',
          details: analysisData.details || 'Analysis completed',
          confidence: Math.max(0, Math.min(100, analysisData.confidence || 75)),
          characteristics: {
            color: analysisData.characteristics?.color || 'Natural',
            texture: analysisData.characteristics?.texture || 'Standard',
            blemishes: analysisData.characteristics?.blemishes || 'None visible',
            ripeness: analysisData.characteristics?.ripeness || 'Good'
          },
          timestamp: new Date().toISOString(),
          analysisId: `openai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      }

      console.log(`✅ OpenAI analysis completed: ${result.item} (${result.freshness}% fresh)`);
      return result;

    } catch (error) {
      console.error('OpenAI analysis error:', error);
      
      if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing');
      }
      
      // Return fallback analysis
      return this.getFallbackAnalysis();
    }
  }

  async createFineTuningDataset(trainingData: Array<{
    image: string; // base64 image
    label: 'fresh' | 'rotten';
    item: string;
    characteristics?: any;
  }>): Promise<string> {
    console.log(`📚 Creating fine-tuning dataset with ${trainingData.length} samples...`);
    
    // Convert training data to OpenAI fine-tuning format
    const fineTuningData = trainingData.map(sample => ({
      messages: [
        {
          role: "system",
          content: "You are an expert fruit and vegetable freshness analyzer. Classify the image as either 'fresh' or 'rotten' and provide detailed analysis."
        },
        {
          role: "user", 
          content: [
            {
              type: "text",
              text: "Analyze this fruit/vegetable and classify its freshness."
            },
            {
              type: "image_url",
              image_url: {
                url: sample.image.startsWith('data:image') ? sample.image : `data:image/jpeg;base64,${sample.image}`,
                detail: "high"
              }
            }
          ]
        },
        {
          role: "assistant",
          content: JSON.stringify({
            item: sample.item,
            classification: sample.label,
            freshness: sample.label === 'fresh' ? 85 : 25,
            recommendation: sample.label === 'fresh' ? 'buy' : 'avoid',
            details: `This ${sample.item.toLowerCase()} appears to be ${sample.label}. ${sample.label === 'fresh' ? 'Good quality indicators present.' : 'Signs of spoilage detected.'}`,
            confidence: 90,
            characteristics: sample.characteristics || {
              color: sample.label === 'fresh' ? 'Vibrant and natural' : 'Dull or discolored',
              texture: sample.label === 'fresh' ? 'Firm and proper' : 'Soft or deteriorated',
              blemishes: sample.label === 'fresh' ? 'None or minimal' : 'Visible spoilage',
              ripeness: sample.label === 'fresh' ? 'Optimal' : 'Overripe or spoiled'
            }
          })
        }
      ]
    }));

    // Save training data to file
    const trainingFile = `training_data_${Date.now()}.jsonl`;
    const trainingContent = fineTuningData.map(item => JSON.stringify(item)).join('\n');
    
    // In a real implementation, you would upload this to OpenAI
    console.log(`📁 Training data prepared: ${trainingFile}`);
    console.log(`🔢 Total samples: ${fineTuningData.length}`);
    
    return trainingFile;
  }

  async startFineTuning(trainingFile: string): Promise<string> {
    try {
      console.log('🚀 Starting OpenAI fine-tuning job...');
      
      // Upload training file
      const file = await this.client.files.create({
        file: trainingFile as any, // This would be a File object in practice
        purpose: 'fine-tune'
      });

      // Create fine-tuning job
      const fineTuningJob = await this.client.fineTuning.jobs.create({
        training_file: file.id,
        model: 'gpt-4o-2024-08-06', // Use the latest model that supports fine-tuning
        hyperparameters: {
          n_epochs: 3,
          batch_size: 1,
          learning_rate_multiplier: 0.1
        }
      });

      console.log(`✅ Fine-tuning job created: ${fineTuningJob.id}`);
      return fineTuningJob.id;

    } catch (error) {
      console.error('Fine-tuning creation error:', error);
      throw error;
    }
  }

  async checkFineTuningStatus(jobId: string): Promise<any> {
    try {
      const job = await this.client.fineTuning.jobs.retrieve(jobId);
      return {
        id: job.id,
        status: job.status,
        model: job.fine_tuned_model,
        created_at: job.created_at,
        finished_at: job.finished_at,
        training_file: job.training_file,
        result_files: job.result_files
      };
    } catch (error) {
      console.error('Fine-tuning status check error:', error);
      throw error;
    }
  }

  setFineTunedModel(modelId: string) {
    this.fineTunedModelId = modelId;
    console.log(`🎯 Using fine-tuned model: ${modelId}`);
  }

  private getFallbackAnalysis(): OpenAIAnalysisResult {
    return {
      item: 'Unknown Produce',
      freshness: 60,
      recommendation: 'check',
      details: 'Unable to complete analysis with OpenAI. Please check the image quality and try again.',
      confidence: 50,
      characteristics: {
        color: 'Unable to determine',
        texture: 'Unable to determine',
        blemishes: 'Unable to assess',
        ripeness: 'Manual inspection needed'
      },
      timestamp: new Date().toISOString(),
      analysisId: `fallback_openai_${Date.now()}`
    };
  }

  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }
}

// Export singleton instance
export const openAIAnalyzer = new OpenAIFruitAnalyzer();
export type { OpenAIAnalysisResult };