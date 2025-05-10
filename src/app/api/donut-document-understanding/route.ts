import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Ensure the request is multipart/form-data
    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Call Hugging Face API with the Donut model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/naver-clova-ix/donut-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": image.type || "image/png",
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to extract text: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    // Extract text from the response, handling potential different response formats
    let extractedText = "";
    if (Array.isArray(result)) {
      extractedText = result[0]?.generated_text || "";
    } else if (typeof result === "object") {
      extractedText = result.generated_text || "";
    }

    return NextResponse.json({ text: extractedText });
  } catch (error: Error | unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process image",
      },
      { status: 500 }
    );
  }
}
