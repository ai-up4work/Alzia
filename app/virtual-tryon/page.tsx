// app/VirtualTryOn/page.tsx
'use client';

import { useState } from 'react';

export default function VirtualTryOn() {
  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!garmentFile || !personFile) {
      setError('Please select both images');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Virtual Try-On</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Garment Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Garment Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGarmentFile(e.target.files?.[0] || null)}
            className="block w-full text-sm border rounded-lg p-2"
          />
          {garmentFile && (
            <img
              src={URL.createObjectURL(garmentFile)}
              alt="Garment preview"
              className="mt-2 max-w-xs rounded"
            />
          )}
        </div>

        {/* Person Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Person Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPersonFile(e.target.files?.[0] || null)}
            className="block w-full text-sm border rounded-lg p-2"
          />
          {personFile && (
            <img
              src={URL.createObjectURL(personFile)}
              alt="Person preview"
              className="mt-2 max-w-xs rounded"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !garmentFile || !personFile}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Generate Try-On'}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">
            Generating virtual try-on... This may take 30-60 seconds
          </p>
        </div>
      )}

      {/* Result Display */}
      {resultImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <img
            src={resultImage}
            alt="Virtual try-on result"
            className="max-w-full rounded-lg shadow-lg"
          />
          <a
            href={resultImage}
            download="virtual-tryon-result.png"
            className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
}