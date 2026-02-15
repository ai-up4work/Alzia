// app/api/virtual-tryon/route.ts
// Working version that mimics Python gradio_client behavior
import { NextRequest, NextResponse } from 'next/server';
import { client as gradioClient, handle_file } from '@gradio/client';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(request: NextRequest) {
  let tempGarmentPath: string | null = null;
  let tempPersonPath: string | null = null;

  try {
    const formData = await request.formData();
    const garmentFile = formData.get('garment') as File;
    const personFile = formData.get('person') as File;

    if (!garmentFile || !personFile) {
      return NextResponse.json(
        { error: 'Both garment and person images are required' },
        { status: 400 }
      );
    }

    console.log('Saving files temporarily...');
    const tempDir = os.tmpdir();
    tempGarmentPath = path.join(tempDir, `garment-${Date.now()}.png`);
    tempPersonPath = path.join(tempDir, `person-${Date.now()}.png`);

    const garmentBuffer = Buffer.from(await garmentFile.arrayBuffer());
    const personBuffer = Buffer.from(await personFile.arrayBuffer());

    fs.writeFileSync(tempGarmentPath, garmentBuffer);
    fs.writeFileSync(tempPersonPath, personBuffer);

    console.log('Files saved:', {
      garment: tempGarmentPath,
      person: tempPersonPath
    });

    console.log('Connecting to Gradio Space...');
    const app = await gradioClient("WeShopAI/WeShopAI-Virtual-Try-On");

    console.log('Making prediction (using predict() like Python)...');
    
    // Use predict() method with handle_file() like Python does
    const result = await app.predict("/generate_image", [
      handle_file(tempGarmentPath),      // main_image
      handle_file(tempPersonPath),       // background_image  
    ]);

    console.log('Result received:', result);

    // Clean up temp files
    if (tempGarmentPath && fs.existsSync(tempGarmentPath)) {
      fs.unlinkSync(tempGarmentPath);
    }
    if (tempPersonPath && fs.existsSync(tempPersonPath)) {
      fs.unlinkSync(tempPersonPath);
    }

    // Extract result - it should be in result.data
    if (!result || !result.data) {
      throw new Error('No data in result');
    }

    console.log('Result data:', result.data);

    // The result.data should be an array [image, did_string]
    const imageData = result.data[0];
    
    if (!imageData || imageData === null) {
      throw new Error('Image data is null - Space failed to process. Try different images.');
    }

    let imageUrl: string;

    // Handle different formats
    if (typeof imageData === 'string') {
      imageUrl = imageData;
    } else if (typeof imageData === 'object' && imageData !== null) {
      if ('url' in imageData) {
        imageUrl = (imageData as any).url;
      } else if ('path' in imageData) {
        imageUrl = (imageData as any).path;
      } else {
        throw new Error(`Unknown image data format: ${JSON.stringify(imageData)}`);
      }
    } else {
      throw new Error(`Cannot extract URL from: ${typeof imageData}`);
    }

    console.log('Downloading from:', imageUrl);

    // Download the result
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Download failed: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('Success!');

    return NextResponse.json({
      success: true,
      image: dataUrl,
    });

  } catch (error: any) {
    console.error('Virtual try-on error:', error);
    
    // Clean up on error
    try {
      if (tempGarmentPath && fs.existsSync(tempGarmentPath)) {
        fs.unlinkSync(tempGarmentPath);
      }
      if (tempPersonPath && fs.existsSync(tempPersonPath)) {
        fs.unlinkSync(tempPersonPath);
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    return NextResponse.json(
      { 
        error: 'Failed to process virtual try-on',
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

export const maxDuration = 300; // 5 minutes timeout