#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Comprehensive fruit freshness training data
const trainingDatasets = {
  apples: [
    {
      filename: 'apple-fresh-1.json',
      data: {
        item: 'Apple',
        freshness: 95,
        characteristics: {
          color: 'Vibrant red with natural shine',
          texture: 'Firm and smooth',
          blemishes: 'None visible',
          ripeness: 'Perfect eating stage'
        }
      }
    },
    {
      filename: 'apple-fresh-2.json',
      data: {
        item: 'Apple',
        freshness: 88,
        characteristics: {
          color: 'Bright red-green mix',
          texture: 'Crisp and firm',
          blemishes: 'Minimal spots',
          ripeness: 'Excellent condition'
        }
      }
    },
    {
      filename: 'apple-good-1.json',
      data: {
        item: 'Apple',
        freshness: 75,
        characteristics: {
          color: 'Red with slight dulling',
          texture: 'Still firm',
          blemishes: 'Few small spots',
          ripeness: 'Good for eating'
        }
      }
    },
    {
      filename: 'apple-fair-1.json',
      data: {
        item: 'Apple',
        freshness: 55,
        characteristics: {
          color: 'Faded red, some brown spots',
          texture: 'Slightly soft',
          blemishes: 'Several brown spots',
          ripeness: 'Consume soon'
        }
      }
    },
    {
      filename: 'apple-poor-1.json',
      data: {
        item: 'Apple',
        freshness: 25,
        characteristics: {
          color: 'Brown discoloration',
          texture: 'Soft and mushy',
          blemishes: 'Extensive browning',
          ripeness: 'Overripe, avoid'
        }
      }
    }
  ],
  bananas: [
    {
      filename: 'banana-fresh-1.json',
      data: {
        item: 'Banana',
        freshness: 92,
        characteristics: {
          color: 'Bright yellow',
          texture: 'Firm but yielding',
          blemishes: 'None visible',
          ripeness: 'Perfect ripeness'
        }
      }
    },
    {
      filename: 'banana-good-1.json',
      data: {
        item: 'Banana',
        freshness: 78,
        characteristics: {
          color: 'Yellow with few brown spots',
          texture: 'Soft and sweet',
          blemishes: 'Small brown spots',
          ripeness: 'Very ripe, sweet'
        }
      }
    },
    {
      filename: 'banana-fair-1.json',
      data: {
        item: 'Banana',
        freshness: 45,
        characteristics: {
          color: 'Yellow-brown with many spots',
          texture: 'Very soft',
          blemishes: 'Many brown spots',
          ripeness: 'Overripe but edible'
        }
      }
    }
  ],
  oranges: [
    {
      filename: 'orange-fresh-1.json',
      data: {
        item: 'Orange',
        freshness: 90,
        characteristics: {
          color: 'Bright orange',
          texture: 'Firm with natural bumps',
          blemishes: 'None detected',
          ripeness: 'Peak freshness'
        }
      }
    },
    {
      filename: 'orange-good-1.json',
      data: {
        item: 'Orange',
        freshness: 72,
        characteristics: {
          color: 'Orange with slight green',
          texture: 'Firm',
          blemishes: 'Minor surface marks',
          ripeness: 'Good quality'
        }
      }
    }
  ],
  strawberries: [
    {
      filename: 'strawberry-fresh-1.json',
      data: {
        item: 'Strawberry',
        freshness: 89,
        characteristics: {
          color: 'Deep red',
          texture: 'Plump and firm',
          blemishes: 'None significant',
          ripeness: 'Ripe and sweet'
        }
      }
    },
    {
      filename: 'strawberry-fair-1.json',
      data: {
        item: 'Strawberry',
        freshness: 52,
        characteristics: {
          color: 'Red with dark spots',
          texture: 'Slightly soft',
          blemishes: 'Some dark spots',
          ripeness: 'Use quickly'
        }
      }
    }
  ],
  grapes: [
    {
      filename: 'grape-fresh-1.json',
      data: {
        item: 'Grape',
        freshness: 87,
        characteristics: {
          color: 'Deep purple',
          texture: 'Plump and firm',
          blemishes: 'None visible',
          ripeness: 'Perfect eating condition'
        }
      }
    }
  ],
  tomatoes: [
    {
      filename: 'tomato-fresh-1.json',
      data: {
        item: 'Tomato',
        freshness: 91,
        characteristics: {
          color: 'Vibrant red',
          texture: 'Firm with slight give',
          blemishes: 'None visible',
          ripeness: 'Perfect ripeness'
        }
      }
    },
    {
      filename: 'tomato-good-1.json',
      data: {
        item: 'Tomato',
        freshness: 76,
        characteristics: {
          color: 'Red with green stem area',
          texture: 'Firm',
          blemishes: 'Minor surface marks',
          ripeness: 'Good for cooking'
        }
      }
    }
  ]
};

// Generate synthetic base64 images (simple colored rectangles for training)
function generateSyntheticImage(color, quality = 'good') {
  // Create a simple colored rectangle as base64
  // This is a minimal 1x1 pixel image for demonstration
  const colors = {
    red: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA0DC0AAAAABJRU5ErkJggg==',
    yellow: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BCgAGVgFjhkEiGwAAAABJRU5ErkJggg==',
    orange: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAEAgEAhp3BpwAAAABJRU5ErkJggg==',
    green: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/ABAAChAGA0DC0AAAAABJRU5ErkJggg==',
    purple: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BCgAGVgFjhkEiGwAAAABJRU5ErkJggg=='
  };
  
  return `data:image/png;base64,${colors[color] || colors.red}`;
}

async function createTrainingData() {
  const trainingDir = path.join(process.cwd(), 'training-data');
  
  try {
    await fs.mkdir(trainingDir, { recursive: true });
    console.log('📁 Created training-data directory');
    
    let totalFiles = 0;
    
    for (const [fruitType, samples] of Object.entries(trainingDatasets)) {
      console.log(`🍎 Creating ${fruitType} training data...`);
      
      for (const sample of samples) {
        // Create JSON label file
        const jsonPath = path.join(trainingDir, sample.filename);
        await fs.writeFile(jsonPath, JSON.stringify(sample.data, null, 2));
        
        // Create corresponding synthetic image
        const imageName = sample.filename.replace('.json', '.png');
        const imagePath = path.join(trainingDir, imageName);
        
        // Generate simple synthetic image based on fruit type
        const colorMap = {
          apple: 'red',
          banana: 'yellow', 
          orange: 'orange',
          strawberry: 'red',
          grape: 'purple',
          tomato: 'red'
        };
        
        const imageData = generateSyntheticImage(colorMap[fruitType] || 'green');
        const base64Data = imageData.split(',')[1];
        await fs.writeFile(imagePath, Buffer.from(base64Data, 'base64'));
        
        totalFiles += 2;
      }
    }
    
    // Create README for training data
    const readme = `# FruitAI Training Data

This directory contains ${totalFiles/2} fruit samples for training the local AI model.

## Structure
- Each fruit has a .png image file and corresponding .json label file
- Labels include freshness scores (0-100) and detailed characteristics
- Data covers 6 fruit types: apples, bananas, oranges, strawberries, grapes, tomatoes

## Freshness Scale
- 90-100: Excellent, peak freshness
- 70-89: Good, fresh and ready to eat  
- 50-69: Fair, consume soon
- Below 50: Poor, avoid or use immediately

## Training Command
Run \`npm run train-model\` to train the model with this data.
`;
    
    await fs.writeFile(path.join(trainingDir, 'README.md'), readme);
    
    console.log(`✅ Created ${totalFiles} training files (${totalFiles/2} samples)`);
    console.log(`📊 Fruit types: ${Object.keys(trainingDatasets).length}`);
    console.log('🎯 Ready for model training!');
    
  } catch (error) {
    console.error('❌ Error creating training data:', error);
    throw error;
  }
}

if (require.main === module) {
  createTrainingData().catch(console.error);
}

module.exports = { createTrainingData };