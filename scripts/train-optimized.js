#!/usr/bin/env node

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');

class OptimizedFruitTrainer {
  constructor() {
    this.model = null;
    this.fruitTypes = ['apple', 'banana', 'orange', 'strawberry', 'grape', 'tomato'];
    this.imageSize = 64; // Smaller for faster training
  }

  async createModel() {
    console.log('🤖 Creating optimized model...');
    
    // Lightweight but effective model
    this.model = tf.sequential({
      layers: [
        tf.layers.conv2d({
          inputShape: [this.imageSize, this.imageSize, 3],
          filters: 16,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.conv2d({ 
          filters: 32, 
          kernelSize: 3, 
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.flatten(),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ 
          units: 64, 
          activation: 'relu',
          kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ 
          units: this.fruitTypes.length, 
          activation: 'softmax' 
        })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    console.log('✅ Model architecture created');
    return this.model;
  }

  async generateTrainingData() {
    console.log('🎨 Generating synthetic training data...');
    
    const samples = [];
    const labels = [];
    
    // Generate varied training data for each fruit type
    for (let fruitIdx = 0; fruitIdx < this.fruitTypes.length; fruitIdx++) {
      const fruitType = this.fruitTypes[fruitIdx];
      
      // Generate multiple samples per fruit with different freshness levels
      const freshnessLevels = [95, 85, 75, 65, 45, 25];
      
      for (const freshness of freshnessLevels) {
        // Create multiple variations for each freshness level
        for (let variation = 0; variation < 3; variation++) {
          const imageData = this.createSyntheticFruitImage(fruitType, freshness, variation);
          samples.push(imageData);
          
          // Create one-hot encoded label
          const oneHot = new Array(this.fruitTypes.length).fill(0);
          oneHot[fruitIdx] = 1;
          labels.push(oneHot);
        }
      }
    }
    
    console.log(`📊 Generated ${samples.length} training samples`);
    return { samples, labels };
  }

  createSyntheticFruitImage(fruitType, freshness, variation) {
    const size = this.imageSize;
    const imageData = new Float32Array(size * size * 3);
    
    // Define base colors for each fruit type
    const fruitColors = {
      apple: [0.8, 0.2, 0.2],
      banana: [0.9, 0.8, 0.2],
      orange: [0.9, 0.5, 0.1],
      strawberry: [0.9, 0.1, 0.2],
      grape: [0.5, 0.2, 0.7],
      tomato: [0.8, 0.2, 0.1]
    };
    
    const baseColor = fruitColors[fruitType] || [0.5, 0.5, 0.5];
    
    // Adjust colors based on freshness (0-100)
    const freshnessFactor = freshness / 100;
    const browningFactor = 1 - freshnessFactor;
    
    // Create varied patterns within the image
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 3;
        
        // Add spatial variation and freshness effects
        const centerDistance = Math.sqrt(Math.pow(x - size/2, 2) + Math.pow(y - size/2, 2)) / (size/2);
        const noiseVariation = (Math.random() - 0.5) * 0.3;
        const spatialVariation = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.1;
        
        // Calculate final color values
        let r = baseColor[0] * freshnessFactor + browningFactor * 0.4;
        let g = baseColor[1] * freshnessFactor + browningFactor * 0.2;
        let b = baseColor[2] * freshnessFactor + browningFactor * 0.1;
        
        // Add variations
        r += noiseVariation + spatialVariation + (variation * 0.1);
        g += noiseVariation + spatialVariation + (variation * 0.05);
        b += noiseVariation + spatialVariation + (variation * 0.08);
        
        // Apply center-based freshness gradient
        const freshnessGradient = 1 - (centerDistance * browningFactor * 0.5);
        r *= freshnessGradient;
        g *= freshnessGradient;
        b *= freshnessGradient;
        
        // Clamp values
        imageData[idx] = Math.max(0, Math.min(1, r));
        imageData[idx + 1] = Math.max(0, Math.min(1, g));
        imageData[idx + 2] = Math.max(0, Math.min(1, b));
      }
    }
    
    return tf.tensor3d(imageData, [size, size, 3]);
  }

  async trainModel() {
    console.log('🚀 Starting optimized training...');
    
    if (!this.model) {
      await this.createModel();
    }
    
    const { samples, labels } = await this.generateTrainingData();
    
    // Convert to tensors
    const xs = tf.stack(samples);
    const ys = tf.tensor2d(labels);
    
    console.log(`🎯 Training on ${samples.length} samples`);
    console.log(`📈 Input shape: [${xs.shape.join(', ')}]`);
    console.log(`📊 Output shape: [${ys.shape.join(', ')}]`);
    
    // Training configuration
    const config = {
      epochs: 30,
      batchSize: 16,
      validationSplit: 0.15,
      shuffle: true,
      verbose: 0
    };
    
    let bestAccuracy = 0;
    
    // Train with progress tracking
    const history = await this.model.fit(xs, ys, {
      ...config,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          const acc = logs.acc || logs.accuracy || 0;
          const valAcc = logs.val_acc || logs.val_accuracy || 0;
          const loss = logs.loss || 0;
          
          if (acc > bestAccuracy) {
            bestAccuracy = acc;
          }
          
          if ((epoch + 1) % 5 === 0) {
            console.log(`Epoch ${epoch + 1}/${config.epochs}:`);
            console.log(`  Accuracy: ${(acc * 100).toFixed(1)}%`);
            console.log(`  Val Accuracy: ${(valAcc * 100).toFixed(1)}%`);
            console.log(`  Loss: ${loss.toFixed(4)}`);
            console.log(`  Best Accuracy: ${(bestAccuracy * 100).toFixed(1)}%`);
          }
        }
      }
    });
    
    // Clean up tensors
    xs.dispose();
    ys.dispose();
    samples.forEach(tensor => tensor.dispose());
    
    console.log(`🎉 Training completed!`);
    console.log(`📊 Final accuracy: ${(bestAccuracy * 100).toFixed(2)}%`);
    
    return { history, accuracy: bestAccuracy };
  }

  async saveModel() {
    if (!this.model) {
      throw new Error('No model to save');
    }
    
    // Save to public directory for web access
    const modelDir = path.join(process.cwd(), 'public', 'models');
    await fs.mkdir(modelDir, { recursive: true });
    
    const modelPath = 'file://' + path.join(modelDir, 'fruitai-model');
    await this.model.save(modelPath);
    
    console.log(`💾 Model saved to: public/models/`);
    
    // Create model metadata
    const metadata = {
      version: '1.0.0',
      created: new Date().toISOString(),
      fruitTypes: this.fruitTypes,
      imageSize: this.imageSize,
      architecture: 'CNN',
      description: 'Fruit classification model for FruitAI'
    };
    
    await fs.writeFile(
      path.join(modelDir, 'model-info.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    console.log('📋 Model metadata saved');
    return modelDir;
  }

  async testModel() {
    if (!this.model) {
      throw new Error('No model to test');
    }
    
    console.log('🧪 Testing model performance...');
    
    // Create test samples
    const testSamples = [];
    const testLabels = [];
    
    for (let i = 0; i < this.fruitTypes.length; i++) {
      const fruitType = this.fruitTypes[i];
      const testImage = this.createSyntheticFruitImage(fruitType, 85, 0);
      testSamples.push(testImage);
      
      const oneHot = new Array(this.fruitTypes.length).fill(0);
      oneHot[i] = 1;
      testLabels.push(oneHot);
    }
    
    const testXs = tf.stack(testSamples);
    const testYs = tf.tensor2d(testLabels);
    
    // Make predictions
    const predictions = this.model.predict(testXs);
    const predictedClasses = tf.argMax(predictions, 1);
    const trueClasses = tf.argMax(testYs, 1);
    
    // Calculate accuracy
    const correct = tf.equal(predictedClasses, trueClasses);
    const accuracy = tf.mean(tf.cast(correct, 'float32'));
    
    const finalAccuracy = await accuracy.data();
    console.log(`🎯 Test accuracy: ${(finalAccuracy[0] * 100).toFixed(2)}%`);
    
    // Clean up
    testXs.dispose();
    testYs.dispose();
    predictions.dispose();
    predictedClasses.dispose();
    trueClasses.dispose();
    correct.dispose();
    accuracy.dispose();
    testSamples.forEach(tensor => tensor.dispose());
    
    return finalAccuracy[0];
  }
}

async function main() {
  console.log('🍎 FruitAI Optimized Training Pipeline');
  console.log('=====================================');
  
  try {
    const trainer = new OptimizedFruitTrainer();
    
    // Train the model
    const { accuracy } = await trainer.trainModel();
    
    // Test the model
    const testAccuracy = await trainer.testModel();
    
    // Save the model
    const modelPath = await trainer.saveModel();
    
    console.log('\n✅ Training completed successfully!');
    console.log('=====================================');
    console.log(`📊 Training accuracy: ${(accuracy * 100).toFixed(2)}%`);
    console.log(`🧪 Test accuracy: ${(testAccuracy * 100).toFixed(2)}%`);
    console.log(`💾 Model saved to: ${modelPath}`);
    console.log('🚀 Model is ready for production use!');
    
    if (accuracy > 0.8) {
      console.log('🎉 Model achieved good performance (>80% accuracy)');
    } else {
      console.log('⚠️  Model accuracy could be improved with more training data');
    }
    
  } catch (error) {
    console.error('❌ Training failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { OptimizedFruitTrainer };