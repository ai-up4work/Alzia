// app/api/virtual-tryon/route-weshop-array.ts
// Last attempt at WeShopAI - using array parameters instead of object
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

    console.log('Received files:', {
      garment: garmentFile.name,
      person: personFile.name,
    });

    // Convert Files to Blobs
    const garmentBlob = new Blob([await garmentFile.arrayBuffer()], { 
      type: garmentFile.type || 'image/png' 
    });
    const personBlob = new Blob([await personFile.arrayBuffer()], { 
      type: personFile.type || 'image/png' 
    });

    console.log('Connecting to WeShopAI Space...');
    const client = await Client.connect("WeShopAI/WeShopAI-Virtual-Try-On");

    console.log('Trying with ARRAY parameters...');
    
    // Try 1: Array with garment first
    console.log('Attempt 1: [garment, person]');
    let job = client.submit("/generate_image", [
      garmentBlob,
      personBlob,
    ]);

    let result;
    for await (const message of job) {
      console.log('Message type:', message.type);
      if (message.type === 'data') {
        console.log('Data:', JSON.stringify(message.data, null, 2));
        if (message.data && message.data[0] !== null) {
          result = message;
          console.log('✅ Success with [garment, person]');
          break;
        } else {
          console.log('❌ Got null with [garment, person], trying reversed...');
        }
      }
    }

    // Try 2: If first attempt gave null, try reversed
    if (!result || !result.data || result.data[0] === null) {
      console.log('Attempt 2: [person, garment]');
      job = client.submit("/generate_image", [
        personBlob,
        garmentBlob,
      ]);

      for await (const message of job) {
        console.log('Message type:', message.type);
        if (message.type === 'data') {
          console.log('Data:', JSON.stringify(message.data, null, 2));
          if (message.data && message.data[0] !== null) {
            result = message;
            console.log('✅ Success with [person, garment]');
            break;
          } else {
            console.log('❌ Got null with [person, garment] too');
          }
        }
      }
    }

    if (!result || !result.data || result.data[0] === null) {
      throw new Error(
        'WeShopAI returned null for both parameter orders. ' +
        'This Space appears to be broken or incompatible with these images. ' +
        'Recommendation: Use IDM-VTON instead (route-final-idm-vton.ts)'
      );
    }

    const resultData = result.data[0];
    
    let imageUrl: string | null = null;

    if (typeof resultData === 'string') {
      imageUrl = resultData;
    } else if (resultData && typeof resultData === 'object') {
      if ('url' in resultData) {
        imageUrl = (resultData as any).url;
      } else if ('path' in resultData) {
        imageUrl = (resultData as any).path;
      } else {
        for (const [key, value] of Object.entries(resultData)) {
          if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) {
            imageUrl = value;
            break;
          }
        }
      }
    }

    if (!imageUrl) {
      throw new Error(`Cannot extract image URL from: ${JSON.stringify(resultData)}`);
    }

    console.log('Downloading result from:', imageUrl);

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Download failed: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log('🎉 Success!');

    return NextResponse.json({
      success: true,
      image: dataUrl,
    });

  } catch (error) {
    console.error('Error:', error);
    
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