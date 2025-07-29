#!/usr/bin/env python3
"""
Organize all downloaded datasets into a unified structure for training
"""

import shutil
from pathlib import Path
import json

def organize_datasets():
    print("📁 Organizing datasets into unified structure...")
    
    # Create unified structure
    unified_dir = Path('real-training-data/unified')
    unified_dir.mkdir(parents=True, exist_ok=True)
    
    categories = ['fresh', 'rotten']
    fruits = ['apple', 'banana', 'orange']
    
    # Create directory structure
    for category in categories:
        for fruit in fruits:
            (unified_dir / category / fruit).mkdir(parents=True, exist_ok=True)
    
    # Copy from existing organized dataset
    existing_dir = Path('real-training-data/organized')
    if existing_dir.exists():
        print("   Copying from existing organized dataset...")
        for category_dir in existing_dir.iterdir():
            if category_dir.is_dir() and category_dir.name in categories:
                for fruit_dir in category_dir.iterdir():
                    if fruit_dir.is_dir() and fruit_dir.name in fruits:
                        target_dir = unified_dir / category_dir.name / fruit_dir.name
                        for img_file in fruit_dir.glob('*.jpg'):
                            shutil.copy2(img_file, target_dir / img_file.name)
    
    # TODO: Add logic for Kaggle and HuggingFace datasets
    # This requires analyzing their specific directory structures
    
    # Count final images
    total_images = 0
    summary = {}
    for category in categories:
        summary[category] = {}
        for fruit in fruits:
            count = len(list((unified_dir / category / fruit).glob('*.jpg')))
            summary[category][fruit] = count
            total_images += count
    
    # Save summary
    with open(unified_dir / 'summary.json', 'w') as f:
        json.dump({
            'total_images': total_images,
            'structure': summary,
            'created': '2025-07-29'
        }, f, indent=2)
    
    print(f"✅ Unified dataset created with {total_images} images")
    print(f"   Location: {unified_dir}")
    
    return summary

if __name__ == "__main__":
    organize_datasets()
