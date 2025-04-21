import { NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from "@google/genai";
import prisma from '@/lib/prisma';

// Initialize the Gemini AI client
const genAI = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_AI_API_KEY || ''
});

export async function POST(request: Request) {
  try {
    const { prompt, clerkId } = await request.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing clerkId' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { clerkId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    try {
      // Generate the image using Gemini
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error('Invalid response format from Gemini API');
      }

      let imageUrl = '';
      let description = '';

      // Process the response parts
      for (const part of response.candidates[0].content.parts) {
        if ('text' in part && part.text) {
          description = part.text;
        } else if ('inlineData' in part && part.inlineData?.data) {
          // Convert base64 to data URL
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      if (!imageUrl) {
        throw new Error('No image was generated');
      }

      // Store the chat in the database
      const chat = await prisma.chat.create({
        data: {
          userId: user.id,
          prompt,
          imageUrl,
          description
        }
      });

      return NextResponse.json({ 
        imageUrl,
        description,
        chatId: chat.id
      });

    } catch (genError) {
      console.error('Gemini API error:', genError);
      return NextResponse.json(
        { error: 'Failed to generate image with Gemini' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-image route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}