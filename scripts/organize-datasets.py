#!/usr/bin/env python3
"""
Organize downloaded fruit and vegetable datasets into a unified structure
This script processes multiple datasets and creates a standardized training set
"""

import os
import shutil
import json
from pathlib import Path
from PIL import Image
import numpy as np
from collections import defaultdict

class DatasetOrganizer:
    def __init__(self):
        self.base_dir = Path('real-training-data')
        self.organized_dir = self.base_dir / 'organized'
        self.stats = defaultdict(lambda: defaultdict(int))
        
        # Define fruit and vegetable mappings
        self.fruit_mappings = {
            # Common variations and spellings
            'apple': ['apple', 'apples'],
            'banana': ['banana', 'bananas'],
            'orange': ['orange', 'oranges'],
            'tomato': ['tomato', 'tomatoes'],
            'cucumber': ['cucumber', 'cucumbers'],
            'bell_pepper': ['bell_pepper', 'capsicum', 'pepper', 'peppers'],
            'strawberry': ['strawberry', 'strawberries'],
            'grape': ['grape', 'grapes'],
            'lime': ['lime', 'limes'],
            'lemon': ['lemon', 'lemons'],
            'onion': ['onion', 'onions'],
            'potato': ['potato', 'potatoes'],
            'bitter_gourd': ['bitter_gourd', 'bittergourd'],
            'brinjal': ['brinjal', 'eggplant', 'aubergine'],
            'guava': ['guava'],
            'chili': ['chili', 'chilli', 'pepper']
        }
        
        # Quality mappings
        self.quality_mappings = {
            'fresh': ['fresh', 'good', 'healthy', 'pure-fresh', 'pure_fresh'],
            'rotten': ['rotten', 'bad', 'stale', 'spoiled', 'rotten_diseased', 'medium-fresh', 'medium_fresh']
        }

    def identify_fruit_type(self, path_str):
        """Identify fruit type from path or filename"""
        path_str = path_str.lower()
        
        for fruit, variations in self.fruit_mappings.items():
            for variation in variations:
                if variation in path_str:
                    return fruit
        return 'unknown'

    def identify_quality(self, path_str):
        """Identify quality from path or filename"""
        path_str = path_str.lower()
        
        for quality, variations in self.quality_mappings.items():
            for variation in variations:
                if variation in path_str:
                    return quality
        return 'unknown'

    def is_valid_image(self, file_path):
        """Check if file is a valid image"""
        try:
            with Image.open(file_path) as img:
                img.verify()
            return True
        except:
            return False

    def process_image(self, src_path, dst_path):
        """Process and copy image with standardization"""
        try:
            with Image.open(src_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if too large (save space)
                if img.size[0] > 512 or img.size[1] > 512:
                    img.thumbnail((512, 512), Image.Resampling.LANCZOS)
                
                # Save with optimization
                img.save(dst_path, 'JPEG', quality=85, optimize=True)
                return True
        except Exception as e:
            print(f"⚠️  Failed to process {src_path}: {e}")
            return False

    def organize_dataset_folder(self, dataset_folder):
        """Organize a specific dataset folder"""
        print(f"\n📂 Processing dataset: {dataset_folder.name}")
        
        processed_count = 0
        
        # Walk through all files in the dataset
        for file_path in dataset_folder.rglob('*'):
            if not file_path.is_file():
                continue
                
            # Check if it's an image
            if file_path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.bmp']:
                continue
            
            # Identify fruit type and quality from path
            path_str = str(file_path)
            fruit_type = self.identify_fruit_type(path_str)
            quality = self.identify_quality(path_str)
            
            if fruit_type == 'unknown' or quality == 'unknown':
                # Try to infer from parent directories
                parts = file_path.parts
                for part in parts:
                    if fruit_type == 'unknown':
                        fruit_type = self.identify_fruit_type(part)
                    if quality == 'unknown':
                        quality = self.identify_quality(part)
            
            if fruit_type != 'unknown' and quality != 'unknown':
                # Create destination path
                dst_dir = self.organized_dir / quality / fruit_type
                dst_dir.mkdir(parents=True, exist_ok=True)
                
                # Create unique filename
                base_name = f"{dataset_folder.name}_{processed_count:04d}.jpg"
                dst_path = dst_dir / base_name
                
                # Process and copy image
                if self.process_image(file_path, dst_path):
                    self.stats[quality][fruit_type] += 1
                    processed_count += 1
        
        print(f"   ✅ Processed {processed_count} images")

    def create_training_metadata(self):
        """Create metadata for training"""
        metadata = {
            'dataset_info': {
                'name': 'FruitAI Comprehensive Freshness Dataset',
                'version': '2.0.0',
                'created': '2025-01-29',
                'description': 'Comprehensive fruit and vegetable freshness dataset compiled from multiple Kaggle sources',
                'total_images': sum(sum(fruits.values()) for fruits in self.stats.values()),
                'classes': len(self.stats),
                'fruits_vegetables': list(set().union(*[fruits.keys() for fruits in self.stats.values()]))
            },
            'statistics': dict(self.stats),
            'quality_labels': {
                'fresh': 1,
                'rotten': 0
            },
            'fruit_labels': {fruit: idx for idx, fruit in enumerate(sorted(set().union(*[fruits.keys() for fruits in self.stats.values()])))}
        }
        
        with open(self.organized_dir / 'metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n📋 Created metadata.json")
        return metadata

    def print_statistics(self, metadata):
        """Print dataset statistics"""
        print(f"\n📊 Dataset Statistics:")
        print(f"   Total Images: {metadata['dataset_info']['total_images']}")
        print(f"   Quality Classes: {len(self.stats)}")
        print(f"   Fruit/Vegetable Types: {len(metadata['dataset_info']['fruits_vegetables'])}")
        
        print(f"\n🍎 By Quality:")
        for quality, fruits in self.stats.items():
            total = sum(fruits.values())
            print(f"   {quality.capitalize()}: {total} images")
            for fruit, count in sorted(fruits.items()):
                print(f"     - {fruit}: {count}")

    def organize_all_datasets(self):
        """Organize all downloaded datasets"""
        print("🗂️  Organizing Dataset Structure")
        print("===============================")
        
        # Find all dataset folders
        dataset_folders = [d for d in self.base_dir.iterdir() if d.is_dir() and d.name != 'organized']
        
        if not dataset_folders:
            print("❌ No dataset folders found!")
            print("   Please run download-datasets.py first")
            return False
        
        print(f"Found {len(dataset_folders)} dataset folders")
        
        # Process each dataset
        for dataset_folder in dataset_folders:
            self.organize_dataset_folder(dataset_folder)
        
        # Create metadata
        metadata = self.create_training_metadata()
        
        # Print statistics
        self.print_statistics(metadata)
        
        if metadata['dataset_info']['total_images'] == 0:
            print("\n❌ No images were organized!")
            print("   Please check that datasets were downloaded correctly")
            return False
        
        print(f"\n✅ Dataset organization complete!")
        print(f"   Organized data available in: {self.organized_dir}")
        print(f"   Ready for training with {metadata['dataset_info']['total_images']} images")
        
        return True

def main():
    organizer = DatasetOrganizer()
    success = organizer.organize_all_datasets()
    
    if success:
        print(f"\n🚀 Next steps:")
        print(f"   1. Run: python scripts/train-real-model.py")
        print(f"   2. Test the improved model accuracy")
    else:
        print(f"\n💡 Troubleshooting:")
        print(f"   1. Ensure datasets were downloaded correctly")
        print(f"   2. Check real-training-data/ directory contents")
        print(f"   3. Run download-datasets.py if needed")

if __name__ == "__main__":
    main()