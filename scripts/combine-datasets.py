#!/usr/bin/env python3
"""
Combine real fresh images with synthetic rotten data for balanced training
"""

import json
from pathlib import Path

def combine_datasets():
    """Combine real fresh images with synthetic rotten data"""
    print("🔄 Combining datasets for balanced training...")
    
    base_dir = Path('global-training-data')
    real_images_file = base_dir / 'openai_training_data_with_real_images.jsonl'
    original_file = base_dir / 'openai_training_data.jsonl'
    combined_file = base_dir / 'openai_training_data_combined.jsonl'
    
    training_samples = []
    
    # Load real images data (fresh only)
    if real_images_file.exists():
        print("📸 Loading real fresh images...")
        with open(real_images_file, 'r') as f:
            for line in f:
                sample = json.loads(line.strip())
                # Only include fresh samples from real images
                if 'fresh' in sample['messages'][2]['content']:
                    training_samples.append(sample)
                    print(f"  ✅ Added real fresh image sample")
    
    # Load synthetic rotten data from original file
    if original_file.exists():
        print("🎨 Loading synthetic rotten samples...")
        with open(original_file, 'r') as f:
            for line in f:
                sample = json.loads(line.strip())
                # Only include rotten samples from synthetic data
                if 'rotten' in sample['messages'][2]['content']:
                    training_samples.append(sample)
                    print(f"  ✅ Added synthetic rotten sample")
    
    # Add some fresh synthetic samples to balance if needed
    fresh_count = len([s for s in training_samples if 'fresh' in s['messages'][2]['content']])
    rotten_count = len([s for s in training_samples if 'rotten' in s['messages'][2]['content']])
    
    print(f"📊 Current balance: {fresh_count} fresh, {rotten_count} rotten")
    
    # If we need more fresh samples, add some from synthetic
    if fresh_count < rotten_count:
        needed = min(rotten_count - fresh_count, 50)  # Cap at 50 additional
        print(f"🔄 Adding {needed} more fresh synthetic samples for balance...")
        
        with open(original_file, 'r') as f:
            added = 0
            for line in f:
                if added >= needed:
                    break
                sample = json.loads(line.strip())
                if 'fresh' in sample['messages'][2]['content']:
                    training_samples.append(sample)
                    added += 1
    
    # Save combined dataset
    with open(combined_file, 'w') as f:
        for sample in training_samples:
            f.write(json.dumps(sample) + '\n')
    
    final_fresh = len([s for s in training_samples if 'fresh' in s['messages'][2]['content']])
    final_rotten = len([s for s in training_samples if 'rotten' in s['messages'][2]['content']])
    
    print(f"✅ Combined dataset created: {combined_file}")
    print(f"📊 Final balance: {final_fresh} fresh, {final_rotten} rotten")
    print(f"📝 Total samples: {len(training_samples)}")
    
    return str(combined_file)

if __name__ == "__main__":
    combine_datasets()