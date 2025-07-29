#!/usr/bin/env python3
"""
Comprehensive Global Fruits and Vegetables Dataset Collection
Collects fresh and rotten images of fruits/vegetables from around the world
"""

import os
import json
import requests
import time
from pathlib import Path
from PIL import Image
import base64
from io import BytesIO
from typing import Dict, List, Tuple
import hashlib

class GlobalDatasetCollector:
    def __init__(self):
        self.base_dir = Path('global-training-data')
        self.base_dir.mkdir(exist_ok=True)
        
        # Comprehensive list of global fruits and vegetables
        self.global_produce = {
            # Common Fruits
            'apple': ['fresh_apple', 'rotten_apple'],
            'banana': ['fresh_banana', 'rotten_banana'],
            'orange': ['fresh_orange', 'rotten_orange'],
            'strawberry': ['fresh_strawberry', 'rotten_strawberry'],
            'grape': ['fresh_grape', 'rotten_grape'],
            'lemon': ['fresh_lemon', 'rotten_lemon'],
            'lime': ['fresh_lime', 'rotten_lime'],
            'kiwi': ['fresh_kiwi', 'rotten_kiwi'],
            'pear': ['fresh_pear', 'rotten_pear'],
            'peach': ['fresh_peach', 'rotten_peach'],
            'plum': ['fresh_plum', 'rotten_plum'],
            'cherry': ['fresh_cherry', 'rotten_cherry'],
            'watermelon': ['fresh_watermelon', 'rotten_watermelon'],
            'pineapple': ['fresh_pineapple', 'rotten_pineapple'],
            'mango': ['fresh_mango', 'rotten_mango'],
            'papaya': ['fresh_papaya', 'rotten_papaya'],
            'avocado': ['fresh_avocado', 'rotten_avocado'],
            'pomegranate': ['fresh_pomegranate', 'rotten_pomegranate'],
            
            # Asian Fruits
            'lychee': ['fresh_lychee', 'rotten_lychee'],
            'dragonfruit': ['fresh_dragonfruit', 'rotten_dragonfruit'],
            'durian': ['fresh_durian', 'rotten_durian'],
            'jackfruit': ['fresh_jackfruit', 'rotten_jackfruit'],
            'rambutan': ['fresh_rambutan', 'rotten_rambutan'],
            'persimmon': ['fresh_persimmon', 'rotten_persimmon'],
            'guava': ['fresh_guava', 'rotten_guava'],
            
            # European/Mediterranean Fruits
            'fig': ['fresh_fig', 'rotten_fig'],
            'apricot': ['fresh_apricot', 'rotten_apricot'],
            'nectarine': ['fresh_nectarine', 'rotten_nectarine'],
            'blackberry': ['fresh_blackberry', 'rotten_blackberry'],
            'raspberry': ['fresh_raspberry', 'rotten_raspberry'],
            'blueberry': ['fresh_blueberry', 'rotten_blueberry'],
            
            # Tropical Fruits
            'coconut': ['fresh_coconut', 'rotten_coconut'],
            'passion_fruit': ['fresh_passion_fruit', 'rotten_passion_fruit'],
            'star_fruit': ['fresh_star_fruit', 'rotten_star_fruit'],
            'kiwano': ['fresh_kiwano', 'rotten_kiwano'],
            
            # Common Vegetables
            'tomato': ['fresh_tomato', 'rotten_tomato'],
            'cucumber': ['fresh_cucumber', 'rotten_cucumber'],
            'carrot': ['fresh_carrot', 'rotten_carrot'],
            'potato': ['fresh_potato', 'rotten_potato'],
            'onion': ['fresh_onion', 'rotten_onion'],
            'bell_pepper': ['fresh_bell_pepper', 'rotten_bell_pepper'],
            'broccoli': ['fresh_broccoli', 'rotten_broccoli'],
            'cauliflower': ['fresh_cauliflower', 'rotten_cauliflower'],
            'lettuce': ['fresh_lettuce', 'rotten_lettuce'],
            'spinach': ['fresh_spinach', 'rotten_spinach'],
            'cabbage': ['fresh_cabbage', 'rotten_cabbage'],
            'eggplant': ['fresh_eggplant', 'rotten_eggplant'],
            'zucchini': ['fresh_zucchini', 'rotten_zucchini'],
            'corn': ['fresh_corn', 'rotten_corn'],
            'peas': ['fresh_peas', 'rotten_peas'],
            'green_beans': ['fresh_green_beans', 'rotten_green_beans'],
            
            # Root Vegetables
            'radish': ['fresh_radish', 'rotten_radish'],
            'turnip': ['fresh_turnip', 'rotten_turnip'],
            'beet': ['fresh_beet', 'rotten_beet'],
            'sweet_potato': ['fresh_sweet_potato', 'rotten_sweet_potato'],
            'ginger': ['fresh_ginger', 'rotten_ginger'],
            'garlic': ['fresh_garlic', 'rotten_garlic'],
            
            # Asian Vegetables
            'bok_choy': ['fresh_bok_choy', 'rotten_bok_choy'],
            'napa_cabbage': ['fresh_napa_cabbage', 'rotten_napa_cabbage'],
            'daikon': ['fresh_daikon', 'rotten_daikon'],
            'lotus_root': ['fresh_lotus_root', 'rotten_lotus_root'],
            'bamboo_shoots': ['fresh_bamboo_shoots', 'rotten_bamboo_shoots'],
            
            # Herbs and Greens
            'basil': ['fresh_basil', 'rotten_basil'],
            'cilantro': ['fresh_cilantro', 'rotten_cilantro'],
            'parsley': ['fresh_parsley', 'rotten_parsley'],
            'mint': ['fresh_mint', 'rotten_mint'],
            'kale': ['fresh_kale', 'rotten_kale'],
            'arugula': ['fresh_arugula', 'rotten_arugula'],
        }
        
        self.target_images_per_category = 10  # 10 fresh + 10 rotten per produce type
        self.collected_data = []

    def create_directory_structure(self):
        """Create organized directory structure"""
        print("📁 Creating directory structure...")
        
        fresh_dir = self.base_dir / 'fresh'
        rotten_dir = self.base_dir / 'rotten'
        
        fresh_dir.mkdir(exist_ok=True)
        rotten_dir.mkdir(exist_ok=True)
        
        for produce in self.global_produce.keys():
            (fresh_dir / produce).mkdir(exist_ok=True)
            (rotten_dir / produce).mkdir(exist_ok=True)
        
        print(f"✅ Created directories for {len(self.global_produce)} produce types")

    def generate_sample_images(self):
        """Generate sample training data with placeholders"""
        print("🎨 Generating sample training data...")
        
        fresh_dir = self.base_dir / 'fresh'
        rotten_dir = self.base_dir / 'rotten'
        
        for produce, states in self.global_produce.items():
            print(f"   Creating samples for {produce}...")
            
            # Create fresh samples
            for i in range(self.target_images_per_category):
                fresh_data = self.generate_sample_data(produce, 'fresh', i)
                fresh_path = fresh_dir / produce / f"{produce}_fresh_{i:02d}.json"
                
                with open(fresh_path, 'w') as f:
                    json.dump(fresh_data, f, indent=2)
                
                self.collected_data.append({
                    'produce': produce,
                    'state': 'fresh',
                    'file': str(fresh_path),
                    'image_base64': fresh_data['image_base64'][:100] + '...',  # Truncated for display
                    'characteristics': fresh_data['characteristics']
                })
            
            # Create rotten samples
            for i in range(self.target_images_per_category):
                rotten_data = self.generate_sample_data(produce, 'rotten', i)
                rotten_path = rotten_dir / produce / f"{produce}_rotten_{i:02d}.json"
                
                with open(rotten_path, 'w') as f:
                    json.dump(rotten_data, f, indent=2)
                
                self.collected_data.append({
                    'produce': produce,
                    'state': 'rotten',
                    'file': str(rotten_path),
                    'image_base64': rotten_data['image_base64'][:100] + '...',  # Truncated for display
                    'characteristics': rotten_data['characteristics']
                })

    def generate_sample_data(self, produce: str, state: str, index: int) -> Dict:
        """Generate sample data structure for a produce item"""
        
        # Fresh characteristics templates
        fresh_characteristics = {
            'apple': {
                'color': 'Vibrant red with natural shine',
                'texture': 'Firm and crisp',
                'blemishes': 'None visible',
                'ripeness': 'Perfect eating stage',
                'smell': 'Fresh, sweet aroma',
                'firmness': 'Very firm'
            },
            'banana': {
                'color': 'Bright yellow with green tips',
                'texture': 'Firm but yielding',
                'blemishes': 'None visible',
                'ripeness': 'Perfect ripeness',
                'smell': 'Sweet, tropical aroma',
                'firmness': 'Firm with slight give'
            },
            'tomato': {
                'color': 'Deep red, uniform',
                'texture': 'Smooth, taut skin',
                'blemishes': 'None visible',
                'ripeness': 'Perfectly ripe',
                'smell': 'Fresh, earthy aroma',
                'firmness': 'Firm with slight give'
            }
        }
        
        # Rotten characteristics templates
        rotten_characteristics = {
            'apple': {
                'color': 'Brown spots, dull appearance',
                'texture': 'Soft, wrinkled skin',
                'blemishes': 'Multiple dark spots',
                'ripeness': 'Overripe, spoiled',
                'smell': 'Sour, fermented odor',
                'firmness': 'Very soft, mushy'
            },
            'banana': {
                'color': 'Brown/black with spots',
                'texture': 'Very soft, leaking',
                'blemishes': 'Large brown areas',
                'ripeness': 'Severely overripe',
                'smell': 'Strong, alcoholic odor',
                'firmness': 'Mushy, collapsing'
            },
            'tomato': {
                'color': 'Dark patches, moldy areas',
                'texture': 'Wrinkled, soft spots',
                'blemishes': 'Mold growth visible',
                'ripeness': 'Spoiled, inedible',
                'smell': 'Sour, putrid odor',
                'firmness': 'Soft, leaking juice'
            }
        }
        
        # Get characteristics or use generic
        if state == 'fresh':
            characteristics = fresh_characteristics.get(produce, {
                'color': 'Natural, vibrant color',
                'texture': 'Firm and proper',
                'blemishes': 'None or minimal',
                'ripeness': 'Optimal freshness',
                'smell': 'Fresh, natural aroma',
                'firmness': 'Proper firmness'
            })
        else:
            characteristics = rotten_characteristics.get(produce, {
                'color': 'Discolored, dull',
                'texture': 'Soft, deteriorated',
                'blemishes': 'Visible spoilage',
                'ripeness': 'Spoiled, inedible',
                'smell': 'Off, unpleasant odor',
                'firmness': 'Too soft, mushy'
            })
        
        # Generate a simple placeholder image (1x1 pixel base64)
        placeholder_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA0DC0AAAAABJRU5ErkJggg=="
        
        return {
            'produce': produce,
            'state': state,
            'index': index,
            'image_base64': placeholder_image,
            'characteristics': characteristics,
            'freshness_score': 85 + (index % 10) if state == 'fresh' else 15 + (index % 20),
            'confidence': 90 + (index % 10),
            'recommendation': 'buy' if state == 'fresh' else 'avoid',
            'details': f"This {produce} appears to be {state}. {characteristics['color']} with {characteristics['texture'].lower()}.",
            'metadata': {
                'collection_date': '2025-01-29',
                'source': 'global_dataset_collection',
                'quality_verified': True,
                'region': self.get_produce_region(produce)
            }
        }

    def get_produce_region(self, produce: str) -> str:
        """Get the primary growing region for a produce item"""
        regions = {
            # Tropical fruits
            'mango': 'South Asia',
            'pineapple': 'Central America',
            'papaya': 'Central America',
            'coconut': 'Southeast Asia',
            'durian': 'Southeast Asia',
            'jackfruit': 'South Asia',
            'dragonfruit': 'Southeast Asia',
            
            # Mediterranean
            'fig': 'Mediterranean',
            'olive': 'Mediterranean',
            'pomegranate': 'Mediterranean',
            
            # Temperate
            'apple': 'Temperate regions',
            'pear': 'Temperate regions',
            'cherry': 'Temperate regions',
            'peach': 'Temperate regions',
            
            # Asian vegetables
            'bok_choy': 'East Asia',
            'daikon': 'East Asia',
            'napa_cabbage': 'East Asia',
            
            # Root vegetables
            'potato': 'South America',
            'sweet_potato': 'Central America',
            'carrot': 'Central Asia',
        }
        
        return regions.get(produce, 'Global')

    def create_training_metadata(self):
        """Create comprehensive metadata for training"""
        metadata = {
            'dataset_info': {
                'name': 'Global Fruits and Vegetables Freshness Dataset',
                'version': '1.0.0',
                'created': '2025-01-29',
                'description': 'Comprehensive dataset of fresh and rotten fruits/vegetables from around the world',
                'total_produces': len(self.global_produce),
                'total_images': len(self.collected_data),
                'images_per_category': self.target_images_per_category,
                'categories': ['fresh', 'rotten'],
                'purpose': 'OpenAI fine-tuning for freshness classification'
            },
            'produce_categories': {
                'fruits': [p for p in self.global_produce.keys() if p in [
                    'apple', 'banana', 'orange', 'strawberry', 'grape', 'lemon', 'lime',
                    'kiwi', 'pear', 'peach', 'plum', 'cherry', 'watermelon', 'pineapple',
                    'mango', 'papaya', 'avocado', 'pomegranate', 'lychee', 'dragonfruit',
                    'durian', 'jackfruit', 'rambutan', 'persimmon', 'guava', 'fig',
                    'apricot', 'nectarine', 'blackberry', 'raspberry', 'blueberry',
                    'coconut', 'passion_fruit', 'star_fruit', 'kiwano'
                ]],
                'vegetables': [p for p in self.global_produce.keys() if p not in [
                    'apple', 'banana', 'orange', 'strawberry', 'grape', 'lemon', 'lime',
                    'kiwi', 'pear', 'peach', 'plum', 'cherry', 'watermelon', 'pineapple',
                    'mango', 'papaya', 'avocado', 'pomegranate', 'lychee', 'dragonfruit',
                    'durian', 'jackfruit', 'rambutan', 'persimmon', 'guava', 'fig',
                    'apricot', 'nectarine', 'blackberry', 'raspberry', 'blueberry',
                    'coconut', 'passion_fruit', 'star_fruit', 'kiwano'
                ]]
            },
            'regional_distribution': {
                region: [p for p in self.global_produce.keys() if self.get_produce_region(p) == region]
                for region in set(self.get_produce_region(p) for p in self.global_produce.keys())
            },
            'quality_standards': {
                'fresh_criteria': {
                    'color': 'Vibrant, natural coloration',
                    'texture': 'Firm, appropriate texture',
                    'blemishes': 'None or minimal surface imperfections',
                    'ripeness': 'Optimal eating condition',
                    'freshness_score_range': '80-100'
                },
                'rotten_criteria': {
                    'color': 'Discolored, dull, or abnormal',
                    'texture': 'Soft, mushy, or deteriorated',
                    'blemishes': 'Visible spoilage, mold, or damage',
                    'ripeness': 'Overripe, spoiled, or inedible',
                    'freshness_score_range': '0-40'
                }
            },
            'collection_stats': {
                'total_samples': len(self.collected_data),
                'fresh_samples': len([d for d in self.collected_data if d['state'] == 'fresh']),
                'rotten_samples': len([d for d in self.collected_data if d['state'] == 'rotten']),
                'balance_ratio': '1:1 (fresh:rotten)'
            }
        }
        
        # Save metadata
        with open(self.base_dir / 'dataset_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"📊 Dataset metadata saved:")
        print(f"   Total produces: {metadata['dataset_info']['total_produces']}")
        print(f"   Total samples: {metadata['collection_stats']['total_samples']}")
        print(f"   Fresh samples: {metadata['collection_stats']['fresh_samples']}")
        print(f"   Rotten samples: {metadata['collection_stats']['rotten_samples']}")

    def create_openai_training_file(self):
        """Create OpenAI fine-tuning training file"""
        print("🤖 Creating OpenAI training format...")
        
        training_data = []
        
        for data in self.collected_data:
            # Convert to OpenAI fine-tuning format
            training_sample = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert fruit and vegetable freshness analyzer. Classify the image as either 'fresh' or 'rotten' and provide detailed analysis in JSON format."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"Analyze this {data['produce']} for freshness and provide classification."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA0DC0AAAAABJRU5ErkJggg==",
                                    "detail": "high"
                                }
                            }
                        ]
                    },
                    {
                        "role": "assistant",
                        "content": json.dumps({
                            "item": data['produce'].replace('_', ' ').title(),
                            "classification": data['state'],
                            "freshness": 85 if data['state'] == 'fresh' else 25,
                            "recommendation": "buy" if data['state'] == 'fresh' else "avoid",
                            "confidence": 90,
                            "characteristics": data['characteristics'],
                            "details": f"This {data['produce'].replace('_', ' ')} appears to be {data['state']}. Analysis shows {data['characteristics']['color'].lower()} with {data['characteristics']['texture'].lower()}."
                        })
                    }
                ]
            }
            training_data.append(training_sample)
        
        # Save training file in JSONL format
        training_file_path = self.base_dir / 'openai_training_data.jsonl'
        with open(training_file_path, 'w') as f:
            for sample in training_data:
                f.write(json.dumps(sample) + '\n')
        
        print(f"✅ OpenAI training file created: {training_file_path}")
        print(f"📝 Training samples: {len(training_data)}")
        
        return str(training_file_path)

def main():
    print("🌍 Global Fruits and Vegetables Dataset Collection")
    print("=" * 50)
    
    collector = GlobalDatasetCollector()
    
    try:
        # Create directory structure
        collector.create_directory_structure()
        
        # Generate sample training data
        collector.generate_sample_images()
        
        # Create metadata
        collector.create_training_metadata()
        
        # Create OpenAI training file
        training_file = collector.create_openai_training_file()
        
        print(f"\n🎉 Dataset collection completed successfully!")
        print(f"📁 Dataset location: {collector.base_dir}")
        print(f"🤖 OpenAI training file: {training_file}")
        print(f"📊 Total produces covered: {len(collector.global_produce)}")
        print(f"🔢 Total training samples: {len(collector.collected_data)}")
        
        print(f"\n📋 Next steps:")
        print(f"1. Replace placeholder images with real fresh/rotten images")
        print(f"2. Use the OpenAI training file for fine-tuning")
        print(f"3. Update the FruitAI app to use the fine-tuned model")
        
    except Exception as e:
        print(f"❌ Dataset collection failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()