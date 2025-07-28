#!/usr/bin/env node

/**
 * Training script for FruitAI local model fine-tuning
 * Run with: node scripts/train-model.js
 */

const { FruitAIFineTuner } = require('../app/lib/fineTuning');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  console.log('🚀 Starting FruitAI Model Training Pipeline');
  console.log('==========================================');

  try {
    // Initialize fine-tuner
    const fineTuner = new FruitAIFineTuner({
      learningRate: 0.0001,
      batchSize: 8, // Smaller batch size for local training
      epochs: 30,
      validationSplit: 0.2,
      imageSize: [224, 224]
    });

    // Check if training data exists
    const trainingDataPath = path.join(process.cwd(), 'training-data');
    const trainingDataExists = await fs.access(trainingDataPath).then(() => true).catch(() => false);

    let trainingData;
    if (trainingDataExists) {
      console.log('📂 Loading training data from training-data/ directory...');
      trainingData = await loadTrainingDataFromDirectory(trainingDataPath);
    } else {
      console.log('⚠️  No training data found. Generating synthetic data for demonstration...');
      trainingData = fineTuner.generateSyntheticData(50);
    }

    console.log(`📊 Loaded ${trainingData.length} training samples`);

    // Augment training data
    console.log('🔄 Augmenting training data...');
    const augmentedData = await fineTuner.augmentTrainingData(trainingData);

    // Split data for training and testing
    const splitIndex = Math.floor(augmentedData.length * 0.8);
    const trainData = augmentedData.slice(0, splitIndex);
    const testData = augmentedData.slice(splitIndex);

    console.log(`🎯 Training on ${trainData.length} samples, testing on ${testData.length} samples`);

    // Initialize and fine-tune the model
    console.log('🤖 Initializing base model...');
    await fineTuner.initializeBaseModel();

    console.log('🔥 Starting fine-tuning process...');
    const history = await fineTuner.fineTune(trainData);

    // Evaluate the model
    console.log('📈 Evaluating model performance...');
    const evaluation = await fineTuner.evaluateModel(testData);

    // Save the trained model
    const modelPath = path.join(process.cwd(), 'models', 'fruitai-local-model');
    await fs.mkdir(path.dirname(modelPath), { recursive: true });
    
    console.log('💾 Saving trained model...');
    await fineTuner.saveModel(modelPath);

    // Save training results
    const resultsPath = path.join(process.cwd(), 'models', 'training-results.json');
    const results = {
      trainingCompleted: new Date().toISOString(),
      trainingDataSize: trainData.length,
      testDataSize: testData.length,
      finalEvaluation: evaluation,
      trainingHistory: {
        epochs: history.history?.loss?.length || 0,
        finalLoss: history.history?.loss?.slice(-1)[0] || 0,
        finalValLoss: history.history?.val_loss?.slice(-1)[0] || 0
      }
    };

    await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));

    console.log('✅ Training completed successfully!');
    console.log('==========================================');
    console.log(`📊 Final Results:`);
    console.log(`   Fruit Classification Accuracy: ${(evaluation.accuracy * 100).toFixed(2)}%`);
    console.log(`   Freshness Prediction Error: ${(evaluation.freshnessError * 100).toFixed(2)}%`);
    console.log(`💾 Model saved to: ${modelPath}`);
    console.log(`📋 Results saved to: ${resultsPath}`);

  } catch (error) {
    console.error('❌ Training failed:', error);
    process.exit(1);
  }
}

async function loadTrainingDataFromDirectory(dirPath) {
  const trainingData = [];
  
  try {
    const files = await fs.readdir(dirPath);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    
    for (const file of imageFiles) {
      const imagePath = path.join(dirPath, file);
      const labelPath = path.join(dirPath, file.replace(/\.[^.]+$/, '.json'));
      
      try {
        // Read image and convert to base64
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = `data:image/${path.extname(file).slice(1)};base64,${imageBuffer.toString('base64')}`;
        
        // Read label file
        const labelExists = await fs.access(labelPath).then(() => true).catch(() => false);
        let label;
        
        if (labelExists) {
          const labelContent = await fs.readFile(labelPath, 'utf8');
          label = JSON.parse(labelContent);
        } else {
          // Generate default label based on filename
          const itemName = path.basename(file, path.extname(file)).split('-')[0];
          label = {
            item: itemName.charAt(0).toUpperCase() + itemName.slice(1),
            freshness: 75, // Default freshness
            characteristics: {
              color: 'Natural',
              texture: 'Smooth',
              blemishes: 'None visible',
              ripeness: 'Good'
            }
          };
        }
        
        trainingData.push({
          image: base64Image,
          label
        });
        
      } catch (error) {
        console.warn(`⚠️  Skipping ${file}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error loading training data:', error);
    throw error;
  }
  
  return trainingData;
}

// Helper function to create sample training data structure
async function createSampleTrainingStructure() {
  const sampleDir = path.join(process.cwd(), 'training-data-sample');
  await fs.mkdir(sampleDir, { recursive: true });
  
  // Create sample label file
  const sampleLabel = {
    item: 'Apple',
    freshness: 85,
    characteristics: {
      color: 'Vibrant red',
      texture: 'Smooth',
      blemishes: 'None visible',
      ripeness: 'Perfect eating stage'
    }
  };
  
  await fs.writeFile(
    path.join(sampleDir, 'apple-sample.json'),
    JSON.stringify(sampleLabel, null, 2)
  );
  
  // Create README
  const readme = `
# Training Data Structure

To train the FruitAI model with your own data:

1. Create a 'training-data' directory in the project root
2. Add fruit/vegetable images (.jpg, .png, .webp)
3. For each image, create a corresponding .json file with the same name

## Example:
- apple-fresh-1.jpg
- apple-fresh-1.json

## Label Format:
\`\`\`json
{
  "item": "Apple",
  "freshness": 85,
  "characteristics": {
    "color": "Vibrant red",
    "texture": "Smooth", 
    "blemishes": "None visible",
    "ripeness": "Perfect eating stage"
  }
}
\`\`\`

## Freshness Scale:
- 90-100: Excellent, peak freshness
- 70-89: Good, fresh and ready to eat
- 50-69: Fair, consume soon
- Below 50: Poor, avoid or use immediately
`;
  
  await fs.writeFile(path.join(sampleDir, 'README.md'), readme.trim());
  
  console.log(`📁 Sample training structure created at: ${sampleDir}`);
}

// Run training if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, createSampleTrainingStructure };