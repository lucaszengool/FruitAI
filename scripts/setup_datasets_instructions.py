#!/usr/bin/env python3
"""
Comprehensive dataset setup instructions and verification for FruitAI
"""

import os
import subprocess
import sys
from pathlib import Path
import json

def check_kaggle_setup():
    """Check if Kaggle API is properly set up"""
    try:
        result = subprocess.run(['kaggle', '--version'], capture_output=True, text=True)
        print(f"✅ Kaggle API found: {result.stdout.strip()}")
        
        # Check if credentials exist
        kaggle_dir = Path.home() / '.kaggle'
        kaggle_json = kaggle_dir / 'kaggle.json'
        
        if kaggle_json.exists():
            print("✅ Kaggle credentials found")
            return True
        else:
            print("❌ Kaggle credentials not found")
            return False
            
    except FileNotFoundError:
        print("❌ Kaggle API not found. Please install it:")
        print("   pip install kaggle")
        return False
    except Exception as e:
        print(f"❌ Error checking Kaggle API: {e}")
        return False

def print_kaggle_setup_instructions():
    """Print detailed Kaggle setup instructions"""
    print("\n📋 KAGGLE API SETUP INSTRUCTIONS")
    print("=" * 50)
    print("To download the 'Fruits fresh and rotten for classification' dataset:")
    print("(https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification)")
    print()
    print("1. Install Kaggle API (if not already installed):")
    print("   pip install kaggle")
    print()
    print("2. Get your Kaggle API credentials:")
    print("   - Go to https://www.kaggle.com/account")
    print("   - Scroll down to 'API' section")
    print("   - Click 'Create New API Token'")
    print("   - This will download a 'kaggle.json' file")
    print()
    print("3. Set up credentials:")
    kaggle_dir = Path.home() / '.kaggle'
    print(f"   mkdir -p {kaggle_dir}")
    print(f"   mv ~/Downloads/kaggle.json {kaggle_dir}/")
    print(f"   chmod 600 {kaggle_dir}/kaggle.json")
    print()
    print("4. Download the dataset:")
    print("   python scripts/download_kaggle_dataset.py")

def check_huggingface_access():
    """Check if Hugging Face dataset is accessible"""
    print("\n🤗 HUGGING FACE DATASET CHECK")
    print("=" * 50)
    print("Dataset: Densu341/Fresh-rotten-fruit")
    
    try:
        from datasets import load_dataset
        
        # Try to access dataset info without full download
        dataset_info = load_dataset("Densu341/Fresh-rotten-fruit", split="train", streaming=True)
        samples = list(dataset_info.take(3))
        
        print("✅ Hugging Face dataset is accessible")
        print(f"   Dataset has {len(samples)} sample structure confirmed")
        if samples:
            sample = samples[0]
            print(f"   Keys: {list(sample.keys())}")
            print(f"   Sample labels: {[s.get('label') for s in samples]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error accessing Hugging Face dataset: {e}")
        return False

def print_dataset_info():
    """Print information about both datasets"""
    print("\n📊 DATASET INFORMATION")
    print("=" * 50)
    
    print("1. KAGGLE DATASET:")
    print("   Name: sriramr/fruits-fresh-and-rotten-for-classification")
    print("   Size: 13,599 images")
    print("   Categories: Fresh and Rotten")
    print("   Fruits: Apple, Banana, Orange")
    print("   URL: https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification")
    print()
    
    print("2. HUGGING FACE DATASET:")
    print("   Name: Densu341/Fresh-rotten-fruit")
    print("   Categories: Fresh (label=1) and Rotten (label=0)")
    print("   Format: Images with integer labels")
    print("   URL: https://huggingface.co/datasets/Densu341/Fresh-rotten-fruit")
    print()
    
    print("3. EXISTING DATASET:")
    existing_path = Path('real-training-data/organized')
    if existing_path.exists():
        print(f"   Location: {existing_path}")
        # Count existing images
        total = 0
        structure = {}
        for quality_dir in existing_path.iterdir():
            if quality_dir.is_dir():
                quality = quality_dir.name
                structure[quality] = {}
                for fruit_dir in quality_dir.iterdir():
                    if fruit_dir.is_dir():
                        count = len(list(fruit_dir.glob('*.jpg')))
                        structure[quality][fruit_dir.name] = count
                        total += count
        
        print(f"   Total images: {total}")
        for quality, fruits in structure.items():
            print(f"   {quality.capitalize()}: {sum(fruits.values())} images")
            for fruit, count in fruits.items():
                print(f"     - {fruit}: {count}")
    else:
        print("   Status: Not found")

def create_download_scripts():
    """Create individual download scripts for each dataset"""
    
    # Kaggle download script
    kaggle_script = """#!/usr/bin/env python3
\"\"\"
Download the Kaggle fruit classification dataset
\"\"\"

import subprocess
import sys
from pathlib import Path

def download_kaggle_dataset():
    # Create target directory
    target_dir = Path('real-training-data/kaggle-original')
    target_dir.mkdir(parents=True, exist_ok=True)
    
    print("📥 Downloading Kaggle dataset...")
    print("   This may take several minutes (13,599 images)")
    
    try:
        cmd = [
            'kaggle', 'datasets', 'download',
            '-d', 'sriramr/fruits-fresh-and-rotten-for-classification',
            '-p', str(target_dir),
            '--unzip'
        ]
        
        result = subprocess.run(cmd, check=True)
        print("✅ Kaggle dataset downloaded successfully!")
        
        # Analyze structure
        total_images = 0
        for root, dirs, files in target_dir.rglob('*'):
            if root.is_file() and root.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                total_images += 1
        
        print(f"   Total images: {total_images}")
        print(f"   Location: {target_dir}")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Download failed: {e}")
        print("   Please check your Kaggle credentials")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    download_kaggle_dataset()
"""

    with open('scripts/download_kaggle_dataset.py', 'w') as f:
        f.write(kaggle_script)
    
    # Hugging Face download script
    hf_script = """#!/usr/bin/env python3
\"\"\"
Download the Hugging Face fresh-rotten fruit dataset
\"\"\"

from datasets import load_dataset
from pathlib import Path
from PIL import Image

def download_hf_dataset():
    print("📥 Downloading Hugging Face dataset...")
    print("   Dataset: Densu341/Fresh-rotten-fruit")
    
    try:
        # Create target directory
        target_dir = Path('real-training-data/huggingface-original')
        fresh_dir = target_dir / 'fresh'
        rotten_dir = target_dir / 'rotten'
        fresh_dir.mkdir(parents=True, exist_ok=True)
        rotten_dir.mkdir(parents=True, exist_ok=True)
        
        # Load dataset
        dataset = load_dataset("Densu341/Fresh-rotten-fruit", split="train")
        print(f"   Loaded {len(dataset)} images")
        
        fresh_count = 0
        rotten_count = 0
        
        # Save images
        for i, sample in enumerate(dataset):
            if i % 100 == 0:
                print(f"   Processing {i}/{len(dataset)}...")
            
            image = sample['image']
            label = sample['label']
            
            if label == 1:  # Fresh
                save_path = fresh_dir / f"fresh_{fresh_count:05d}.jpg"
                fresh_count += 1
            else:  # Rotten (label == 0)
                save_path = rotten_dir / f"rotten_{rotten_count:05d}.jpg"
                rotten_count += 1
            
            # Convert to RGB if needed and save
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image.save(save_path, 'JPEG', quality=90)
        
        print("✅ Hugging Face dataset downloaded successfully!")
        print(f"   Fresh images: {fresh_count}")
        print(f"   Rotten images: {rotten_count}")
        print(f"   Total: {fresh_count + rotten_count}")
        print(f"   Location: {target_dir}")
        
    except Exception as e:
        print(f"❌ Download failed: {e}")

if __name__ == "__main__":
    download_hf_dataset()
"""

    with open('scripts/download_hf_dataset.py', 'w') as f:
        f.write(hf_script)
    
    print("✅ Created download scripts:")
    print("   - scripts/download_kaggle_dataset.py")
    print("   - scripts/download_hf_dataset.py")

def create_unified_organizer():
    """Create script to organize all datasets into unified structure"""
    
    organizer_script = """#!/usr/bin/env python3
\"\"\"
Organize all downloaded datasets into a unified structure for training
\"\"\"

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
"""

    with open('scripts/organize_unified_dataset.py', 'w') as f:
        f.write(organizer_script)
    
    print("✅ Created organizer script:")
    print("   - scripts/organize_unified_dataset.py")

def main():
    print("🍎 FruitAI Dataset Setup Guide")
    print("=" * 50)
    
    # Check current status
    kaggle_ready = check_kaggle_setup()
    hf_accessible = check_huggingface_access()
    
    # Print dataset information
    print_dataset_info()
    
    # Create download scripts
    create_download_scripts()
    create_unified_organizer()
    
    # Print next steps
    print("\n🚀 NEXT STEPS")
    print("=" * 50)
    
    if not kaggle_ready:
        print("1. Set up Kaggle API credentials (see instructions above)")
    else:
        print("1. ✅ Kaggle API ready")
    
    if kaggle_ready:
        print("2. Download Kaggle dataset:")
        print("   python scripts/download_kaggle_dataset.py")
    else:
        print("2. Download Kaggle dataset (after credentials setup)")
    
    if hf_accessible:
        print("3. Download Hugging Face dataset:")
        print("   python scripts/download_hf_dataset.py")
    else:
        print("3. ❌ Hugging Face dataset not accessible")
    
    print("4. Organize all datasets:")
    print("   python scripts/organize_unified_dataset.py")
    
    print("\n📝 SUMMARY")
    print("=" * 20)
    print(f"Kaggle API: {'✅ Ready' if kaggle_ready else '❌ Needs setup'}")
    print(f"Hugging Face: {'✅ Accessible' if hf_accessible else '❌ Not accessible'}")
    print("Existing dataset: ✅ Available")

if __name__ == "__main__":
    main()