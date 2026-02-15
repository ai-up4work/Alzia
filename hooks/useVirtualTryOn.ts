import { useState } from 'react';

interface VirtualTryOnResult {
  image: string;
  model: string;
  isLowQuality: boolean;
  jobId: string;
  cloudinaryUrls: {
    garment: string;
    person: string;
    output: string;
    combined: string;
  };
}

interface UseVirtualTryOnReturn {
  result: VirtualTryOnResult | null;
  loading: boolean;
  error: string | null;
  currentStep: number;
  generateTryOn: (garmentFile: File, personFile: File) => Promise<void>;
  reset: () => void;
}

export function useVirtualTryOn(): UseVirtualTryOnReturn {
  const [result, setResult] = useState<VirtualTryOnResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const generateTryOn = async (garmentFile: File, personFile: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(0);

    try {
      // Step 1: Upload to virtual try-on API
      setCurrentStep(1);
      const formData = new FormData();
      formData.append('garment', garmentFile);
      formData.append('person', personFile);

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process virtual try-on');
      }

      // Step 2: Generate combined image on client side
      setCurrentStep(2);
      const combinedImageBase64 = await generateCombinedImage(
        garmentFile,
        personFile,
        data.image
      );

      // Step 3: Save all images to Cloudinary
      setCurrentStep(3);
      const saveResponse = await fetch('/api/save-tryon-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          garmentFile: await fileToBase64(garmentFile),
          personFile: await fileToBase64(personFile),
          outputImage: data.image,
          combinedImage: combinedImageBase64,
          model: data.model,
          isLowQuality: data.isLowQuality,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.error || 'Failed to save results');
      }

      setResult({
        image: data.image,
        model: data.model,
        isLowQuality: data.isLowQuality,
        jobId: saveData.jobId,
        cloudinaryUrls: saveData.cloudinaryUrls,
      });

      setCurrentStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Virtual try-on error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setCurrentStep(0);
  };

  return {
    result,
    loading,
    error,
    currentStep,
    generateTryOn,
    reset,
  };
}

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Helper function to generate combined image on client side
async function generateCombinedImage(
  garmentFile: File,
  personFile: File,
  outputBase64: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Load all images
      const loadImage = (src: string | File): Promise<HTMLImageElement> => {
        return new Promise((res, rej) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(img);
          img.onerror = rej;
          
          if (typeof src === 'string') {
            img.src = src;
          } else {
            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target?.result as string;
            };
            reader.onerror = rej;
            reader.readAsDataURL(src);
          }
        });
      };

      const [garment, person, output] = await Promise.all([
        loadImage(garmentFile),
        loadImage(personFile),
        loadImage(outputBase64),
      ]);

      // Calculate dimensions
      const padding = 40;
      const gap = 30;
      const imageHeight = 600;
      
      const getScaledWidth = (img: HTMLImageElement) => {
        return (imageHeight / img.height) * img.width;
      };

      const garmentWidth = getScaledWidth(garment);
      const personWidth = getScaledWidth(person);
      const outputWidth = getScaledWidth(output);

      const totalWidth = garmentWidth + personWidth + outputWidth + (2 * gap) + (2 * padding);
      const totalHeight = imageHeight + (2 * padding) + 120;

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

      // Output
      ctx.fillText('Virtual Try-On Result', currentX + outputWidth / 2, padding - 15);
      ctx.drawImage(output, currentX, padding, outputWidth, imageHeight);

      // Watermark
      ctx.font = '20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText('Powered by Alzia Virtual Try-On', canvas.width / 2, totalHeight - 40);

      // Timestamp
      ctx.font = '14px Arial';
      ctx.fillStyle = '#9ca3af';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(date, canvas.width / 2, totalHeight - 20);

      // Convert to base64
      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      reject(err);
    }
  });
}