import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await context.params;

    if (!chatId || typeof chatId !== "string") {
      return NextResponse.json(
        { error: "Chat ID is required and must be a string" },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: chat.id,
      status: chat.status,
      imageUrl: chat.imageUrl,
      error: chat.error,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch chat status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
