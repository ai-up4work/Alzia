// app/api/virtual-tryon/route.ts
// WeShopAI only - IDM-VTON disabled (inaccurate results)
import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: NextRequest) {
  try {
    // IMPORTANT: This must use formData(), not json()
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

    console.log('Trying WeShopAI...');
    
    const job = client.submit("/generate_image", [
      garmentBlob,
      personBlob,
    ]);

    let result;
    let modelUsed = '';

    for await (const message of job) {
      console.log('Message type:', message.type);
      if (message.type === 'data') {
        console.log('Data:', JSON.stringify(message.data, null, 2));
        if (message.data && message.data[0] !== null) {
          result = message;
          modelUsed = 'WeShopAI';
          console.log('✅ WeShopAI Success!');
          break;
        } else {
          console.log('⚠️ WeShopAI returned null');
        }
        break;
      }
    }

    // ❌ IDM-VTON fallback disabled — results were too inaccurate
    // if (!result || !result.data || result.data[0] === null) {
    //   console.log('🔄 Using IDM-VTON as fallback...');
    //   isLowQuality = true;
    //   
    //   const idmClient = await Client.connect("yisol/IDM-VTON");
    //   
    //   const idmJob = idmClient.submit("/tryon", [
    //     { background: personBlob },
    //     garmentBlob,
    //     "A garment",
    //     true,
    //     false,
    //     30,
    //     42,
    //   ]);
    //
    //   for await (const message of idmJob) {
    //     if (message.type === 'status') {
    //       console.log('IDM-VTON Status:', message.stage || 'processing');
    //     }
    //     if (message.type === 'data') {
    //       result = message;
    //       modelUsed = 'IDM-VTON';
    //       console.log('✅ IDM-VTON Success!');
    //       break;
    //     }
    //   }
    // }

    // If WeShopAI returned null or failed — model is busy
    if (!result || !result.data || result.data[0] === null) {
      return NextResponse.json(
        { 
          error: 'Our AI model is currently busy — many people are generating try-ons right now! Please wait a moment and try again 🙏',
        },
        { status: 503 }
      );
    }

    console.log(`✨ Result from: ${modelUsed}`);

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
      model: modelUsed,
      isLowQuality: false,
    });

  } catch (error) {
    console.error('Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Our AI model is currently busy — many people are generating try-ons right now! Please wait a moment and try again 🙏',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export const maxDuration = 300;