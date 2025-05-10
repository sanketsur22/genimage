import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || 'your_token';
const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, clerkId } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized - Missing clerkId' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;

    // Save it to database (example: Chat, or wherever you're saving generated images)
    const newChat = await prisma.chat.create({
      data: {
        userId: user.id,
        prompt,
        imageUrl,
        status: 'completed',
      },
    });

    return NextResponse.json({ chatId: newChat.id, imageUrl });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

