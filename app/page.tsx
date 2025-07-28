'use client';

import { useState, useRef, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { 
  Camera, Upload, Sparkles, ShoppingCart, Clock, 
  Download, Share2, ChevronRight, Leaf,
  Package, BookOpen, AlertCircle,
  Check, X, Trash2, RefreshCw, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { storage, AnalysisHistory, ShoppingListItem } from './lib/storage';
import { getProduceData } from './lib/nutritionData';

interface AnalysisResult {
  item: string;
  freshness: number;
  recommendation: 'buy' | 'avoid' | 'check';
  details: string;
  confidence: number;
  characteristics: {
    color: string;
    texture: string;
    blemishes: string;
    ripeness: string;
  };
  timestamp: string;
  analysisId: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [activeTab, setActiveTab] = useState('analyze');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(storage.getHistory());
    setShoppingList(storage.getShoppingList());
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        toast.error('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 10MB.');
        toast.error('Image file is too large. Please select an image under 10MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        toast.success('Image loaded successfully!');
      };
      reader.onerror = () => {
        setError('Failed to load image. Please try again.');
        toast.error('Failed to load image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setResult(data);
      
      // Save to history
      const historyItem: AnalysisHistory = {
        ...data,
        image: selectedImage
      };
      storage.addToHistory(historyItem);
      setHistory(storage.getHistory());
      
      toast.success('Analysis complete!');
    } catch {
      setError('Failed to analyze image. Please try again.');
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const addToShoppingList = () => {
    if (!result) return;
    
    storage.addToShoppingList({
      item: result.item,
      quantity: 1,
      notes: `Freshness: ${result.freshness}% - ${result.recommendation}`
    });
    
    setShoppingList(storage.getShoppingList());
    toast.success(`Added ${result.item} to shopping list`);
  };

  const exportAnalysis = () => {
    if (!result) return;
    
    const produceInfo = getProduceData(result.item);
    const report = `
FruitAI Freshness Analysis Report
=================================

Item: ${result.item}
Date: ${new Date(result.timestamp).toLocaleString()}
Analysis ID: ${result.analysisId}

Freshness Score: ${result.freshness}%
Recommendation: ${result.recommendation.toUpperCase()}
Confidence: ${result.confidence}%

Detailed Analysis:
${result.details}

Characteristics:
- Color: ${result.characteristics.color}
- Texture: ${result.characteristics.texture}
- Blemishes: ${result.characteristics.blemishes}
- Ripeness: ${result.characteristics.ripeness}

${produceInfo ? `
Nutritional Information (per 100g):
- Calories: ${produceInfo.nutrition.calories}
- Protein: ${produceInfo.nutrition.protein}g
- Carbs: ${produceInfo.nutrition.carbs}g
- Fat: ${produceInfo.nutrition.fat}g
- Fiber: ${produceInfo.nutrition.fiber}g

Storage Tips:
- Optimal: ${produceInfo.storage.optimal}
- Duration: ${produceInfo.storage.duration}
- Tips: 
${produceInfo.storage.tips.map(tip => `  • ${tip}`).join('\n')}
` : ''}
    `.trim();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fruitai-analysis-${result.analysisId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Report downloaded!');
  };

  const shareAnalysis = async () => {
    if (!result) return;
    
    const text = `I analyzed a ${result.item} with FruitAI:\nFreshness: ${result.freshness}%\nRecommendation: ${result.recommendation}\n${result.details}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Camera access is not available on this device.');
      return;
    }
    
    cameraInputRef.current?.click();
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient">FruitAI</h1>
              </motion.div>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => setActiveTab('analyze')}
                className={`font-medium transition-colors ${activeTab === 'analyze' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Analyze
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`font-medium transition-colors ${activeTab === 'history' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('shopping')}
                className={`font-medium transition-colors relative ${activeTab === 'shopping' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Shopping List
                {shoppingList.filter(i => !i.checked).length > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                    {shoppingList.filter(i => !i.checked).length}
                  </span>
                )}
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="sm">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 h-full bg-white shadow-xl">
              <div className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => { setActiveTab('analyze'); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analyze' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => { setActiveTab('history'); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'history' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    History
                  </button>
                  <button
                    onClick={() => { setActiveTab('shopping'); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'shopping' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Shopping List
                  </button>
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.h2 
                  className="text-4xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  AI-Powered Freshness Analysis
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Upload a photo of any fruit or vegetable and get instant freshness insights, 
                  storage tips, and nutritional information
                </motion.p>
              </div>

              {/* Upload Section */}
              {!result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="max-w-2xl mx-auto p-8 hover:shadow-lg transition-shadow">
                    {!selectedImage ? (
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-accent flex items-center justify-center">
                          <Camera className="w-12 h-12 text-green-700" />
                        </div>
                        
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          Upload Your Produce Photo
                        </h3>
                        <p className="text-gray-600 mb-8">
                          Take or upload a clear photo for accurate analysis
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          {/* Hidden file inputs */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          
                          <Button 
                            size="lg" 
                            onClick={handleChoosePhoto}
                            className="cursor-pointer"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Choose Photo
                          </Button>
                          
                          <Button 
                            variant="secondary" 
                            size="lg" 
                            onClick={handleTakePhoto}
                            className="cursor-pointer"
                          >
                            <Camera className="w-5 h-5 mr-2" />
                            Take Photo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="relative rounded-2xl overflow-hidden">
                          <img
                            src={selectedImage}
                            alt="Selected produce"
                            className="w-full h-64 sm:h-96 object-cover"
                          />
                          <button
                            onClick={resetAnalysis}
                            className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex gap-4">
                          <Button
                            onClick={analyzeImage}
                            disabled={analyzing}
                            loading={analyzing}
                            size="lg"
                            className="flex-1"
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                            {analyzing ? 'Analyzing...' : 'Analyze Freshness'}
                          </Button>
                          
                          <Button
                            onClick={resetAnalysis}
                            variant="secondary"
                            size="lg"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* Results Section */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button onClick={addToShoppingList} variant="secondary">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to List
                    </Button>
                    <Button onClick={exportAnalysis} variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button onClick={shareAnalysis} variant="secondary">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button onClick={resetAnalysis} variant="ghost">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Analysis
                    </Button>
                  </div>

                  {/* Main Results */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Freshness Score Card */}
                    <Card className="lg:col-span-1 p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Freshness Score</h3>
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke={result.freshness >= 70 ? '#22c55e' : result.freshness >= 50 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.freshness / 100)}`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{result.freshness}%</span>
                        </div>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                        ${result.recommendation === 'buy' ? 'bg-green-100 text-green-700' : 
                          result.recommendation === 'check' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {result.recommendation === 'buy' ? <Check className="w-4 h-4" /> : 
                         result.recommendation === 'check' ? <AlertCircle className="w-4 h-4" /> : 
                         <X className="w-4 h-4" />}
                        {result.recommendation.toUpperCase()}
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-600">
                        Confidence: {result.confidence}%
                      </p>
                    </Card>

                    {/* Item Details */}
                    <Card className="lg:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{result.item}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Analyzed on {new Date(result.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {selectedImage && (
                          <img
                            src={selectedImage}
                            alt={result.item}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-6">{result.details}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Characteristics</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-600">Color:</span>
                              <span className="text-sm font-medium">{result.characteristics.color}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-600">Texture:</span>
                              <span className="text-sm font-medium">{result.characteristics.texture}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Condition</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-600">Blemishes:</span>
                              <span className="text-sm font-medium">{result.characteristics.blemishes}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-600">Ripeness:</span>
                              <span className="text-sm font-medium">{result.characteristics.ripeness}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Additional Info Tabs */}
                  <Tabs.Root defaultValue="nutrition" className="w-full">
                    <Tabs.List className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
                      <Tabs.Trigger value="nutrition" className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Nutrition
                      </Tabs.Trigger>
                      <Tabs.Trigger value="storage" className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Storage Tips
                      </Tabs.Trigger>
                      <Tabs.Trigger value="recipes" className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Recipes
                      </Tabs.Trigger>
                    </Tabs.List>
                    
                    {(() => {
                      const produceInfo = getProduceData(result.item);
                      if (!produceInfo) return null;
                      
                      return (
                        <>
                          <Tabs.Content value="nutrition">
                            <Card className="p-6">
                              <h3 className="text-lg font-semibold mb-4">Nutritional Information (per 100g)</h3>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                  <p className="text-2xl font-bold text-green-600">{produceInfo.nutrition.calories}</p>
                                  <p className="text-sm text-gray-600">Calories</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <p className="text-2xl font-bold text-blue-600">{produceInfo.nutrition.protein}g</p>
                                  <p className="text-sm text-gray-600">Protein</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                  <p className="text-2xl font-bold text-yellow-600">{produceInfo.nutrition.carbs}g</p>
                                  <p className="text-sm text-gray-600">Carbs</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                  <p className="text-2xl font-bold text-purple-600">{produceInfo.nutrition.fat}g</p>
                                  <p className="text-sm text-gray-600">Fat</p>
                                </div>
                              </div>
                              
                              <div className="mt-6">
                                <h4 className="font-medium text-gray-900 mb-3">Key Vitamins & Minerals</h4>
                                <div className="space-y-2">
                                  {Object.entries(produceInfo.nutrition.vitamins).map(([vitamin, percentage]) => (
                                    <div key={vitamin} className="flex items-center gap-3">
                                      <span className="text-sm text-gray-600 w-24">{vitamin}:</span>
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                          style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Card>
                          </Tabs.Content>
                          
                          <Tabs.Content value="storage">
                            <Card className="p-6">
                              <h3 className="text-lg font-semibold mb-4">Storage Recommendations</h3>
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <Package className="w-5 h-5 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Optimal Storage</p>
                                    <p className="text-sm text-gray-600">{produceInfo.storage.optimal}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Storage Duration</p>
                                    <p className="text-sm text-gray-600">{produceInfo.storage.duration}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Avoid</p>
                                    <p className="text-sm text-gray-600">{produceInfo.storage.avoid}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-6">
                                  <p className="font-medium text-gray-900 mb-2">Pro Tips:</p>
                                  <ul className="space-y-1">
                                    {produceInfo.storage.tips.map((tip, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                        <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {tip}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Card>
                          </Tabs.Content>
                          
                          <Tabs.Content value="recipes">
                            <Card className="p-6">
                              <h3 className="text-lg font-semibold mb-4">Recipe Suggestions</h3>
                              {produceInfo.recipes.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {produceInfo.recipes.map((recipe, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                      <BookOpen className="w-5 h-5 text-green-600 mb-2" />
                                      <p className="font-medium text-gray-900">{recipe}</p>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-600">No recipe suggestions available for this item.</p>
                              )}
                            </Card>
                          </Tabs.Content>
                        </>
                      );
                    })()}
                  </Tabs.Root>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h2>
                <p className="text-gray-600">Track your freshness analysis over time</p>
              </div>
              
              {history.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis History</h3>
                  <p className="text-gray-600 mb-6">Start analyzing produce to build your history</p>
                  <Button onClick={() => setActiveTab('analyze')}>
                    Start Analyzing
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">{history.length} analyses</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        storage.clearHistory();
                        setHistory([]);
                        toast.success('History cleared');
                      }}
                    >
                      Clear History
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {history.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.item}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900">{item.item}</h3>
                                <span className={`text-sm px-2 py-1 rounded-full
                                  ${item.recommendation === 'buy' ? 'bg-green-100 text-green-700' : 
                                    item.recommendation === 'check' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-red-100 text-red-700'}`}>
                                  {item.recommendation}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Freshness: {item.freshness}% • {new Date(item.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Tooltip.Provider>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() => {
                                        storage.addToShoppingList({
                                          item: item.item,
                                          quantity: 1,
                                          notes: `Freshness: ${item.freshness}%`
                                        });
                                        setShoppingList(storage.getShoppingList());
                                        toast.success('Added to shopping list');
                                      }}
                                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                      <ShoppingCart className="w-4 h-4" />
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded text-sm">
                                      Add to shopping list
                                      <Tooltip.Arrow className="fill-gray-900" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              </Tooltip.Provider>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Shopping List Tab */}
          {activeTab === 'shopping' && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h2>
                <p className="text-gray-600">Keep track of items to buy based on your analyses</p>
              </div>
              
              {shoppingList.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Shopping List is Empty</h3>
                  <p className="text-gray-600 mb-6">Add items from your analysis results</p>
                  <Button onClick={() => setActiveTab('analyze')}>
                    Analyze Produce
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                      {shoppingList.filter(i => !i.checked).length} of {shoppingList.length} items remaining
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        storage.clearShoppingList();
                        setShoppingList([]);
                        toast.success('Shopping list cleared');
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {shoppingList.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`p-4 ${item.checked ? 'opacity-50' : ''}`}>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => {
                                storage.toggleShoppingItem(item.id);
                                setShoppingList(storage.getShoppingList());
                              }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                                ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}`}
                            >
                              {item.checked && <Check className="w-3 h-3 text-white" />}
                            </button>
                            
                            <div className="flex-1">
                              <h3 className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.quantity}x {item.item}
                              </h3>
                              {item.notes && (
                                <p className="text-sm text-gray-600">{item.notes}</p>
                              )}
                            </div>
                            
                            <button
                              onClick={() => {
                                storage.removeFromShoppingList(item.id);
                                setShoppingList(storage.getShoppingList());
                                toast.success('Removed from list');
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Export Shopping List */}
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const list = shoppingList
                          .filter(i => !i.checked)
                          .map(i => `${i.quantity}x ${i.item}${i.notes ? ` (${i.notes})` : ''}`)
                          .join('\n');
                        
                        const blob = new Blob([`FruitAI Shopping List\n${new Date().toLocaleDateString()}\n\n${list}`], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'fruitai-shopping-list.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                        
                        toast.success('Shopping list exported');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export List
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Made with freshness in mind by FruitAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}