// Test the actual multiFruitAnalyzer
const fs = require('fs');

// Load environment variables manually
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const envLines = envContent.split('\n');
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (error) {
  console.log('Could not load .env.local file:', error.message);
}

// Import the analyzer (simulate ES modules)
const { multiFruitAnalyzer } = require('./app/lib/multiFruitAnalyzer');

async function testFruitAnalyzer() {
  console.log('🍎 === TESTING FRUIT ANALYZER ===');
  
  // Create a better test image with canvas
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // Create a realistic fruit scene
  ctx.fillStyle = '#f0f8ff'; // Light background
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw a red apple
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(200, 200, 60, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw a yellow banana
  ctx.fillStyle = '#ffdd44';
  ctx.fillRect(400, 180, 120, 40);
  
  // Draw an orange
  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.arc(600, 200, 50, 0, Math.PI * 2);
  ctx.fill();
  
  const testImage = canvas.toDataURL('image/jpeg', 0.8);
  console.log('📸 Created test image, size:', testImage.length);
  
  try {
    console.log('🔄 Starting fruit analysis...');
    const start = Date.now();
    
    const result = await multiFruitAnalyzer.analyzeBatch(testImage);
    
    const duration = Date.now() - start;
    console.log(`⏱️ Analysis completed in ${duration}ms`);
    
    console.log('✅ Analysis successful!');
    console.log('📊 Results:');
    console.log('  - Total fruits:', result.totalFruits);
    console.log('  - Average freshness:', result.averageFreshness);
    console.log('  - Analysis ID:', result.analysisId);
    
    if (result.analyzedFruits && result.analyzedFruits.length > 0) {
      console.log('🍎 Fruits found:');
      result.analyzedFruits.forEach((fruit, index) => {
        console.log(`  ${index + 1}. ${fruit.item} (${fruit.freshness}% fresh, ${fruit.recommendation})`);
        console.log(`     Details: ${fruit.details}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Fruit analyzer test failed:');
    console.error('  - Error:', error.message);
    console.error('  - Stack:', error.stack);
  }
}

testFruitAnalyzer().catch(console.error);