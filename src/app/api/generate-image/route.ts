import { NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error('Invalid response format from Gemini API');
    }

    const parts = response.candidates[0].content.parts;
    let imageData: string | null = null;
    let description: string | null = null;

    for (const part of parts) {
      if ('text' in part && part.text) {
        description = part.text;
      } else if ('inlineData' in part && part.inlineData?.data) {
        imageData = part.inlineData.data;
      }
    }

    if (!imageData) {
      throw new Error('No image was generated');
    }

    const imageUrl = `data:image/png;base64,${imageData}`;
    return NextResponse.json({ 
      imageUrl,
      description
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}