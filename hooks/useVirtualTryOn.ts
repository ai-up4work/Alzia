// hooks/useVirtualTryOn.ts
import { useState } from 'react';

interface VirtualTryOnResult {
  image: string;
  imageBase64: string;
  combinedImage: string;
  combinedImageUrl: string;
  model: string;
  isLowQuality: boolean;
  jobId: string;
  expiresAt?: number;
  expiresIn?: string;
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
      // Generate jobId first
      const jobId = `job-${Date.now()}`;

      // Step 1: Generate virtual try-on
      setCurrentStep(1);
      console.log('🎨 Generating virtual try-on...');
      
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

      console.log('✅ Virtual try-on generated');
      console.log('Output URL from API:', data.image);

      // Step 2: Generate combined image (client-side)
      setCurrentStep(2);
      console.log('🖼️ Creating combined preview...');
      
      const combinedImageBase64 = await generateCombinedImage(
        garmentFile,
        personFile,
        data.image
      );

      console.log('✅ Combined preview created');

      // Step 3: Upload output image to Cloudinary
      setCurrentStep(3);
      console.log('☁️ Uploading output image to Cloudinary...');

      let outputCloudinaryUrl = data.image; // Fallback

      try {
        const outputUploadResponse = await fetch('/api/upload-output-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: data.image,
            jobId: jobId,
          }),
        });
        
        if (outputUploadResponse.ok) {
          const outputUploadData = await outputUploadResponse.json();
          outputCloudinaryUrl = outputUploadData.url;
          console.log('✅ Output uploaded:', outputCloudinaryUrl);
        } else {
          console.error('⚠️ Output upload failed');
        }
      } catch (outputUploadError) {
        console.error('⚠️ Output upload error:', outputUploadError);
      }

      // Step 4: Upload garment and person images to Cloudinary
      setCurrentStep(4);
      console.log('☁️ Uploading garment and person images to Cloudinary...');

      let garmentCloudinaryUrl = garmentFile.name; // Fallback
      let personCloudinaryUrl = personFile.name; // Fallback

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('garment', garmentFile);
        uploadFormData.append('person', personFile);
        uploadFormData.append('jobId', jobId);
        
        const uploadResponse = await fetch('/api/upload-images', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          garmentCloudinaryUrl = uploadData.garmentUrl;
          personCloudinaryUrl = uploadData.personUrl;
          console.log('✅ Garment uploaded:', garmentCloudinaryUrl);
          console.log('✅ Person uploaded:', personCloudinaryUrl);
        } else {
          console.error('⚠️ Image upload failed');
        }
      } catch (uploadError) {
        console.error('⚠️ Image upload error:', uploadError);
      }

      // Step 5: Upload combined image to Cloudinary
      setCurrentStep(5);
      console.log('☁️ Uploading combined image to Cloudinary...');

      let combinedCloudinaryUrl = combinedImageBase64; // Fallback to base64

      try {
        // Convert base64 to blob
        const base64Response = await fetch(combinedImageBase64);
        const blob = await base64Response.blob();
        
        const combinedFormData = new FormData();
        combinedFormData.append('file', blob, 'combined-image.png');
        combinedFormData.append('jobId', jobId);
        
        const combinedUploadResponse = await fetch('/api/upload-combined-image', {
          method: 'POST',
          body: combinedFormData,
        });
        
        if (combinedUploadResponse.ok) {
          const combinedUploadData = await combinedUploadResponse.json();
          combinedCloudinaryUrl = combinedUploadData.url;
          console.log('✅ Combined image uploaded:', combinedCloudinaryUrl);
        } else {
          console.error('⚠️ Combined upload failed');
        }
      } catch (combinedUploadError) {
        console.error('⚠️ Combined image upload error:', combinedUploadError);
      }

      // Step 6: Generate one-time access token for the result image
      setCurrentStep(6);
      console.log('🔒 Generating secure access token for result image...');

      let resultProxyUrl = outputCloudinaryUrl; // Fallback to Cloudinary URL
      let expiresAt: number | undefined;
      let expiresIn: string | undefined;
      
      try {
        const tokenResponse = await fetch('/api/tryon-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageUrl: outputCloudinaryUrl,
            expiresInMinutes: 10
          }),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          resultProxyUrl = tokenData.url;
          expiresAt = tokenData.expiresAt;
          expiresIn = tokenData.expiresIn;
          console.log('✅ Secure token generated for result image');
        } else {
          console.warn('⚠️ Token generation failed for result');
        }
      } catch (tokenError) {
        console.warn('⚠️ Token generation error for result:', tokenError);
      }

      // Step 7: Generate one-time access token for the combined image
      setCurrentStep(7);
      console.log('🔒 Generating secure access token for combined image...');

      let combinedProxyUrl = combinedCloudinaryUrl; // Use Cloudinary URL as fallback
      
      try {
        const combinedTokenResponse = await fetch('/api/tryon-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageUrl: combinedCloudinaryUrl,
            expiresInMinutes: 10
          }),
        });

        if (combinedTokenResponse.ok) {
          const combinedTokenData = await combinedTokenResponse.json();
          combinedProxyUrl = combinedTokenData.url;
          console.log('✅ Secure token generated for combined image');
        } else {
          console.warn('⚠️ Token generation failed for combined image');
        }
      } catch (combinedTokenError) {
        console.warn('⚠️ Token generation error for combined image:', combinedTokenError);
      }

      // Step 8: Save metadata to database with REAL Cloudinary URLs
      setCurrentStep(8);
      
      try {
        console.log('💾 Saving metadata to database...');
        console.log('📊 Metadata to save:', {
          jobId,
          output: outputCloudinaryUrl,
          garment: garmentCloudinaryUrl,
          person: personCloudinaryUrl,
          combined: combinedCloudinaryUrl,
        });
        
        const metadataResponse = await fetch('/api/save-tryon-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            cloudinaryUrls: {
              output: outputCloudinaryUrl,           // ✅ REAL Cloudinary URL (uploaded)
              garment: garmentCloudinaryUrl,         // ✅ REAL Cloudinary URL (uploaded)
              person: personCloudinaryUrl,           // ✅ REAL Cloudinary URL (uploaded)
              combined: combinedCloudinaryUrl,       // ✅ REAL Cloudinary URL (uploaded)
            },
            model: data.model,
            isLowQuality: data.isLowQuality || false,
          }),
        });

        if (metadataResponse.ok) {
          console.log('✅ Metadata saved to database');
        } else {
          const errorData = await metadataResponse.json();
          console.error('❌ Metadata save failed:', errorData.error);
        }
      } catch (metadataError) {
        console.error('❌ Metadata save error:', metadataError);
      }

      setResult({
        image: resultProxyUrl,
        imageBase64: data.image,
        combinedImage: combinedImageBase64,
        combinedImageUrl: combinedProxyUrl,
        model: data.model,
        isLowQuality: data.isLowQuality || false,
        jobId,
        expiresAt,
        expiresIn,
      });

      setCurrentStep(9);
      console.log('🎉 Process complete!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('❌ Virtual try-on error:', err);
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
