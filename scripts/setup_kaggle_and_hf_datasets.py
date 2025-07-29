#!/usr/bin/env python3
"""
Comprehensive dataset setup script for FruitAI
Downloads the specific Kaggle dataset and checks Hugging Face dataset availability
"""

import os
import subprocess
import sys
import json
from pathlib import Path
from datasets import load_dataset
from PIL import Image
import requests

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
            print_kaggle_setup_instructions()
            return False
            
    except FileNotFoundError:
        print("❌ Kaggle API not found. Please install it:")
        print("   pip install kaggle")
        print_kaggle_setup_instructions()
        return False
    except Exception as e:
        print(f"❌ Error checking Kaggle API: {e}")
        return False

def print_kaggle_setup_instructions():
    """Print detailed Kaggle setup instructions"""
    print("\n📋 Kaggle API Setup Instructions:")
    print("=" * 40)
    print("1. Install Kaggle API:")
    print("   pip install kaggle")
    print("\n2. Get your Kaggle API credentials:")
    print("   - Go to https://www.kaggle.com/account")
    print("   - Scroll down to 'API' section")
    print("   - Click 'Create New API Token'")
    print("   - This will download kaggle.json file")
    print("\n3. Place credentials file:")
    kaggle_dir = Path.home() / '.kaggle'
    print(f"   - Create directory: mkdir -p {kaggle_dir}")
    print(f"   - Move file: mv ~/Downloads/kaggle.json {kaggle_dir}/")
    print(f"   - Set permissions: chmod 600 {kaggle_dir}/kaggle.json")
    print("\n4. Re-run this script after setup")

def download_kaggle_dataset():
    """Download the specific Kaggle dataset: fruits-fresh-and-rotten-for-classification"""
    print("\n📥 Downloading Kaggle Dataset")
    print("=" * 40)
    print("Dataset: sriramr/fruits-fresh-and-rotten-for-classification")
    print("Description: 13,599 images of apple, banana, and orange (fresh and rotten)")
    
    # Create target directory
    kaggle_data_dir = Path('real-training-data/kaggle-fruits-classification')
    kaggle_data_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Download dataset
        cmd = [
            'kaggle', 'datasets', 'download', 
            '-d', 'sriramr/fruits-fresh-and-rotten-for-classification',
            '-p', str(kaggle_data_dir),
            '--unzip'
        ]
        
        print("⏳ Downloading... (this may take several minutes)")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        
        if result.returncode == 0:
            print("✅ Successfully downloaded Kaggle dataset")
            
            # Analyze downloaded structure
            analyze_kaggle_dataset(kaggle_data_dir)
            return True
        else:
            print(f"❌ Failed to download Kaggle dataset")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("⏰ Download timeout (>10 minutes)")
        return False
    except Exception as e:
        print(f"❌ Error downloading: {e}")
        return False

def analyze_kaggle_dataset(data_dir):
    """Analyze the structure of downloaded Kaggle dataset"""
    print(f"\n📊 Analyzing dataset structure in {data_dir}")
    
    total_images = 0
    structure = {}
    
    # Walk through all directories and count images
    for root, dirs, files in os.walk(data_dir):
        image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if image_files:
            rel_path = os.path.relpath(root, data_dir)
            structure[rel_path] = len(image_files)
            total_images += len(image_files)
    
    print(f"Total images found: {total_images}")
    print("\nDirectory structure:")
    for path, count in structure.items():
        print(f"  {path}: {count} images")
    
    return structure

def check_huggingface_dataset():
    """Check availability of Hugging Face Fresh-rotten-fruit dataset"""
    print("\n🤗 Checking Hugging Face Dataset")
    print("=" * 40)
    print("Dataset: Densu341/Fresh-rotten-fruit")
    
    try:
        # Try to load dataset info without downloading
        dataset_info = load_dataset("Densu341/Fresh-rotten-fruit", split="train", streaming=True)
        print("✅ Hugging Face dataset found and accessible")
        
        # Get first few samples to understand structure
        samples = list(dataset_info.take(5))
        print(f"Dataset structure preview:")
        
        if samples:
            sample = samples[0]
            print(f"  - Keys: {list(sample.keys())}")
            
            # Check if it has image and label
            if 'image' in sample:
                print(f"  - Image type: {type(sample['image'])}")
            if 'label' in sample:
                print(f"  - Label type: {type(sample['label'])}")
                print(f"  - Sample labels from first 5: {[s.get('label') for s in samples]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error accessing Hugging Face dataset: {e}")
        print("This could mean:")
        print("  - Dataset doesn't exist or name is incorrect")
        print("  - Dataset is private")
        print("  - Network connectivity issues")
        return False

def download_huggingface_dataset():
    """Download Hugging Face dataset if accessible"""
    print("\n📥 Downloading Hugging Face Dataset")
    
    try:
        # Create target directory
        hf_data_dir = Path('real-training-data/huggingface-fresh-rotten')
        hf_data_dir.mkdir(parents=True, exist_ok=True)
        
        # Load dataset
        print("⏳ Loading dataset...")
        dataset = load_dataset("Densu341/Fresh-rotten-fruit", split="train")
        
        print(f"✅ Dataset loaded: {len(dataset)} samples")
        
        # Organize and save images
        fresh_dir = hf_data_dir / 'fresh'
        rotten_dir = hf_data_dir / 'rotten'
        fresh_dir.mkdir(exist_ok=True)
        rotten_dir.mkdir(exist_ok=True)
        
        fresh_count = 0
        rotten_count = 0
        
        print("⏳ Saving images...")
        for i, sample in enumerate(dataset):
            if i % 100 == 0:
                print(f"  Processed {i}/{len(dataset)} images...")
            
            image = sample['image']
            label = sample.get('label', 'unknown')
            
            # Determine directory based on label
            if 'fresh' in str(label).lower() or label == 1:
                target_dir = fresh_dir
                fresh_count += 1
                filename = f"fresh_{fresh_count:05d}.jpg"
            elif 'rotten' in str(label).lower() or label == 0:
                target_dir = rotten_dir  
                rotten_count += 1
                filename = f"rotten_{rotten_count:05d}.jpg"
            else:
                # Default to fresh if unclear
                target_dir = fresh_dir
                fresh_count += 1
                filename = f"fresh_{fresh_count:05d}.jpg"
            
            # Save image
            image_path = target_dir / filename
            if isinstance(image, Image.Image):
                image.save(image_path, 'JPEG', quality=90)
            else:
                print(f"Warning: Unexpected image type at index {i}")
        
        print(f"✅ Hugging Face dataset downloaded:")
        print(f"  Fresh images: {fresh_count}")
        print(f"  Rotten images: {rotten_count}")
        print(f"  Total: {fresh_count + rotten_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error downloading Hugging Face dataset: {e}")
        return False

def organize_datasets():
    """Organize all downloaded datasets into a unified structure"""
    print("\n📁 Organizing Datasets")
    print("=" * 40)
    
    # Create unified structure
    unified_dir = Path('real-training-data/unified')
    unified_dir.mkdir(parents=True, exist_ok=True)
    
    # Create category directories
    categories = ['fresh', 'rotten']
    fruits = ['apple', 'banana', 'orange']
    
    for category in categories:
        for fruit in fruits:
            (unified_dir / category / fruit).mkdir(parents=True, exist_ok=True)
    
    # TODO: Add logic to move/copy images from different sources
    # This would require analyzing the specific structure of each downloaded dataset
    
    print("✅ Dataset organization structure created")
    print(f"Location: {unified_dir}")

def create_dataset_summary():
    """Create a comprehensive summary of all available datasets"""
    summary = {
        "timestamp": "2025-07-29",
        "datasets": {
            "kaggle": {
                "name": "sriramr/fruits-fresh-and-rotten-for-classification",
                "description": "13,599 images of apple, banana, and orange (fresh and rotten)",
                "url": "https://www.kaggle.com/datasets/sriramr/fruits-fresh-and-rotten-for-classification",
                "status": "pending_download"
            },
            "huggingface": {
                "name": "Densu341/Fresh-rotten-fruit", 
                "description": "Fresh and rotten fruit classification dataset",
                "url": "https://huggingface.co/datasets/Densu341/Fresh-rotten-fruit",
                "status": "pending_check"
            },
            "existing": {
                "name": "Current organized dataset",
                "location": "real-training-data/organized",
                "description": "Already organized fruit images (apple, banana, orange, strawberry, tomato)"
            }
        }
    }
    
    # Save summary
    with open('real-training-data/dataset_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    return summary

def main():
    print("🍎 FruitAI Comprehensive Dataset Setup")
    print("=" * 50)
    print("Setting up datasets from Kaggle and Hugging Face...")
    
    # Create base directory
    Path('real-training-data').mkdir(exist_ok=True)
    
    # Create initial summary
    summary = create_dataset_summary()
    
    # Check and setup Kaggle
    kaggle_success = False
    if check_kaggle_setup():
        kaggle_success = download_kaggle_dataset()
        if kaggle_success:
            summary["datasets"]["kaggle"]["status"] = "downloaded"
        else:
            summary["datasets"]["kaggle"]["status"] = "failed"
    else:
        summary["datasets"]["kaggle"]["status"] = "credentials_needed"
    
    # Check Hugging Face dataset
    hf_success = False
    if check_huggingface_dataset():
        hf_success = download_huggingface_dataset()
        if hf_success:
            summary["datasets"]["huggingface"]["status"] = "downloaded"
        else:
            summary["datasets"]["huggingface"]["status"] = "download_failed"
    else:
        summary["datasets"]["huggingface"]["status"] = "not_accessible"
    
    # Organize datasets if any were successful
    if kaggle_success or hf_success:
        organize_datasets()
    
    # Update and save final summary
    with open('real-training-data/dataset_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    # Print final status
    print(f"\n📋 Final Status")
    print("=" * 20)
    print(f"Kaggle dataset: {'✅ Success' if kaggle_success else '❌ Failed'}")
    print(f"Hugging Face dataset: {'✅ Success' if hf_success else '❌ Failed'}")
    
    if not kaggle_success and not hf_success:
        print("\n⚠️  No datasets downloaded successfully")
        print("Please check the instructions above and try again")
    else:
        print(f"\n✅ Dataset setup complete!")
        print(f"Check real-training-data/ directory for all datasets")

if __name__ == "__main__":
    main()