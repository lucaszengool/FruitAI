#!/usr/bin/env python3
"""
Download comprehensive fruit and vegetable freshness datasets from Kaggle
This script downloads multiple datasets to create a comprehensive training set
"""

import os
import subprocess
import sys
from pathlib import Path

# Kaggle datasets to download (most recent and comprehensive)
DATASETS = [
    {
        'name': 'nourabdoun/fruits-quality-fresh-vs-rotten',
        'folder': 'fruits-quality-2024',
        'description': 'Fruits Quality (Fresh VS Rotten) - July 2024'
    },
    {
        'name': 'muhammad0subhan/fruit-and-vegetable-disease-healthy-vs-rotten', 
        'folder': 'fruit-vegetable-disease-2024',
        'description': 'Fruit and Vegetable Disease (Healthy vs Rotten) - May 2024'
    },
    {
        'name': 'filipemonteir/fresh-and-rotten-fruits-and-vegetables',
        'folder': 'fresh-rotten-2024',
        'description': 'Fresh and Rotten - Fruits and Vegetables - May 2024'
    },
    {
        'name': 'sriramr/fruits-fresh-and-rotten-for-classification',
        'folder': 'fruits-classification',
        'description': 'Fruits fresh and rotten for classification'
    },
    {
        'name': 'raghavrpotdar/fresh-and-stale-images-of-fruits-and-vegetables',
        'folder': 'fresh-stale-images',
        'description': 'Fresh and Stale Images of Fruits and Vegetables'
    },
    {
        'name': 'swoyam2609/fresh-and-stale-classification',
        'folder': 'fresh-stale-classification',
        'description': 'Fresh and Rotten Classification - 2023'
    }
]

def check_kaggle_setup():
    """Check if Kaggle API is properly set up"""
    try:
        result = subprocess.run(['kaggle', '--version'], capture_output=True, text=True)
        print(f"✅ Kaggle API found: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ Kaggle API not found. Please install it:")
        print("   pip install kaggle")
        print("   Then set up your Kaggle API credentials:")
        print("   1. Go to https://www.kaggle.com/account")
        print("   2. Create New API Token")
        print("   3. Place kaggle.json in ~/.kaggle/ (Linux/Mac) or C:\\Users\\<username>\\.kaggle\\ (Windows)")
        return False
    except Exception as e:
        print(f"❌ Error checking Kaggle API: {e}")
        return False

def download_dataset(name, folder, description):
    """Download a specific dataset from Kaggle"""
    print(f"\n📥 Downloading: {description}")
    print(f"   Dataset: {name}")
    
    # Create target directory
    target_dir = Path('real-training-data') / folder
    target_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Download dataset
        cmd = ['kaggle', 'datasets', 'download', '-d', name, '-p', str(target_dir), '--unzip']
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print(f"✅ Successfully downloaded {name}")
            
            # Count files
            total_files = sum(1 for _ in target_dir.rglob('*') if _.is_file())
            image_files = sum(1 for _ in target_dir.rglob('*.jpg')) + \
                         sum(1 for _ in target_dir.rglob('*.png')) + \
                         sum(1 for _ in target_dir.rglob('*.jpeg'))
            
            print(f"   📊 Total files: {total_files}, Images: {image_files}")
            return True
        else:
            print(f"❌ Failed to download {name}")
            print(f"   Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"⏰ Download timeout for {name}")
        return False
    except Exception as e:
        print(f"❌ Error downloading {name}: {e}")
        return False

def create_dataset_structure():
    """Create organized dataset structure"""
    print("\n📁 Creating dataset structure...")
    
    # Create main directories
    base_dir = Path('real-training-data')
    base_dir.mkdir(exist_ok=True)
    
    (base_dir / 'organized').mkdir(exist_ok=True)
    
    # Create fruit/vegetable directories
    categories = {
        'fresh': ['apple', 'banana', 'orange', 'tomato', 'cucumber', 'bell_pepper', 
                 'strawberry', 'grape', 'lime', 'lemon', 'onion', 'potato'],
        'rotten': ['apple', 'banana', 'orange', 'tomato', 'cucumber', 'bell_pepper',
                  'strawberry', 'grape', 'lime', 'lemon', 'onion', 'potato']
    }
    
    for quality in categories:
        for fruit in categories[quality]:
            (base_dir / 'organized' / quality / fruit).mkdir(parents=True, exist_ok=True)
    
    print("✅ Dataset structure created")

def create_download_instructions():
    """Create instructions for manual download if needed"""
    instructions = """
# Dataset Download Instructions

If the automatic download fails, you can manually download datasets:

## Prerequisites
1. Install Kaggle API: `pip install kaggle`
2. Set up Kaggle credentials:
   - Go to https://www.kaggle.com/account
   - Create New API Token
   - Place kaggle.json in ~/.kaggle/ directory

## Manual Download Commands

```bash
# Create directories
mkdir -p real-training-data

# Download datasets (run these commands individually)
kaggle datasets download -d nourabdoun/fruits-quality-fresh-vs-rotten -p real-training-data/fruits-quality-2024 --unzip
kaggle datasets download -d muhammad0subhan/fruit-and-vegetable-disease-healthy-vs-rotten -p real-training-data/fruit-vegetable-disease-2024 --unzip
kaggle datasets download -d filipemonteir/fresh-and-rotten-fruits-and-vegetables -p real-training-data/fresh-rotten-2024 --unzip
kaggle datasets download -d sriramr/fruits-fresh-and-rotten-for-classification -p real-training-data/fruits-classification --unzip
kaggle datasets download -d raghavrpotdar/fresh-and-stale-images-of-fruits-and-vegetables -p real-training-data/fresh-stale-images --unzip
kaggle datasets download -d swoyam2609/fresh-and-stale-classification -p real-training-data/fresh-stale-classification --unzip
```

## After Download
Run: `python scripts/organize-datasets.py` to organize the data for training.
"""
    
    with open('real-training-data/DOWNLOAD_INSTRUCTIONS.md', 'w') as f:
        f.write(instructions)
    
    print("📝 Created download instructions: real-training-data/DOWNLOAD_INSTRUCTIONS.md")

def main():
    print("🍎 FruitAI Dataset Downloader")
    print("=============================")
    print("Downloading comprehensive fruit and vegetable freshness datasets...")
    
    # Check Kaggle setup
    if not check_kaggle_setup():
        create_dataset_structure()
        create_download_instructions()
        return
    
    # Create dataset structure
    create_dataset_structure()
    
    # Download datasets
    successful_downloads = 0
    total_datasets = len(DATASETS)
    
    for dataset in DATASETS:
        if download_dataset(dataset['name'], dataset['folder'], dataset['description']):
            successful_downloads += 1
    
    # Summary
    print(f"\n📊 Download Summary:")
    print(f"   Successfully downloaded: {successful_downloads}/{total_datasets} datasets")
    
    if successful_downloads > 0:
        print("\n✅ Datasets ready for processing!")
        print("   Next step: Run `python scripts/organize-datasets.py` to organize the data")
    else:
        print("\n⚠️  No datasets downloaded successfully.")
        print("   Please check the manual instructions in real-training-data/DOWNLOAD_INSTRUCTIONS.md")
    
    # Create instructions anyway
    create_download_instructions()

if __name__ == "__main__":
    main()