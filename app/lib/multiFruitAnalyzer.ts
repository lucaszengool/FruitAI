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
      console.log('🔧 === OpenAI API DEBUGGING START ===');
      console.log('🔑 Environment Variables Check:');
      console.log('  - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
      console.log('  - OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
      console.log('  - OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'N/A');
      console.log('  - NODE_ENV:', process.env.NODE_ENV);
      
      if (!process.env.OPENAI_API_KEY) {
        console.error('❌ CRITICAL: OpenAI API key not found!');
        throw new Error('OpenAI API key not configured');
      }

      console.log('🤖 Initializing OpenAI client...');
      const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 30000, // 30 second timeout
        maxRetries: 2,  // Retry up to 2 times
      });
      console.log('✅ OpenAI client initialized successfully');
      
      const systemPrompt = `You are an expert fruit and vegetable analyzer. You MUST respond with ONLY valid JSON, no additional text or explanations.

CRITICAL JSON REQUIREMENTS:
- Your entire response must be a single valid JSON object
- Do not include markdown code blocks (no \`\`\`json)
- Do not include any text before or after the JSON
- Start your response with { and end with }

ANALYSIS REQUIREMENTS:
1. COUNT EVERY INDIVIDUAL ITEM - analyze each fruit/vegetable separately
2. NUMBER each item uniquely (e.g., "Apple #1", "Apple #2")
3. Provide shopping-focused information for each item
4. Give position coordinates for each item

REQUIRED JSON STRUCTURE:
{
  "fruits": [
    {
      "item": "Item Name #1",
      "freshness": 85,
      "recommendation": "buy",
      "details": "Visual analysis description",
      "confidence": 90,
      "characteristics": {
        "color": "color description",
        "texture": "texture description", 
        "blemishes": "blemish description",
        "ripeness": "ripeness description"
      },
      "position": {"x": 25, "y": 30, "width": 12, "height": 15},
      "storageRecommendation": "storage advice",
      "daysRemaining": 7,
      "nutritionInfo": {
        "calories": "calorie info",
        "vitamins": "vitamin info",
        "fiber": "fiber info",
        "minerals": "mineral info",
        "benefits": "health benefits"
      },
      "selectionTips": "selection tips",
      "seasonInfo": "season info",
      "commonUses": "usage suggestions",
      "ripeTiming": "ripening timeline",
      "pairings": "food pairings",
      "medicinalUses": "health uses"
    }
  ]
}

IMPORTANT: If you cannot see clear fruits/vegetables, return a single generic item with freshness around 75 and recommendation "check".`;

      const userPrompt = 'Analyze this image for fruits/vegetables. Count each individual item and return the JSON structure specified in the system prompt. Each fruit must be numbered uniquely. Respond with ONLY valid JSON, no other text.';

      console.log('📡 === MAKING OPENAI API CALL ===');
      console.log('📸 Image data validation:');
      console.log('  - Image length:', base64Image.length);
      console.log('  - Image starts with data URL:', base64Image.startsWith('data:image'));
      console.log('  - Image first 100 chars:', base64Image.substring(0, 100));
      
      const imageUrl = base64Image.startsWith('data:image') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
      console.log('  - Final image URL length:', imageUrl.length);
      console.log('  - Final image URL preview:', imageUrl.substring(0, 100));
      
      console.log('⚙️ Request parameters:');
      console.log('  - Model: gpt-4o');
      console.log('  - Max tokens: 4000');
      console.log('  - Temperature: 0.1');
      console.log('  - System prompt length:', systemPrompt.length);
      console.log('  - User prompt length:', userPrompt.length);
      
      const requestStart = Date.now();
      console.log('🚀 Sending request to OpenAI at:', new Date().toISOString());
      
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
                  url: imageUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const requestTime = Date.now() - requestStart;
      console.log('🎉 === OPENAI RESPONSE RECEIVED ===');
      console.log(`⏱️ Request completed in ${requestTime}ms`);
      console.log('📊 Response metadata:');
      console.log('  - Response ID:', response.id);
      console.log('  - Model used:', response.model);
      console.log('  - Created:', new Date(response.created * 1000).toISOString());
      console.log('  - Choices length:', response.choices?.length || 0);
      console.log('📈 Usage stats:', JSON.stringify(response.usage, null, 2));
      
      const content = response.choices[0]?.message?.content;
      console.log('📝 Response content analysis:');
      console.log('  - Content exists:', !!content);
      console.log('  - Content length:', content?.length || 0);
      console.log('  - Content preview (first 200 chars):', content?.substring(0, 200) || 'N/A');
      console.log('  - Content preview (last 200 chars):', content?.substring(-200) || 'N/A');
      
      if (!content) {
        console.error('❌ CRITICAL: No content in OpenAI response!');
        console.error('📝 Full response object:');
        console.error(JSON.stringify(response, null, 2));
        throw new Error('No response from OpenAI');
      }

      // Parse the response
      console.log('🔍 === PARSING OPENAI RESPONSE ===');
      console.log('📄 Raw AI response (full):');
      console.log('--- START RESPONSE ---');
      console.log(content);
      console.log('--- END RESPONSE ---');
      
      let analysisData;
      try {
        console.log('🔧 Attempting to parse JSON response...');
        
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
        
        console.log('✅ JSON parsing successful!');
        console.log('📊 Parsed analysis data:');
        console.log('  - Data type:', typeof analysisData);
        console.log('  - Data keys:', Object.keys(analysisData || {}));
        console.log('  - Has fruits array:', Array.isArray(analysisData?.fruits));
        console.log('  - Fruits count:', analysisData?.fruits?.length || 0);
        if (analysisData?.fruits?.length > 0) {
          console.log('  - First fruit keys:', Object.keys(analysisData.fruits[0] || {}));
          console.log('  - First fruit item:', analysisData.fruits[0]?.item);
        }
        console.log('📝 Complete parsed data:');
        console.log(JSON.stringify(analysisData, null, 2));
        
      } catch (parseError) {
        console.error('❌ === JSON PARSING FAILED ===');
        console.error('🔍 Parse error details:');
        console.error('  - Error type:', typeof parseError);
        console.error('  - Error message:', parseError instanceof Error ? parseError.message : String(parseError));
        console.error('  - Error stack:', parseError instanceof Error ? parseError.stack : 'N/A');
        console.error('📄 Content that failed to parse (length: ' + content.length + '):');
        console.error('--- START FAILED CONTENT ---');
        console.error(content);
        console.error('--- END FAILED CONTENT ---');
        console.error('🔧 Trying different parsing approaches...');
        
        // Try to find JSON in different formats
        const jsonRegexes = [
          /```json\n([\s\S]*?)\n```/,
          /```([\s\S]*?)```/,
          /{[\s\S]*}/
        ];
        
        for (let i = 0; i < jsonRegexes.length; i++) {
          const regex = jsonRegexes[i];
          const match = content.match(regex);
          console.log(`🔍 Regex ${i + 1} match:`, !!match);
          if (match) {
            console.log(`📄 Regex ${i + 1} extracted:`, match[1] || match[0]);
            try {
              const testParsed = JSON.parse(match[1] || match[0]);
              console.log(`✅ Regex ${i + 1} parsing successful!`);
              analysisData = testParsed;
              break;
            } catch (e) {
              console.log(`❌ Regex ${i + 1} parsing failed:`, e instanceof Error ? e.message : String(e));
            }
          }
        }
        
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
        
        if (!analysisData) {
          console.log('🎯 Using fallback analysis data due to parsing error');
          console.log('📋 Fallback data structure being created...');
        }
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

      console.log('🎉 === ANALYSIS SUCCESSFUL ===');
      console.log(`✅ Batch analysis complete: ${totalFruits} fruits analyzed`);
      console.log('📈 Final result summary:');
      console.log('  - Total fruits:', result.totalFruits);
      console.log('  - Average freshness:', result.averageFreshness);
      console.log('  - Best fruit:', result.bestFruit?.item || 'N/A');
      console.log('  - Worst fruit:', result.worstFruit?.item || 'N/A');
      console.log('📦 Returning result to caller...');
      return result;

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