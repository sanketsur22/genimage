import { createWorker } from "tesseract.js";
import { NextRequest, NextResponse } from "next/server";

// Function to perform OCR on an image URL or Blob
const convertImageToText = async (image: string | Blob) => {
  try {
    // Create a worker for English language
    const worker = await createWorker("eng");

    // Recognize text in the image
    const result = await worker.recognize(image);

    // Get the extracted text
    const extractedText = result.data.text;
    console.log("Extracted Text:", extractedText);

    // Clean up resources
    await worker.terminate();

    return extractedText;
  } catch (error) {
    console.error("OCR Error:", error);
    throw error; // Re-throw to handle in the POST function
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    let image: string | Blob;

    // Handle different types of input
    if (imageFile instanceof Blob) {
      image = imageFile;
    } else if (typeof imageFile === "string") {
      // If it's a URL string, pass it directly to tesseract
      image = imageFile;
    } else {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    const extractedText = await convertImageToText(image);

    return NextResponse.json({
      text: extractedText,
      success: true,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to process image",
        details: String(error),
        success: false,
      },
      { status: 500 }
    );
  }
}
