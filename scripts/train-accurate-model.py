#!/usr/bin/env python3
"""
Train a highly accurate fruit freshness model
Focus on distinguishing fresh vs rotten with high accuracy
"""

import os
import json
import numpy as np
from pathlib import Path
from PIL import Image
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, applications
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt

class AccurateFreshnessTrainer:
    def __init__(self):
        self.base_dir = Path('real-training-data/organized')
        self.model_dir = Path('public/models')
        self.img_size = (224, 224)
        self.batch_size = 16
        self.epochs = 30
        
    def load_dataset(self):
        """Load the organized dataset"""
        print("📂 Loading dataset...")
        
        images = []
        labels = []
        fruit_types = []
        
        label_map = {'fresh': 1, 'rotten': 0}
        
        for quality_dir in self.base_dir.iterdir():
            if not quality_dir.is_dir():
                continue
                
            quality = quality_dir.name
            quality_label = label_map.get(quality, 0)
            
            print(f"   Loading {quality} images...")
            
            for fruit_dir in quality_dir.iterdir():
                if not fruit_dir.is_dir():
                    continue
                    
                fruit = fruit_dir.name
                for img_path in fruit_dir.glob('*.jpg'):
                    try:
                        # Load and preprocess image
                        img = Image.open(img_path)
                        img = img.convert('RGB')
                        img = img.resize(self.img_size)
                        img_array = np.array(img) / 255.0
                        
                        images.append(img_array)
                        labels.append(quality_label)
                        fruit_types.append(fruit)
                        
                    except Exception as e:
                        print(f"⚠️  Failed to load {img_path}: {e}")
        
        self.images = np.array(images)
        self.labels = np.array(labels)
        self.fruit_types = np.array(fruit_types)
        
        print(f"✅ Dataset loaded: {len(self.images)} images")
        print(f"   Fresh: {np.sum(self.labels == 1)}")
        print(f"   Rotten: {np.sum(self.labels == 0)}")
        
    def create_model(self):
        """Create an accurate freshness detection model"""
        print("🤖 Creating high-accuracy model...")
        
        # Use ResNet50 as backbone (proven for image classification)
        base_model = applications.ResNet50(
            weights='imagenet',
            include_top=False,
            input_shape=(*self.img_size, 3)
        )
        
        # Freeze base model
        base_model.trainable = False
        
        # Build model
        inputs = keras.Input(shape=(*self.img_size, 3))
        
        # Data augmentation for better generalization
        augmented = keras.Sequential([
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.15),
            layers.RandomZoom(0.15),
            layers.RandomBrightness(0.2),
            layers.RandomContrast(0.2),
        ])(inputs)
        
        # Feature extraction
        features = base_model(augmented, training=False)
        pooled = layers.GlobalAveragePooling2D()(features)
        
        # Classification head
        x = layers.Dense(512, activation='relu')(pooled)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(0.5)(x)
        
        x = layers.Dense(256, activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(0.3)(x)
        
        x = layers.Dense(128, activation='relu')(x)
        x = layers.Dropout(0.2)(x)
        
        # Output layer (binary classification: fresh=1, rotten=0)
        outputs = layers.Dense(1, activation='sigmoid', name='freshness')(x)
        
        self.model = keras.Model(inputs, outputs, name='FruitFreshnessClassifier')
        
        # Compile with appropriate metrics
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        print("✅ Model created")
        self.model.summary()
        
    def train_model(self):
        """Train the model for high accuracy"""
        print("🚀 Training model for maximum accuracy...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            self.images, self.labels, 
            test_size=0.2, 
            random_state=42, 
            stratify=self.labels
        )
        
        X_train, X_val, y_train, y_val = train_test_split(
            X_train, y_train,
            test_size=0.2,
            random_state=42,
            stratify=y_train
        )
        
        print(f"📊 Data split:")
        print(f"   Training: {len(X_train)} images")
        print(f"   Validation: {len(X_val)} images") 
        print(f"   Test: {len(X_test)} images")
        
        # Callbacks for best performance
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=8,
                restore_best_weights=True,
                verbose=1
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_accuracy',
                factor=0.3,
                patience=4,
                min_lr=1e-7,
                verbose=1
            ),
            keras.callbacks.ModelCheckpoint(
                str(self.model_dir / 'best_freshness_model.keras'),
                monitor='val_accuracy',
                save_best_only=True,
                verbose=1
            )
        ]
        
        # Train
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=self.epochs,
            batch_size=self.batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluate on test set
        print("\n🧪 Final evaluation on test set:")
        test_loss, test_accuracy, test_precision, test_recall = self.model.evaluate(
            X_test, y_test, verbose=1
        )
        
        # Detailed predictions
        y_pred = self.model.predict(X_test)
        y_pred_binary = (y_pred > 0.5).astype(int).flatten()
        
        # Classification report
        print("\n📊 Detailed Results:")
        print(f"   Accuracy: {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
        print(f"   Precision: {test_precision:.4f}")
        print(f"   Recall: {test_recall:.4f}")
        
        print("\n📋 Classification Report:")
        print(classification_report(y_test, y_pred_binary, 
                                   target_names=['Rotten', 'Fresh']))
        
        print("\n🔍 Confusion Matrix:")
        cm = confusion_matrix(y_test, y_pred_binary)
        print(f"                 Predicted")
        print(f"Actual    Rotten  Fresh")
        print(f"Rotten      {cm[0,0]:3d}    {cm[0,1]:3d}")
        print(f"Fresh       {cm[1,0]:3d}    {cm[1,1]:3d}")
        
        return history, test_accuracy
    
    def fine_tune_model(self):
        """Fine-tune the model for even better accuracy"""
        print("🔧 Fine-tuning for maximum accuracy...")
        
        # Unfreeze some layers
        base_model = None
        for layer in self.model.layers:
            if isinstance(layer, keras.Model) and 'resnet' in layer.name.lower():
                base_model = layer
                break
        
        if base_model:
            base_model.trainable = True
            
            # Fine-tune from this layer onwards  
            fine_tune_at = len(base_model.layers) - 20
            
            for layer in base_model.layers[:fine_tune_at]:
                layer.trainable = False
            
            # Lower learning rate for fine-tuning
            self.model.compile(
                optimizer=keras.optimizers.Adam(learning_rate=0.0001),
                loss='binary_crossentropy',
                metrics=['accuracy', 'precision', 'recall']
            )
            
            print("✅ Model prepared for fine-tuning")
        
    def save_model_for_javascript(self):
        """Save model in a format that can be used with JavaScript"""
        print("💾 Saving model for JavaScript...")
        
        self.model_dir.mkdir(parents=True, exist_ok=True)
        
        # Save in Keras format first
        keras_model_path = self.model_dir / 'freshness_model.keras'
        self.model.save(keras_model_path)
        
        # Create a simple JavaScript-compatible model
        simple_model = keras.Sequential([
            layers.Input(shape=(*self.img_size, 3)),
            layers.Rescaling(1./255),
            layers.Conv2D(32, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Conv2D(64, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.Conv2D(128, 3, activation='relu'),
            layers.MaxPooling2D(),
            layers.GlobalAveragePooling2D(),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(1, activation='sigmoid')
        ])
        
        # Train the simple model on our data
        print("🔄 Training lightweight model for JavaScript...")
        simple_model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        # Quick training
        X_train, X_test, y_train, y_test = train_test_split(
            self.images, self.labels, test_size=0.2, random_state=42
        )
        
        simple_model.fit(X_train, y_train, epochs=10, verbose=0)
        simple_accuracy = simple_model.evaluate(X_test, y_test, verbose=0)[1]
        
        # Save simple model
        simple_model.save(str(self.model_dir / 'fruitai-simple-model'))
        
        print(f"✅ Models saved:")
        print(f"   Full model: {keras_model_path}")
        print(f"   Simple model: {self.model_dir / 'fruitai-simple-model'}")
        print(f"   Simple model accuracy: {simple_accuracy:.2%}")
        
        # Save model metadata
        metadata = {
            'version': '2.1.0',
            'created': '2025-01-29',
            'architecture': 'ResNet50 + Custom Head',
            'simple_architecture': 'Lightweight CNN',
            'input_size': list(self.img_size),
            'classes': ['rotten', 'fresh'],
            'description': 'High-accuracy fruit freshness detection model'
        }
        
        with open(self.model_dir / 'model-metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return simple_accuracy

def main():
    print("🍎 FruitAI High-Accuracy Training")
    print("=================================")
    
    # Check if dataset exists
    data_dir = Path('real-training-data/organized')
    if not data_dir.exists():
        print("❌ Dataset not found!")
        print("   Please run: python3 scripts/download-fresh-rotten-dataset.py")
        return
    
    trainer = AccurateFreshnessTrainer()
    
    try:
        # Load data and train
        trainer.load_dataset()
        trainer.create_model()
        history, accuracy = trainer.train_model()
        
        # Fine-tune if needed
        if accuracy < 0.95:
            print(f"\n🔄 Accuracy ({accuracy:.2%}) can be improved, fine-tuning...")
            trainer.fine_tune_model()
            
            # Continue training with fine-tuning
            X_train, X_test, y_train, y_test = train_test_split(
                trainer.images, trainer.labels, test_size=0.2, random_state=42
            )
            
            trainer.model.fit(X_train, y_train, epochs=5, verbose=1)
            final_accuracy = trainer.model.evaluate(X_test, y_test)[1]
            print(f"   Fine-tuned accuracy: {final_accuracy:.2%}")
            accuracy = final_accuracy
        
        # Save models
        simple_accuracy = trainer.save_model_for_javascript()
        
        print(f"\n🎉 Training completed!")
        print(f"   Full model accuracy: {accuracy:.2%}")
        print(f"   Simple model accuracy: {simple_accuracy:.2%}")
        
        if accuracy >= 0.95:
            print("🎯 Excellent accuracy achieved!")
        elif accuracy >= 0.90:
            print("✅ Very good accuracy achieved!")
        else:
            print("⚠️  Accuracy could be improved with more diverse data")
            
        print(f"\n📁 Models saved to: {trainer.model_dir}")
        print("🚀 Ready to integrate with FruitAI application!")
        
    except Exception as e:
        print(f"❌ Training failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()