'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Download, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Clock, Sparkles, CheckCircle2, Info, AlertTriangle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Progress } from '@/components/ui/progress';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';
import { Header } from "@/components/header";
import { VirtualTryOnButtons } from "@/components/VirtualTryOnButtons";


// Example images for the carousel
const exampleGarments = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771171272/Alzia/job-1771171269335/person.jpg',
    title: 'Brown Suit Dress',
    category: 'Fitted Dress'
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771166285/Alzia/job-1771166282423/person.jpg',
    title: 'Yello Saree',
    category: 'Saree'
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771171270/Alzia/job-1771171269335/garment.jpg',
    title: 'Pink Abaya',
    category: 'Abaya'
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771221259/Alzia/job-1771221255792/garment.jpg',
    title: 'Kids Saree',
    category: 'Saree'
  },
];

const examplePersons = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771167102/Alzia/job-1771167097318/person.webp',
    title: 'Studio Portrait',
    tip: 'Full body, facing forward'
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771167256/Alzia/job-1771167252248/garment.jpg',
    title: 'Actress Photo',
    tip: 'Well-lit, clear pose'
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771217591/Alzia/job-1771217590283/person.jpg',
    title: 'Emma Watson Red Carpet',
    tip: 'High-quality, full body'
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/diwynktss/image/upload/v1771219178/Alzia/job-1771219175138/person.jpg',
    title: 'Abaya Model',
    tip: 'Good lighting, clear pose'
  },
];

// Processing steps without emojis
const processingSteps = [
  { label: 'Checking credits', time: '1s', duration: 1000 },
  { label: 'Processing images', time: '8-10s', duration: 10000 },
  { label: 'Connecting to AI engine', time: '7-8s', duration: 8000 },
  { label: 'Analyzing garment details', time: '14-17s', duration: 16000 },
  { label: 'Detecting body pose', time: '18-20s', duration: 20000 },
  { label: 'Generating virtual try-on', time: '25-35s', duration: 30000 },
  { label: 'Processing final image', time: '5-10s', duration: 7000 },
  { label: 'Finalizing result', time: '2-3s', duration: 2500 },
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showExamples, setShowExamples] = useState(true);
  
  // Credit tracking state
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [creditsError, setCreditsError] = useState<string | null>(null);

  const { result, loading, error, currentStep, generateTryOn, reset } = useVirtualTryOn();

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, []);

  // Refetch credits after successful try-on
  useEffect(() => {
    if (result && !loading) {
      fetchCredits();
    }
  }, [result, loading]);

  const fetchCredits = async () => {
    try {
      setCreditsLoading(true);
      setCreditsError(null);
      
      const response = await fetch('/api/check-tryon-credits');

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      } else if (response.status === 401) {
        // User not logged in - silently ignore, don't show credits
        setCredits(null);
        setCreditsError(null); // Clear any previous errors
      } else {
        // Other errors - show to user
        setCreditsError('Failed to load credits');
      }
    } catch (err) {
      console.error('Error fetching credits:', err);
      // Network or other errors - silently fail for non-authenticated users
      setCredits(null);
      setCreditsError(null);
    } finally {
      setCreditsLoading(false);
    }
  };

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

  // Simulate processing steps
  useEffect(() => {
    if (loading) {
      const stepTimings = [1000, 10000, 8000, 16000, 20000, 30000, 7000, 2500];
      let totalElapsed = 0;
      
      stepTimings.forEach((duration, index) => {
        setTimeout(() => {
          setCurrentStepIndex(index + 1);
        }, totalElapsed);
        totalElapsed += duration;
      });
    } else {
      setCurrentStepIndex(0);
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!garmentFile || !personFile) {
      return;
    }

    await generateTryOn(garmentFile, personFile);
  };

  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGarmentFile(file);
      setGarmentPreview(URL.createObjectURL(file));
    }
  };

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPersonFile(file);
      setPersonPreview(URL.createObjectURL(file));
    }
  };

  const selectExampleGarment = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'example-garment.jpg', { type: 'image/jpeg' });
      setGarmentFile(file);
      setGarmentPreview(url);
    } catch (err) {
      console.error('Failed to load example image');
    }
  };

  const selectExamplePerson = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'example-person.jpg', { type: 'image/jpeg' });
      setPersonFile(file);
      setPersonPreview(url);
    } catch (err) {
      console.error('Failed to load example image');
    }
  };

  const removeGarmentFile = () => {
    setGarmentFile(null);
    setGarmentPreview(null);
  };

  const removePersonFile = () => {
    setPersonFile(null);
    setPersonPreview(null);
  };

  const resetAll = () => {
    setGarmentFile(null);
    setPersonFile(null);
    setGarmentPreview(null);
    setPersonPreview(null);
    setShowExamples(true);
    setCurrentStepIndex(0);
    reset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const progressPercentage = loading ? ((currentStepIndex / processingSteps.length) * 100) : 0;

  // Show examples if neither file is selected, or keep them visible if only one is selected
  const shouldShowExamples = showExamples && (!garmentFile || !personFile);

  // Download handler for result image - uses base64 that never expires
  const handleDownload = async () => {
    if (!result?.imageBase64) return;
    
    try {
      // Use the base64 image which never expires
      const link = document.createElement('a');
      link.href = result.imageBase64;
      link.download = 'virtual-tryon-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Download handler for combined image - uses base64 that never expires
  const handleDownloadCombined = async () => {
    if (!result?.combinedImage) return;
    
    try {
      // Use the base64 image which never expires
      const link = document.createElement('a');
      link.href = result.combinedImage;
      link.download = 'virtual-tryon-combined.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
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
            
            {/* Credits Display */}
            {!creditsLoading && credits !== null && (
              <div className="mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-full border border-blue-200">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-xs text-blue-600 font-medium">Available Credits</p>
                  <p className="text-lg font-bold text-blue-900">{credits}</p>
                </div>
                {credits === 0 && (
                  <Button size="sm" className="ml-2">
                    Buy More Credits
                  </Button>
                )}
              </div>
            )}
            
            {creditsError && (
              <div className="mt-6 inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{creditsError}</span>
              </div>
            )}
          </div>

          {/* Processing Time Info Banner */}
          <div className="max-w-3xl mx-auto mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Average Processing Time: 2-3 minutes • Cost: 1 credit per try-on
                </p>
                <p className="text-xs text-blue-700">
                  Our AI technology analyzes both images and generates a realistic try-on result. Your images are processed securely and not stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* No Credits Warning */}
          {!creditsLoading && credits === 0 && (
            <div className="max-w-3xl mx-auto mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    No Credits Remaining
                  </h3>
                  <p className="text-sm text-amber-800 mb-4">
                    You've used all your virtual try-on credits. Purchase more credits to continue using this feature.
                  </p>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Purchase Credits
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Examples Section */}
              {shouldShowExamples && (
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
                    {!garmentPreview && !shouldShowExamples && (
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
                    {!personPreview && !shouldShowExamples && (
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
                  disabled={loading || !garmentFile || !personFile || credits === 0}
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
                      Generate Try-On (1 credit)
                    </>
                  )}
                </Button>
                
                {(garmentFile || personFile || result) && !loading && (
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
            {result?.isLowQuality && !loading && (
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
                        Note: The premium model produces much more realistic and accurate virtual try-on results. We recommend waiting a moment and trying again for the best experience.
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
                      Elapsed time: {formatTime(elapsedTime)} • Estimated: 2-3 minutes
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
                          index < currentStepIndex
                            ? 'bg-green-50 border border-green-200'
                            : index === currentStepIndex
                            ? 'bg-purple-50 border border-purple-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          index < currentStepIndex
                            ? 'bg-green-100 text-green-600'
                            : index === currentStepIndex
                            ? 'bg-purple-100 text-purple-600 animate-pulse'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {index < currentStepIndex ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">{step.time}</p>
                        </div>
                        {index === currentStepIndex && (
                          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Privacy notice while waiting */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-900">
                      <strong>Privacy Note:</strong> We don't store your images. Make sure to download your result before leaving this page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && !loading && (
              <div className="mt-12">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Success! 1 credit used</span>
                  </div>
                  <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">
                    Your Virtual Try-On Result
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Here's how the garment looks on you
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-2xl bg-white">
                    <img
                      src={result.imageBase64}
                      alt="Virtual try-on result"
                      className="w-full h-auto"
                    />
                  </div>

                  <VirtualTryOnButtons
                    onDownloadResult={handleDownload}
                    onDownloadComparison={handleDownloadCombined}
                    hasComparison={!!result.combinedImage}
                    onReset={resetAll}
                    resultImageBase64={result.imageBase64}       
                    comparisonImageBase64={result.combinedImage}  
                  />

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900 mb-1">
                          Important: Download Your Result
                        </p>
                        <p className="text-xs text-amber-700">
                          We don't store your images for privacy. Please download your result before leaving this page or starting a new try-on.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Section */}
            {!loading && !result && (garmentFile || personFile) && (
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
                      <p className="text-sm font-medium text-gray-900">Privacy First</p>
                      <p className="text-xs text-gray-600">Your images are processed securely and not stored</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How It Works Section */}
            {!loading && !result && !garmentFile && !personFile && !shouldShowExamples && (
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
                      Our AI analyzes both images and creates a realistic virtual try-on in 2-3 minutes
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Download className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">3. Download Result</h4>
                    <p className="text-sm text-gray-600">
                      See the result and download both the try-on image and side-by-side comparison
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