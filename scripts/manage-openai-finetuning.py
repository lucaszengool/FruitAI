#!/usr/bin/env python3
"""
OpenAI Fine-tuning Management Script for FruitAI
Manages the fine-tuning process for fruit freshness detection
"""

import os
import json
import time
from pathlib import Path
from openai import OpenAI
from typing import Dict, List
import argparse

class OpenAIFineTuningManager:
    def __init__(self):
        # Initialize OpenAI client
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        self.client = OpenAI(api_key=api_key)
        # Use the combined dataset if available
        combined_file = Path('global-training-data/openai_training_data_combined.jsonl')
        real_images_file = Path('global-training-data/openai_training_data_with_real_images.jsonl')
        original_file = Path('global-training-data/openai_training_data.jsonl')
        
        if combined_file.exists():
            self.training_data_path = combined_file
            print(f"🔄 Using combined dataset (real + synthetic): {combined_file}")
        elif real_images_file.exists():
            self.training_data_path = real_images_file
            print(f"📸 Using training file with real images: {real_images_file}")
        elif original_file.exists():
            self.training_data_path = original_file
            print(f"📋 Using original training file: {original_file}")
        else:
            raise FileNotFoundError("No training data file found")
        self.jobs_file = Path('fine_tuning_jobs.json')
        
    def upload_training_file(self) -> str:
        """Upload training data file to OpenAI"""
        if not self.training_data_path.exists():
            raise FileNotFoundError(f"Training data file not found: {self.training_data_path}")
        
        print(f"📤 Uploading training file: {self.training_data_path}")
        
        with open(self.training_data_path, 'rb') as file:
            response = self.client.files.create(
                file=file,
                purpose='fine-tune'
            )
        
        file_id = response.id
        print(f"✅ File uploaded successfully: {file_id}")
        
        return file_id
    
    def create_fine_tuning_job(self, training_file_id: str, model: str = "gpt-4o-2024-08-06") -> str:
        """Create a fine-tuning job"""
        print(f"🚀 Creating fine-tuning job with model: {model}")
        
        try:
            response = self.client.fine_tuning.jobs.create(
                training_file=training_file_id,
                model=model,
                hyperparameters={
                    "n_epochs": 3,  # Number of training epochs
                    "batch_size": 1,  # Batch size for training
                    "learning_rate_multiplier": 0.1  # Learning rate multiplier
                },
                suffix="fruitai-freshness"  # Custom suffix for model name
            )
            
            job_id = response.id
            print(f"✅ Fine-tuning job created: {job_id}")
            
            # Save job info
            self.save_job_info(job_id, training_file_id, model)
            
            return job_id
            
        except Exception as e:
            print(f"❌ Failed to create fine-tuning job: {e}")
            raise
    
    def save_job_info(self, job_id: str, training_file_id: str, model: str):
        """Save job information to local file"""
        job_info = {
            'job_id': job_id,
            'training_file_id': training_file_id,
            'base_model': model,
            'created_at': time.time(),
            'status': 'created'
        }
        
        # Load existing jobs or create new list
        if self.jobs_file.exists():
            with open(self.jobs_file, 'r') as f:
                jobs = json.load(f)
        else:
            jobs = []
        
        jobs.append(job_info)
        
        with open(self.jobs_file, 'w') as f:
            json.dump(jobs, f, indent=2)
        
        print(f"💾 Job info saved to: {self.jobs_file}")
    
    def check_job_status(self, job_id: str) -> Dict:
        """Check the status of a fine-tuning job"""
        try:
            response = self.client.fine_tuning.jobs.retrieve(job_id)
            
            status_info = {
                'id': response.id,
                'status': response.status,
                'model': response.fine_tuned_model,
                'created_at': response.created_at,
                'finished_at': response.finished_at,
                'training_file': response.training_file,
                'result_files': response.result_files,
                'trained_tokens': getattr(response, 'trained_tokens', None),
                'error': getattr(response, 'error', None)
            }
            
            return status_info
            
        except Exception as e:
            print(f"❌ Failed to check job status: {e}")
            raise
    
    def list_all_jobs(self) -> List[Dict]:
        """List all fine-tuning jobs"""
        try:
            response = self.client.fine_tuning.jobs.list(limit=50)
            jobs = []
            
            for job in response.data:
                job_info = {
                    'id': job.id,
                    'status': job.status,
                    'model': job.fine_tuned_model,
                    'created_at': job.created_at,
                    'finished_at': job.finished_at,
                    'base_model': job.model
                }
                jobs.append(job_info)
            
            return jobs
            
        except Exception as e:
            print(f"❌ Failed to list jobs: {e}")
            raise
    
    def wait_for_completion(self, job_id: str, check_interval: int = 60) -> Dict:
        """Wait for a fine-tuning job to complete"""
        print(f"⏳ Waiting for job {job_id} to complete...")
        print(f"⏱️  Checking every {check_interval} seconds...")
        
        while True:
            status_info = self.check_job_status(job_id)
            status = status_info['status']
            
            print(f"📊 Current status: {status}")
            
            if status == 'succeeded':
                print(f"🎉 Fine-tuning completed successfully!")
                print(f"🤖 Fine-tuned model: {status_info['model']}")
                return status_info
            elif status == 'failed':
                print(f"❌ Fine-tuning failed!")
                if status_info['error']:
                    print(f"Error: {status_info['error']}")
                return status_info
            elif status in ['cancelled', 'invalid_training_file']:
                print(f"⚠️  Fine-tuning stopped with status: {status}")
                return status_info
            else:
                # Still running (validating_files, queued, running)
                time.sleep(check_interval)
    
    def create_env_file(self, model_id: str):
        """Create/update .env file with fine-tuned model ID"""
        env_file = Path('.env.local')
        
        # Read existing .env content
        env_content = ""
        if env_file.exists():
            with open(env_file, 'r') as f:
                env_content = f.read()
        
        # Update or add the fine-tuned model ID
        if 'OPENAI_FINETUNED_MODEL_ID=' in env_content:
            # Replace existing line
            lines = env_content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('OPENAI_FINETUNED_MODEL_ID='):
                    lines[i] = f'OPENAI_FINETUNED_MODEL_ID={model_id}'
                    break
            env_content = '\n'.join(lines)
        else:
            # Add new line
            env_content += f'\nOPENAI_FINETUNED_MODEL_ID={model_id}\n'
        
        # Write back to file
        with open(env_file, 'w') as f:
            f.write(env_content)
        
        print(f"✅ Updated {env_file} with fine-tuned model ID: {model_id}")

def main():
    parser = argparse.ArgumentParser(description='Manage OpenAI fine-tuning for FruitAI')
    parser.add_argument('command', choices=[
        'upload', 'create', 'status', 'list', 'complete-flow'
    ], help='Command to execute')
    parser.add_argument('--job-id', help='Fine-tuning job ID (for status command)')
    parser.add_argument('--model', default='gpt-4o-2024-08-06', help='Base model for fine-tuning')
    parser.add_argument('--wait', action='store_true', help='Wait for completion after creating job')
    
    args = parser.parse_args()
    
    try:
        manager = OpenAIFineTuningManager()
        
        if args.command == 'upload':
            file_id = manager.upload_training_file()
            print(f"Training file ID: {file_id}")
            
        elif args.command == 'create':
            # Upload file first
            file_id = manager.upload_training_file()
            
            # Create fine-tuning job
            job_id = manager.create_fine_tuning_job(file_id, args.model)
            
            if args.wait:
                # Wait for completion
                result = manager.wait_for_completion(job_id)
                if result['status'] == 'succeeded' and result['model']:
                    manager.create_env_file(result['model'])
            
        elif args.command == 'status':
            if not args.job_id:
                print("❌ --job-id is required for status command")
                return
            
            status_info = manager.check_job_status(args.job_id)
            print(f"\n📊 Job Status:")
            print(f"   ID: {status_info['id']}")
            print(f"   Status: {status_info['status']}")
            print(f"   Model: {status_info['model'] or 'Not available yet'}")
            print(f"   Created: {status_info['created_at']}")
            print(f"   Finished: {status_info['finished_at'] or 'Not finished'}")
            
        elif args.command == 'list':
            jobs = manager.list_all_jobs()
            print(f"\n📋 All Fine-tuning Jobs:")
            for job in jobs:
                print(f"   {job['id']} - {job['status']} - {job['model'] or 'In progress'}")
        
        elif args.command == 'complete-flow':
            print("🚀 Starting complete fine-tuning flow...")
            
            # Step 1: Upload training file
            file_id = manager.upload_training_file()
            
            # Step 2: Create fine-tuning job
            job_id = manager.create_fine_tuning_job(file_id, args.model)
            
            # Step 3: Wait for completion
            result = manager.wait_for_completion(job_id)
            
            # Step 4: Update environment if successful
            if result['status'] == 'succeeded' and result['model']:
                manager.create_env_file(result['model'])
                print(f"\n🎉 Fine-tuning completed successfully!")
                print(f"🤖 Your fine-tuned model: {result['model']}")
                print(f"📝 Model ID saved to .env.local")
                print(f"🚀 Ready to use in FruitAI application!")
            else:
                print(f"\n❌ Fine-tuning did not complete successfully")
                print(f"Status: {result['status']}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())