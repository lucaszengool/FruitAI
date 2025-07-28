# FruitAI - Local AI Implementation

This document explains how FruitAI has been converted from using OpenAI's API to local pretrained models with fine-tuning capabilities.

## 🎯 Overview

The project now uses:
- **TensorFlow.js** for browser and Node.js inference
- **MobileNet** as the base pretrained model for feature extraction
- **Custom neural network** for fruit freshness classification
- **Transfer learning** and fine-tuning for project-specific accuracy

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run with Local AI
```bash
npm run dev
```

The application will automatically use the local AI model instead of OpenAI's API.

## 🔧 Model Architecture

### Base Model: MobileNetV2
- **Purpose**: Feature extraction from fruit images
- **Input**: 224x224x3 RGB images
- **Output**: 1280-dimensional feature vectors
- **Advantages**: Lightweight, fast inference, mobile-optimized

### Custom Classification Head
```
Input: MobileNet features (1280 dims)
↓
Dense Layer (256 units, ReLU)
↓
Dropout (0.3)
↓
Dense Layer (128 units, ReLU)
↓
Dense Layer (64 units, ReLU)
↓
Output Branches:
├── Fruit Type (10 classes, Softmax)
└── Freshness Score (1 unit, Sigmoid)
```

## 🎓 Fine-Tuning Process

### 1. Prepare Training Data
Create a `training-data/` directory with:
```
training-data/
├── apple-fresh-1.jpg
├── apple-fresh-1.json
├── orange-good-1.jpg
├── orange-good-1.json
└── ...
```

### 2. Label Format
```json
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
```

### 3. Train the Model
```bash
# Create sample training structure
npm run create-training-sample

# Train with your data
npm run train-model
```

### 4. Training Output
- **Model**: Saved to `models/fruitai-local-model/`
- **Results**: Saved to `models/training-results.json`
- **Metrics**: Classification accuracy and freshness prediction error

## 📊 Feature Extraction

The local AI extracts multiple types of features:

### Color Features
- RGB channel means and standard deviations
- Color distribution analysis
- Brightness and contrast metrics

### Texture Features
- Sobel edge detection for texture analysis
- Gradient magnitude statistics
- Surface smoothness indicators

### Shape Features
- Edge density and distribution
- Contour characteristics
- Size consistency measures

## 🔍 Analysis Pipeline

1. **Image Preprocessing**
   - Resize to 224x224 pixels
   - Normalize pixel values (0-1)
   - Color space optimization

2. **Feature Extraction**
   - MobileNet backbone processing
   - Custom feature analysis
   - Multi-dimensional feature vectors

3. **Classification**
   - Fruit type identification
   - Freshness score prediction (0-100)
   - Confidence assessment

4. **Post-processing**
   - Recommendation generation (buy/check/avoid)
   - Characteristic description
   - Detailed analysis text

## ⚡ Performance Optimizations

### Model Optimizations
- **Quantization**: Reduced model size for faster loading
- **Pruning**: Removed unnecessary connections
- **Caching**: Model loaded once and reused

### Image Processing
- **Sharp**: High-performance image processing
- **Memory Management**: Efficient tensor operations
- **Batch Processing**: Multiple images when available

## 🎛️ Configuration

### Fine-tuning Parameters
```typescript
const config = {
  learningRate: 0.0001,    // Learning rate for training
  batchSize: 16,           // Training batch size
  epochs: 50,              // Number of training epochs
  validationSplit: 0.2,    // Validation data percentage
  imageSize: [224, 224]    // Input image dimensions
};
```

### Model Behavior
- **Confidence Threshold**: 85% for local AI predictions
- **Fallback**: Enhanced heuristic analysis if model fails
- **Cache Duration**: Models cached for session lifetime

## 📈 Accuracy Improvements

### Data Augmentation
- **Brightness variations**: ±20% brightness changes
- **Rotation**: Small angle rotations
- **Crop variations**: Random crops with different scales

### Transfer Learning Benefits
- **Pre-trained weights**: Leverages ImageNet knowledge
- **Feature reuse**: Common visual patterns recognized
- **Faster convergence**: Reduced training time

### Fine-tuning Strategies
- **Frozen base layers**: Preserve general features
- **Gradual unfreezing**: Progressive layer training
- **Learning rate scheduling**: Adaptive learning rates

## 🛠️ Development Commands

```bash
# Development server with local AI
npm run dev

# Build production version
npm run build

# Type checking
npm run type-check

# Train custom model
npm run train-model

# Create training data template
npm run create-training-sample
```

## 📝 Migration from OpenAI

### Changes Made
1. **Removed**: OpenAI dependency and API calls
2. **Added**: TensorFlow.js and image processing libraries
3. **Created**: Local AI inference engine
4. **Implemented**: Fine-tuning pipeline
5. **Enhanced**: Fallback analysis system

### Benefits
- ✅ **No API costs**: Completely free to run
- ✅ **Privacy**: No data sent to external services
- ✅ **Speed**: Faster inference after model loading
- ✅ **Offline**: Works without internet connection
- ✅ **Customizable**: Fine-tune for specific use cases

### Considerations
- ⚠️ **Initial setup**: Requires model training/fine-tuning
- ⚠️ **Resource usage**: Higher memory usage for model
- ⚠️ **First load**: Model download on first use

## 🔧 Troubleshooting

### Common Issues

1. **Model Loading Fails**
   ```bash
   # Clear browser cache and reload
   # Check network connectivity for initial model download
   ```

2. **Training Data Issues**
   ```bash
   # Ensure images are in supported formats (jpg, png, webp)
   # Verify JSON label files have correct structure
   ```

3. **Performance Issues**
   ```bash
   # Reduce batch size in training config
   # Use smaller image sizes for faster processing
   ```

### Debug Mode
Set `NODE_ENV=development` to enable detailed logging:
```bash
NODE_ENV=development npm run dev
```

## 🚀 Future Enhancements

### Planned Features
- **Model versioning**: Support for multiple model versions
- **Online learning**: Continuous improvement from user feedback
- **Edge deployment**: Optimized models for mobile devices
- **Multi-language**: Support for different fruit naming conventions

### Advanced Training
- **Adversarial training**: Improved robustness
- **Semi-supervised learning**: Learn from unlabeled data
- **Active learning**: Smart sample selection for labeling

---

## 📞 Support

For issues with the local AI implementation:
1. Check the console for error messages
2. Verify training data format
3. Ensure sufficient system resources
4. Review this documentation for troubleshooting steps

The local AI system provides a robust, privacy-focused alternative to cloud-based AI services while maintaining high accuracy through fine-tuning capabilities.