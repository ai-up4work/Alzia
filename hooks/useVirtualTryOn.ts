// hooks/useVirtualTryOn.ts
import { useState } from 'react';

interface VirtualTryOnResult {
  image: string; // Proxied URL with token for result image (for display)
  imageBase64: string; // Base64 result image (for download, never expires)
  combinedImage: string; // Base64 combined image (for download)
  combinedImageUrl: string; // Proxied URL with token for combined image (for display)
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

      const jobId = data.jobId || `job-${Date.now()}`;

      // Step 2: Convert garment file to base64
      setCurrentStep(2);
      console.log('📸 Converting garment to base64...');
      const garmentBase64 = await fileToBase64(garmentFile);

      // Step 3: Convert person file to base64
      setCurrentStep(3);
      console.log('📸 Converting person photo to base64...');
      const personBase64 = await fileToBase64(personFile);

      // Step 4: Generate combined image (client-side)
      setCurrentStep(4);
      console.log('🖼️ Creating combined preview...');
      
      const combinedImageBase64 = await generateCombinedImage(
        garmentFile,
        personFile,
        data.image
      );

      console.log('✅ Combined preview created');

      // Step 5: Upload all images to Cloudinary
      setCurrentStep(5);
      console.log('☁️ Uploading images to Cloudinary...');

      const cloudinaryUrls: {
        garment: string;
        person: string;
        output: string;
        combined: string;
      } = {
        garment: '',
        person: '',
        output: '',
        combined: '',
      };

      try {
        // Upload all images in parallel for speed
        const [garmentUpload, personUpload, outputUpload, combinedUpload] = await Promise.allSettled([
          // Upload garment image
          fetch('/api/upload-to-cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: garmentBase64,
              folder: 'virtual-tryon/garments',
              publicId: `${jobId}-garment`,
            }),
          }),
          // Upload person image
          fetch('/api/upload-to-cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: personBase64,
              folder: 'virtual-tryon/persons',
              publicId: `${jobId}-person`,
            }),
          }),
          // Upload result/output image
          fetch('/api/upload-to-cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: data.image,
              folder: 'virtual-tryon/results',
              publicId: `${jobId}-result`,
            }),
          }),
          // Upload combined image
          fetch('/api/upload-to-cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: combinedImageBase64,
              folder: 'virtual-tryon/combined',
              publicId: `${jobId}-combined`,
            }),
          }),
        ]);

        // Process garment upload
        if (garmentUpload.status === 'fulfilled' && garmentUpload.value.ok) {
          const garmentData = await garmentUpload.value.json();
          cloudinaryUrls.garment = garmentData.url;
          console.log('✅ Garment uploaded to Cloudinary');
        } else {
          console.warn('⚠️ Garment upload failed');
        }

        // Process person upload
        if (personUpload.status === 'fulfilled' && personUpload.value.ok) {
          const personData = await personUpload.value.json();
          cloudinaryUrls.person = personData.url;
          console.log('✅ Person uploaded to Cloudinary');
        } else {
          console.warn('⚠️ Person upload failed');
        }

        // Process result upload
        if (outputUpload.status === 'fulfilled' && outputUpload.value.ok) {
          const outputData = await outputUpload.value.json();
          cloudinaryUrls.output = outputData.url;
          console.log('✅ Result uploaded to Cloudinary');
        } else {
          console.warn('⚠️ Result upload failed');
        }

        // Process combined upload
        if (combinedUpload.status === 'fulfilled' && combinedUpload.value.ok) {
          const combinedData = await combinedUpload.value.json();
          cloudinaryUrls.combined = combinedData.url;
          console.log('✅ Combined image uploaded to Cloudinary');
        } else {
          console.warn('⚠️ Combined upload failed');
        }

        console.log('✅ All Cloudinary uploads complete');
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
        // Continue even if uploads fail - we still have base64
      }

      // Step 6: Generate proxy URL for the result image (for frontend display)
      setCurrentStep(6);
      console.log('🔒 Generating secure proxy token for result image...');

      let resultProxyUrl = data.image; // Fallback to base64
      let expiresAt: number | undefined;
      let expiresIn: string | undefined;
      
      try {
        const tokenResponse = await fetch('/api/tryon-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageUrl: data.image,
            expiresInMinutes: 10 // Token expires in 10 minutes
          }),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          resultProxyUrl = tokenData.url;
          expiresAt = tokenData.expiresAt;
          expiresIn = tokenData.expiresIn;
          console.log('✅ Secure proxy token generated for result image');
        } else {
          console.warn('⚠️ Proxy token generation failed for result, using base64');
        }
      } catch (tokenError) {
        console.warn('⚠️ Proxy token generation error for result:', tokenError);
      }

      // Step 7: Generate proxy URL for the combined image (for frontend display)
      setCurrentStep(7);
      console.log('🔒 Generating secure proxy token for combined image...');

      let combinedProxyUrl = combinedImageBase64; // Fallback to base64
      
      try {
        const combinedTokenResponse = await fetch('/api/tryon-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageUrl: combinedImageBase64,
            expiresInMinutes: 10 // Token expires in 10 minutes
          }),
        });

        if (combinedTokenResponse.ok) {
          const combinedTokenData = await combinedTokenResponse.json();
          combinedProxyUrl = combinedTokenData.url;
          console.log('✅ Secure proxy token generated for combined image');
        } else {
          console.warn('⚠️ Proxy token generation failed for combined image, using base64');
        }
      } catch (combinedTokenError) {
        console.warn('⚠️ Proxy token generation error for combined image:', combinedTokenError);
      }

      // Step 8: Save metadata to database with CLOUDINARY URLs (permanent storage)
      setCurrentStep(8);
      
      try {
        console.log('💾 Saving metadata with Cloudinary URLs to database...');
        
        const metadataResponse = await fetch('/api/save-tryon-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            cloudinaryUrls: cloudinaryUrls, // IMPORTANT: These are the permanent Cloudinary URLs
            model: data.model,
            isLowQuality: data.isLowQuality || false,
          }),
        });

        if (metadataResponse.ok) {
          console.log('✅ Metadata with Cloudinary URLs saved to database');
        } else {
          const errorData = await metadataResponse.json();
          console.warn('⚠️ Metadata save failed:', errorData.error);
        }
      } catch (metadataError) {
        console.warn('⚠️ Metadata save error:', metadataError);
        // Don't fail the whole process if metadata save fails
      }

      // IMPORTANT: Frontend gets PROXY URLs (temporary, secure)
      // Database gets CLOUDINARY URLs (permanent, for later retrieval)
      setResult({
        image: resultProxyUrl, // PROXY URL for frontend display (expires in 10 min)
        imageBase64: data.image, // Base64 for download (never expires)
        combinedImage: combinedImageBase64, // Base64 for download (never expires)
        combinedImageUrl: combinedProxyUrl, // PROXY URL for frontend display (expires in 10 min)
        model: data.model,
        isLowQuality: data.isLowQuality || false,
        jobId,
        expiresAt,
        expiresIn,
      });

      setCurrentStep(9);
      console.log('🎉 Process complete!');
      console.log('📊 Summary:');
      console.log('  - Frontend display: Proxy URLs (temporary, secure)');
      console.log('  - Database: Cloudinary URLs (permanent)');
      console.log('  - Downloads: Base64 (always works)');
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

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
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