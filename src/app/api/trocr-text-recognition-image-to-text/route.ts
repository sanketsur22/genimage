import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// Create a temporary directory to store uploaded images
const getTempImagePath = () => {
  const fileName = `${uuidv4()}.jpg`;
  return join("/tmp", fileName);
};

export async function POST(request: NextRequest) {
  try {
    // Check if the request is a form data request
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Check file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Write the file to a temporary location
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imagePath = getTempImagePath();
    await writeFile(imagePath, buffer);

    // Get the Hugging Face API token from environment variables
    const huggingFaceToken = process.env.HUGGINGFACE_API_TOKEN;

    if (!huggingFaceToken) {
      return NextResponse.json(
        { error: "HUGGINGFACE_API_TOKEN is not set in environment variables" },
        { status: 500 }
      );
    }

    // Call the TrOCR model using the Hugging Face Inference API
    // Using the microsoft/trocr-base-handwritten model for handwritten text
    const modelEndpoint =
      "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten";

    // Send the image to Hugging Face API
    const response = await fetch(modelEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${huggingFaceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: buffer.toString("base64"),
        },
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      let errorDetails;
      // Clone the response before trying to read it as JSON
      // This way we can still read it as text if JSON parsing fails
      const responseClone = response.clone();

      try {
        // Try to parse as JSON, but don't fail if it's not JSON
        errorDetails = await response.json();
      } catch {
        // If it's not JSON, use the text instead from the cloned response
        const errorText = await responseClone.text();
        errorDetails = { message: errorText };
      }

      return NextResponse.json(
        { error: "Failed to extract text from image", details: errorDetails },
        { status: response.status }
      );
    }

    // Parse the response
    const result = await response.json();

    // Return the extracted text
    return NextResponse.json({ text: result[0].generated_text });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
