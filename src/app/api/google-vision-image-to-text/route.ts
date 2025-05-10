import { NextRequest, NextResponse } from "next/server";
import vision from "@google-cloud/vision";

// Create a client
const client = new vision.ImageAnnotatorClient({
  credentials: {
    client_email: "vision-api@focused-beacon-388005.iam.gserviceaccount.com",
    private_key: process.env.GOOGLE_AI_API_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { imageUrl } = data;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Perform text detection on the image
    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return NextResponse.json(
        { message: "No text detected in the image" },
        { status: 200 }
      );
    }

    // The first annotation contains all the text found in the image
    const extractedText = detections[0].description;

    return NextResponse.json({
      text: extractedText,
      success: true,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
