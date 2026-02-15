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

// Helper to upload directly to Cloudinary from client
async function uploadToCloudinary(
  file: string | File,
  folder: string,
  publicId: string
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured');
  }

  const formData = new FormData();
  
  if (typeof file === 'string') {
    formData.append('file', file);
  } else {
    formData.append('file', file);
  }
  
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  formData.append('public_id', publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.secure_url;
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
      // Step 1: Generate virtual try-on
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

      // Step 2: Generate combined image
      setCurrentStep(2);
      const combinedImageBase64 = await generateCombinedImage(
        garmentFile,
        personFile,
        data.image
      );

      // Step 3: Try to upload to Cloudinary (optional - don't fail if it doesn't work)
      setCurrentStep(3);
      const jobId = `job-${Date.now()}`;
      const folderPath = `Alzia/${jobId}`;

      let cloudinaryUrls = {
        garment: '',
        person: '',
        output: '',
        combined: '',
      };

      try {
        console.log('☁️ Uploading to Cloudinary...');

        const [garmentUrl, personUrl, outputUrl, combinedUrl] = await Promise.all([
          uploadToCloudinary(garmentFile, folderPath, 'garment'),
          uploadToCloudinary(personFile, folderPath, 'person'),
          uploadToCloudinary(data.image, folderPath, 'output'),
          uploadToCloudinary(combinedImageBase64, folderPath, 'combined'),
        ]);

        cloudinaryUrls = {
          garment: garmentUrl,
          person: personUrl,
          output: outputUrl,
          combined: combinedUrl,
        };

        console.log('✅ Images uploaded to Cloudinary');

        // Step 4: Save metadata to Supabase (only if upload succeeded)
        setCurrentStep(4);
        try {
          console.log('💾 Saving metadata...');
          
          const metadataResponse = await fetch('/api/save-tryon-metadata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jobId,
              cloudinaryUrls,
              model: data.model,
              isLowQuality: data.isLowQuality || false,
            }),
          });

          if (metadataResponse.ok) {
            console.log('✅ Metadata saved');
          } else {
            console.warn('⚠️ Metadata save failed');
          }
        } catch (metadataError) {
          console.warn('⚠️ Metadata error:', metadataError);
        }
      } catch (uploadError) {
        console.warn('⚠️ Cloudinary upload failed:', uploadError);
        console.log('✅ Showing result anyway (image generated successfully)');
        // Continue anyway - we have the image!
      }

      setResult({
        image: cloudinaryUrls.output || data.image, // Use Cloudinary URL if available, else base64
        model: data.model,
        isLowQuality: data.isLowQuality || false,
        jobId,
        cloudinaryUrls: cloudinaryUrls.output ? cloudinaryUrls : undefined as any, // Only include if upload succeeded
      });

      setCurrentStep(5);
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

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';

      let currentX = padding;

      ctx.fillText('Garment', currentX + garmentWidth / 2, padding - 15);
      ctx.drawImage(garment, currentX, padding, garmentWidth, imageHeight);
      currentX += garmentWidth + gap;

      ctx.fillText('Original', currentX + personWidth / 2, padding - 15);
      ctx.drawImage(person, currentX, padding, personWidth, imageHeight);
      currentX += personWidth + gap;

      ctx.fillText('Virtual Try-On Result', currentX + outputWidth / 2, padding - 15);
      ctx.drawImage(output, currentX, padding, outputWidth, imageHeight);

      ctx.font = '20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText('Powered by Alzia Virtual Try-On', canvas.width / 2, totalHeight - 40);

      ctx.font = '14px Arial';
      ctx.fillStyle = '#9ca3af';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(date, canvas.width / 2, totalHeight - 20);

      resolve(canvas.toDataURL('image/png'));
    } catch (err) {
      reject(err);
    }
  });
}