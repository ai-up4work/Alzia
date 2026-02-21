// app/api/virtual-tryon/route.ts
// Using IDM-VTON - A proven working alternative to WeShopAI
import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: NextRequest) {
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

    // console.log('Received files:', {
    //   garment: garmentFile.name,
    //   person: personFile.name,
    // });

    // Convert Files to Blobs
    const garmentBlob = new Blob([await garmentFile.arrayBuffer()], { 
      type: garmentFile.type || 'image/png' 
    });
    const personBlob = new Blob([await personFile.arrayBuffer()], { 
      type: personFile.type || 'image/png' 
    });

    console.log('Connecting to IDM-VTON Space (more reliable than WeShopAI)...');
    const client = await Client.connect("yisol/IDM-VTON");

    // console.log('Submitting virtual try-on job...');
    
    // IDM-VTON API parameters:
    // Parameter 0: dict with background (person image)
    // Parameter 1: garment image (garm_img)
    // Parameter 2: garment description (optional)
    // Parameter 3: is_checked (boolean)
    // Parameter 4: is_checked_crop (boolean) 
    // Parameter 5: denoise_steps (number)
    // Parameter 6: seed (number)
    
    const job = client.submit("/tryon", [
      { background: personBlob },  // Person image in dict format
      garmentBlob,                 // Garment image
      "A garment",                 // Description (optional)
      true,                        // is_checked
      false,                       // is_checked_crop
      30,                          // denoise_steps
      42,                          // seed
    ]);

    // console.log('Waiting for result...');
    
    let result;
    for await (const message of job) {
      // console.log('📨 Message type:', message.type);
      
      if (message.type === 'status') {
        console.log('⏳ Status:', message.stage || 'processing');
      }
      
      if (message.type === 'data') {
        // console.log('✅ Data received!');
        result = message;
        break;
      }
      
      if (message.type === 'error') {
        console.error('❌ Error from Space:', message);
        throw new Error(`Space error: ${JSON.stringify(message)}`);
      }
    }

    if (!result || !result.data) {
      throw new Error('No result received from IDM-VTON');
    }

    // console.log('Result data structure:', JSON.stringify(result.data, null, 2));

    // IDM-VTON returns the image in data[0]
    const resultData = result.data[0];
    
    if (!resultData || resultData === null) {
      throw new Error(
        'IDM-VTON returned null. Please ensure: ' +
        '1) Person image shows someone facing forward clearly, ' +
        '2) Garment image is on a plain background, ' +
        '3) Both images are good quality (512x512 or larger)'
      );
    }

    let imageUrl: string | null = null;

    // Extract image URL
    if (typeof resultData === 'string') {
      imageUrl = resultData;
      // console.log('Image URL (string):', imageUrl);
    } else if (resultData && typeof resultData === 'object') {
      // Check common properties
      if ('url' in resultData) {
        imageUrl = (resultData as any).url;
        // console.log('Image URL from .url:', imageUrl);
      } else if ('path' in resultData) {
        imageUrl = (resultData as any).path;
        // console.log('Image URL from .path:', imageUrl);
      } else {
        // console.log('Searching all object properties...');
        for (const [key, value] of Object.entries(resultData)) {
          if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) {
            imageUrl = value;
            // console.log(`Found URL at '${key}':`, imageUrl);
            break;
          }
        }
      }
    }

    if (!imageUrl) {
      throw new Error(`Cannot extract image URL from: ${JSON.stringify(resultData)}`);
    }

    console.log('Downloading result image from:', imageUrl);

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log('🎉 Virtual try-on completed successfully!');

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: 'IDM-VTON'
    });

  } catch (error) {
    console.error('Virtual try-on error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process virtual try-on',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export const maxDuration = 300;