#!/usr/bin/env python3
"""
Download the Kaggle fruit classification dataset
"""

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
