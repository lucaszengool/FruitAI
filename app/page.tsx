'use client';

import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Camera, Upload, Leaf, Star, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

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
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to show error state
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'check':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'avoid':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'check':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'avoid':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-green-800">FruitAI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-700">Welcome, {user?.firstName || 'User'}!</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Analyze Fruit & Vegetable Freshness
          </h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Upload a photo of fruits or vegetables and get instant AI-powered freshness analysis 
            with buying recommendations for smarter grocery shopping.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Upload Section */}
            <div className="mb-8">
              <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="relative max-w-md mx-auto">
                      <Image
                        src={selectedImage}
                        alt="Selected fruit/vegetable"
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full h-64"
                      />
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={analyzeImage}
                        disabled={analyzing}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                      >
                        {analyzing ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-5 h-5" />
                            <span>Analyze Freshness</span>
                          </>
                        )}
                      </button>
                      
                      <label className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 cursor-pointer transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>Choose Different Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Upload a Photo
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Take or upload a clear photo of fruits or vegetables
                      </p>
                      <label className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer inline-flex items-center space-x-2 transition-colors">
                        <Camera className="w-5 h-5" />
                        <span>Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Analysis Results</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-2">Item Detected</h4>
                      <p className="text-2xl font-bold text-green-600">{result.item}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-2">Freshness Score</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              result.freshness >= 70 ? 'bg-green-500' :
                              result.freshness >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.freshness}%` }}
                          ></div>
                        </div>
                        <span className="text-xl font-bold text-gray-700">{result.freshness}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className={`rounded-lg p-4 border ${getRecommendationColor(result.recommendation)}`}>
                    <div className="flex items-center space-x-3 mb-2">
                      {getRecommendationIcon(result.recommendation)}
                      <h4 className="font-bold text-lg capitalize">
                        Recommendation: {result.recommendation}
                      </h4>
                    </div>
                    <p className="mb-3">{result.details}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4" />
                      <span>Confidence: {result.confidence}%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-3">Detailed Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Color:</span>
                        <p className="text-gray-800">{result.characteristics.color}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Texture:</span>
                        <p className="text-gray-800">{result.characteristics.texture}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Blemishes:</span>
                        <p className="text-gray-800">{result.characteristics.blemishes}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Ripeness:</span>
                        <p className="text-gray-800">{result.characteristics.ripeness}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">Advanced computer vision analyzes freshness indicators</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Recommendations</h3>
            <p className="text-gray-600">Get buy, check, or avoid recommendations instantly</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confidence Scoring</h3>
            <p className="text-gray-600">Know how confident our AI is in each analysis</p>
          </div>
        </div>
      </main>
    </div>
  );
}