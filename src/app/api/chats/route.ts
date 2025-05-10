import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    if (!clerkId) {
      console.error("Missing clerkId in request");
      return NextResponse.json(
        { error: "Unauthorized - Missing clerkId" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
    });

    if (!user) {
      console.error(`User not found for clerkId: ${clerkId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const skip = (page - 1) * limit;

    try {
      // Get chats using Prisma's standard findMany
      const [chats, total] = await Promise.all([
        prisma.chat.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            prompt: true,
            imageUrl: true,
            description: true,
            createdAt: true,
          },
        }),
        prisma.chat.count({
          where: { userId: user.id },
        }),
      ]);

      return NextResponse.json({
        chats: chats.map((chat) => ({
          ...chat,
          createdAt: chat.createdAt.toISOString(),
        })),
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + chats.length < total,
        },
      });
    } catch (dbError) {
      console.error("Database error while fetching chats:", dbError);
      return NextResponse.json(
        { error: "Database error while fetching chats" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in GET /api/chats:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch chats",
      },
      { status: 500 }
    );
  }
}
