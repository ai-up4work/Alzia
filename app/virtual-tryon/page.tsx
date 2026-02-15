'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Download, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Clock, Sparkles, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Progress } from '@/components/ui/progress';

// Example images for the carousel
const exampleGarments = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    title: 'Floral Dress',
    category: 'Dress'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    title: 'Casual T-Shirt',
    category: 'Top'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    title: 'Denim Jacket',
    category: 'Jacket'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400',
    title: 'Summer Blouse',
    category: 'Top'
  },
];

const examplePersons = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    title: 'Professional Shot',
    tip: 'Full body, facing forward'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    title: 'Casual Portrait',
    tip: 'Upper body, good lighting'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    title: 'Clear Background',
    tip: 'Plain background works best'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    title: 'Natural Light',
    tip: 'Well-lit, natural pose'
  },
];

// Based on actual API logs: 57s, 68s, 80s processing times
const processingSteps = [
  { label: 'Saving files temporarily', time: '2-3s', icon: '💾', duration: 2500 },
  { label: 'Connecting to AI engine', time: '3-5s', icon: '🔗', duration: 4000 },
  { label: 'Analyzing garment details', time: '10-15s', icon: '👔', duration: 12000 },
  { label: 'Detecting body pose', time: '15-20s', icon: '🎯', duration: 17000 },
  { label: 'Generating virtual try-on', time: '25-35s', icon: '✨', duration: 30000 },
  { label: 'Finalizing result', time: '5-10s', icon: '🎨', duration: 7000 },
];

interface CarouselProps {
  items: typeof exampleGarments | typeof examplePersons;
  onSelect: (url: string) => void;
  type: 'garment' | 'person';
}

function Carousel({ items, onSelect, type }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const isGarment = type === 'garment';
  const typedItems = items as any[];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {typedItems.map((item) => (
            <div key={item.id} className="min-w-full">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden group">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-medium mb-1">{item.title}</p>
                  <p className="text-xs text-white/90">
                    {isGarment ? (item as any).category : (item as any).tip}
                  </p>
                </div>
                <Button
                  onClick={() => onSelect(item.url)}
                  size="sm"
                  className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use This
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-gray-900" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {typedItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-gray-900 w-6' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function VirtualTryOn() {
  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showExamples, setShowExamples] = useState(true);
  const [modelUsed, setModelUsed] = useState<string>('');
  const [showQualityWarning, setShowQualityWarning] = useState(false);

  // Timer for elapsed time during processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!garmentFile || !personFile) {
      setError('Please select both images');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);
    setCurrentStep(0);
    setElapsedTime(0);
    setShowQualityWarning(false);

    // Simulate processing steps based on actual durations
    const stepTimings = [2500, 4000, 12000, 17000, 30000, 7000];
    let totalElapsed = 0;
    
    stepTimings.forEach((duration, index) => {
      setTimeout(() => {
        if (loading) {
          setCurrentStep(index + 1);
        }
      }, totalElapsed);
      totalElapsed += duration;
    });

    try {
      const formData = new FormData();
      formData.append('garment', garmentFile);
      formData.append('person', personFile);

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process');
      }

      setResultImage(data.image);
      setModelUsed(data.model || '');
      setShowQualityWarning(data.isLowQuality || false);
      setCurrentStep(processingSteps.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setCurrentStep(0);
    }
  };

  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGarmentFile(file);
      setGarmentPreview(URL.createObjectURL(file));
      setShowExamples(false);
      setError(null);
    }
  };

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPersonFile(file);
      setPersonPreview(URL.createObjectURL(file));
      setShowExamples(false);
      setError(null);
    }
  };

  const selectExampleGarment = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'example-garment.jpg', { type: 'image/jpeg' });
      setGarmentFile(file);
      setGarmentPreview(url);
      setShowExamples(false);
      setError(null);
    } catch (err) {
      setError('Failed to load example image');
    }
  };

  const selectExamplePerson = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'example-person.jpg', { type: 'image/jpeg' });
      setPersonFile(file);
      setPersonPreview(url);
      setShowExamples(false);
      setError(null);
    } catch (err) {
      setError('Failed to load example image');
    }
  };

  const removeGarmentFile = () => {
    setGarmentFile(null);
    setGarmentPreview(null);
    setError(null);
  };

  const removePersonFile = () => {
    setPersonFile(null);
    setPersonPreview(null);
    setError(null);
  };

  const resetAll = () => {
    setGarmentFile(null);
    setPersonFile(null);
    setGarmentPreview(null);
    setPersonPreview(null);
    setResultImage(null);
    setError(null);
    setShowExamples(true);
    setShowQualityWarning(false);
    setModelUsed('');
  };

  const downloadCombinedImage = async () => {
    if (!garmentPreview || !personPreview || !resultImage) return;

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load all images
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      const [garment, person, result] = await Promise.all([
        loadImage(garmentPreview),
        loadImage(personPreview),
        loadImage(resultImage),
      ]);

      // Calculate dimensions (3 images side by side with padding)
      const padding = 40;
      const gap = 30;
      const imageHeight = 600;
      
      // Scale images to same height while maintaining aspect ratio
      const getScaledWidth = (img: HTMLImageElement) => {
        return (imageHeight / img.height) * img.width;
      };

      const garmentWidth = getScaledWidth(garment);
      const personWidth = getScaledWidth(person);
      const resultWidth = getScaledWidth(result);

      const totalWidth = garmentWidth + personWidth + resultWidth + (2 * gap) + (2 * padding);
      const totalHeight = imageHeight + (2 * padding) + 120; // Extra space for labels and watermark

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw labels
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';

      let currentX = padding;

      // Garment
      ctx.fillText('Garment', currentX + garmentWidth / 2, padding - 15);
      ctx.drawImage(garment, currentX, padding, garmentWidth, imageHeight);
      currentX += garmentWidth + gap;

      // Person
      ctx.fillText('Original', currentX + personWidth / 2, padding - 15);
      ctx.drawImage(person, currentX, padding, personWidth, imageHeight);
      currentX += personWidth + gap;

      // Result
      ctx.fillText('Virtual Try-On Result', currentX + resultWidth / 2, padding - 15);
      ctx.drawImage(result, currentX, padding, resultWidth, imageHeight);

      // Add watermark/branding at bottom
      ctx.font = '20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText('Powered by Alzia Virtual Try-On', canvas.width / 2, totalHeight - 40);

      // Add timestamp
      ctx.font = '14px Arial';
      ctx.fillStyle = '#9ca3af';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(date, canvas.width / 2, totalHeight - 20);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `virtual-tryon-combined-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error creating combined image:', err);
      setError('Failed to create combined image');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const progressPercentage = loading ? ((currentStep / processingSteps.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">AI-Powered Technology</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4">
              Virtual Try-On
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how our garments look on you before you buy. Upload a photo and a garment image to get started.
            </p>
          </div>

          {/* Processing Time Info Banner */}
          <div className="max-w-3xl mx-auto mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Average Processing Time: 60-80 seconds
                </p>
                <p className="text-xs text-blue-700">
                  Our AI technology analyzes both images and generates a realistic try-on result. Please be patient while we work our magic! ✨
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Examples Section */}
              {showExamples && !garmentFile && !personFile && (
                <div className="mb-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                      Try Our Examples
                    </h2>
                    <p className="text-sm text-gray-600">
                      Click on any example to get started quickly
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Example Garments */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">1</span>
                        Choose a Garment
                      </h3>
                      <Carousel items={exampleGarments} onSelect={selectExampleGarment} type="garment" />
                    </div>

                    {/* Example Persons */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-semibold">2</span>
                        Choose a Model
                      </h3>
                      <Carousel items={examplePersons} onSelect={selectExamplePerson} type="person" />
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Or upload your own images below
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Garment Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-900">
                      Garment Image
                    </label>
                    {!garmentPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExamples(true)}
                        className="text-xs"
                      >
                        View Examples
                      </Button>
                    )}
                  </div>
                  
                  {!garmentPreview ? (
                    <label className="relative block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGarmentUpload}
                        className="sr-only"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 hover:bg-gray-50 transition-all">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Click to upload garment
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                      <img
                        src={garmentPreview}
                        alt="Garment preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeGarmentFile}
                        className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-colors"
                        aria-label="Remove garment image"
                      >
                        <X className="w-4 h-4 text-gray-700" />
                      </button>
                      <div className="p-3 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600 truncate flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {garmentFile?.name || 'Example garment selected'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Person Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-900">
                      Your Photo
                    </label>
                    {!personPreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExamples(true)}
                        className="text-xs"
                      >
                        View Examples
                      </Button>
                    )}
                  </div>
                  
                  {!personPreview ? (
                    <label className="relative block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePersonUpload}
                        className="sr-only"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 hover:bg-gray-50 transition-all">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Click to upload your photo
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                      <img
                        src={personPreview}
                        alt="Person preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePersonFile}
                        className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-colors"
                        aria-label="Remove person image"
                      >
                        <X className="w-4 h-4 text-gray-700" />
                      </button>
                      <div className="p-3 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600 truncate flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {personFile?.name || 'Example photo selected'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  type="submit"
                  disabled={loading || !garmentFile || !personFile}
                  size="lg"
                  className="rounded-full px-8 min-w-[200px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Try-On
                    </>
                  )}
                </Button>
                
                {(garmentFile || personFile || resultImage) && !loading && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAll}
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Start Over
                  </Button>
                )}
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 mb-1">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Quality Warning for IDM-VTON */}
            {showQualityWarning && resultImage && !loading && (
              <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">
                      Lower Quality Result - Backup Model Used
                    </h3>
                    <p className="text-sm text-amber-800 mb-3">
                      Our premium AI model is currently unavailable, so we used a backup model. The result may not be as accurate. For the best quality results, please:
                    </p>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Upload a clear, high-resolution photo</strong> with good lighting (avoid dark or blurry images)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Use a straight, frontal posture</strong> - face the camera directly with arms at your sides</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Show your full upper body</strong> in the frame (from head to waist or below)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Use a plain, uncluttered background</strong> - avoid busy backgrounds or multiple people</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span><strong>Try again in a few minutes</strong> when our premium model may be available</span>
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-xs text-amber-700 italic">
                        💡 Tip: The premium model produces much more realistic and accurate virtual try-on results. We recommend waiting a moment and trying again for the best experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State with Progress */}
            {loading && (
              <div className="mt-12">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  {/* Progress Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Creating Your Virtual Try-On
                    </h3>
                    <p className="text-sm text-gray-600">
                      Elapsed time: {formatTime(elapsedTime)} • Estimated: 60-80 seconds
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {Math.round(progressPercentage)}% complete
                    </p>
                  </div>

                  {/* Processing Steps */}
                  <div className="space-y-4">
                    {processingSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                          index < currentStep
                            ? 'bg-green-50 border border-green-200'
                            : index === currentStep
                            ? 'bg-purple-50 border border-purple-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          index < currentStep
                            ? 'bg-green-100'
                            : index === currentStep
                            ? 'bg-purple-100 animate-pulse'
                            : 'bg-gray-100'
                        }`}>
                          {index < currentStep ? '✓' : step.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">{step.time}</p>
                        </div>
                        {index === currentStep && (
                          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tips while waiting */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-900">
                      <strong>💡 Did you know?</strong> Our AI analyzes over 100 body points and 50+ garment features to create a realistic try-on experience!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Result Display */}
            {resultImage && !loading && (
              <div className="mt-12">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Success!</span>
                  </div>
                  <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                    Your Virtual Try-On Result
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Here's how the garment looks on you
                  </p>
                  {modelUsed && (
                    <p className="text-xs text-gray-500">
                      Generated using: <span className="font-medium">{modelUsed}</span>
                    </p>
                  )}
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-2xl bg-white">
                    <img
                      src={resultImage}
                      alt="Virtual try-on result"
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <Button
                      onClick={downloadCombinedImage}
                      size="lg"
                      className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Combined Image
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8"
                    >
                      <a
                        href={resultImage}
                        download="virtual-tryon-result.png"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Result Only
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetAll}
                      className="rounded-full px-8"
                    >
                      Try Another
                    </Button>
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    💡 The combined image includes garment, original photo, and result - perfect for sharing!
                  </p>
                </div>
              </div>
            )}

            {/* Info Section */}
            {!loading && !resultImage && (garmentFile || personFile) && (
              <div className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Tips for Best Results
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                      1
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clear Photos</p>
                      <p className="text-xs text-gray-600">Use well-lit images with the person facing forward</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-semibold">
                      2
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Plain Background</p>
                      <p className="text-xs text-gray-600">Garments should be on plain backgrounds for best results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                      3
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">High Resolution</p>
                      <p className="text-xs text-gray-600">Higher quality images produce more realistic results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-semibold">
                      4
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Processing Time</p>
                      <p className="text-xs text-gray-600">Typical processing takes 60-80 seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How It Works Section */}
            {!loading && !resultImage && !garmentFile && !personFile && !showExamples && (
              <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-serif font-light text-gray-900 mb-6 text-center">
                  How It Works
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">1. Upload Images</h4>
                    <p className="text-sm text-gray-600">
                      Choose a garment and upload a photo of yourself or use our examples
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-pink-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">2. AI Processing</h4>
                    <p className="text-sm text-gray-600">
                      Our AI analyzes both images and creates a realistic virtual try-on (60-80s)
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Download className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">3. Download Result</h4>
                    <p className="text-sm text-gray-600">
                      View your result and download the image to share or save
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}