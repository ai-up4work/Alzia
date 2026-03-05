// app/api/virtual-tryon/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

async function fileToBase64DataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mime = file.type || 'image/png';
  return `data:${mime};base64,${base64}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const garmentFile = formData.get('person') as File;
    const personFile  = formData.get('garment')  as File;

    if (!garmentFile || !personFile) {
      return NextResponse.json(
        { error: 'Both garment and person images are required' },
        { status: 400 }
      );
    }

    // Convert to base64 data URLs — the API accepts these as the `url` field
    const [garmentDataUrl, personDataUrl] = await Promise.all([
      fileToBase64DataUrl(garmentFile),
      fileToBase64DataUrl(personFile),
    ]);

    const client = await Client.connect("WeShopAI/WeShopAI-Virtual-Try-On");

    // API schema (confirmed via gradio client):
    //   main_image       = person  (the model to dress)
    //   background_image = garment (the clothing item)
    // Images are passed as ImageData dicts with `url` = base64 data URL
    const result = await client.predict("/generate_image", {
      main_image: {
        url:       personDataUrl,
        orig_name: personFile.name,
        mime_type: personFile.type || 'image/png',
        is_stream: false,
        meta:      { _type: 'gradio.FileData' },
      },
      background_image: {
        url:       garmentDataUrl,
        orig_name: garmentFile.name,
        mime_type: garmentFile.type || 'image/png',
        is_stream: false,
        meta:      { _type: 'gradio.FileData' },
      },
    });

    console.log('Raw result:', JSON.stringify(result.data, null, 2));

    const resultData = result.data?.[0] ?? result.data;

    if (!resultData) {
      return NextResponse.json(
        { error: 'Our AI model is currently busy — please wait a moment and try again.' },
        { status: 503 }
      );
    }

    // Extract image URL from the ImageData dict response
    let imageUrl: string | null = null;

    if (typeof resultData === 'string') {
      imageUrl = resultData;
    } else if (resultData && typeof resultData === 'object') {
      imageUrl = (resultData as any).url ?? (resultData as any).path ?? null;
      if (!imageUrl) {
        for (const value of Object.values(resultData as object)) {
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

    const base64Image = Buffer.from(await imageResponse.arrayBuffer()).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log('🎉 Success!');

    return NextResponse.json({
      success: true,
      image: dataUrl,
      model: 'WeShopAI',
      isLowQuality: false,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Our AI model is currently busy — please wait a moment and try again.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export const maxDuration = 300;