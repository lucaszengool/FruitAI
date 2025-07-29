#!/usr/bin/env python3
"""
Download the Hugging Face fresh-rotten fruit dataset
"""

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
