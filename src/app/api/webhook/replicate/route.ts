import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const prediction = await request.json();

    // Only process completed predictions
    if (prediction.status !== "succeeded") {
      return NextResponse.json({ success: true });
    }

    // Extract the relevant data from the prediction
    const { id, output, error } = prediction;

    // Find the pending chat entry using the prediction ID
    const chat = await prisma.chat.findFirst({
      where: {
        replicatePredictionId: id,
      } as Prisma.ChatWhereInput,
    });

    if (!chat) {
      console.error(`No chat found for prediction ID: ${id}`);
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (error) {
      // Update chat with error status
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          status: "failed" as const,
          error: error,
        } as Prisma.ChatUpdateInput,
      });
      return NextResponse.json({ success: false, error });
    }

    // Update the chat with the generated image URL
    const imageUrl = Array.isArray(output) ? output[0] : output;
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        imageUrl,
        status: "completed" as const,
        error: null,
      } as Prisma.ChatUpdateInput,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in replicate webhook:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
