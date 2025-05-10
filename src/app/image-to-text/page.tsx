"use client";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import the Next.js Image component
import ChatSidebar from "@/components/ChatSidebar";

const TEXT_TO_IMAGE_MODELS = [
  { id: "gemini-2", name: "Gemini 2.0" },
  { id: "stable-diffusion", name: "Stable Diffusion" },
  { id: "dall-e-3", name: "DALL-E 3" },
];

const OCR_MODELS = [
  { id: "tesseract", name: "Tesseract OCR (Google)" },
  { id: "tesseractInBuilt", name: "Tesseract (Tesseract.js)" },
  { id: "trocr", name: "TrOCR (Microsoft)" },
  { id: "donut", name: "Donut" },
];

const CAPTIONING_MODELS = [
  { id: "BLIP", name: "BLIP" },
  { id: "flamingo", name: "Flamingo" },
  { id: "show-and-tell", name: "Show and Tell (Google)" },
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  file?: File;
}

export default function ImageToTextPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<"generate-image" | "ocr" | "captioning">(
    "ocr"
  );
  const [selectedModel, setSelectedModel] = useState(OCR_MODELS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add model options based on selected mode
  const modelOptions =
    mode === "generate-image"
      ? TEXT_TO_IMAGE_MODELS
      : mode === "ocr"
      ? OCR_MODELS
      : CAPTIONING_MODELS;

  // Update selected model when mode changes
  useEffect(() => {
    setSelectedModel(
      mode === "generate-image"
        ? TEXT_TO_IMAGE_MODELS[0].id
        : mode === "ocr"
        ? OCR_MODELS[0].id
        : CAPTIONING_MODELS[0].id
    );
  }, [mode]);

  // Add navigation when mode changes
  useEffect(() => {
    if (mode === "generate-image") {
      router.push("/text-to-image");
    }
  }, [mode, router]);

  const handleNewChat = () => {
    setMessages([]);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isProcessing) {
      setIsProcessing(true);
      const file = acceptedFiles[0];
      const newMessage: Message = {
        id: Date.now().toString(),
        content: `Processing image: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
        file: file,
      };
      setMessages((prev) => [...prev, newMessage]);

      try {
        let response;
        const formData = new FormData();
        formData.append("image", file);

        // OCR Models
        if (mode === "ocr") {
          switch (selectedModel) {
            case "tesseract":
              response = await fetch("/api/tesseract-ocr", {
                method: "POST",
                body: formData,
              });
              break;
            case "tesseractInBuilt":
              response = await fetch("/api/tesseract-built-in", {
                method: "POST",
                body: formData,
              });
              break;
            case "trocr":
              response = await fetch(
                "/api/trocr-text-recognition-image-to-text",
                {
                  method: "POST",
                  body: formData,
                }
              );
              break;
            case "donut":
              response = await fetch(
                "/api/donut-document-understanding/route",
                {
                  method: "POST",
                  body: formData,
                }
              );
              break;
          }
        }
        // Image Captioning Models
        else if (mode === "captioning") {
          switch (selectedModel) {
            case "BLIP":
              response = await fetch("/api/blip-image-to-text", {
                method: "POST",
                body: formData,
              });
              break;
            case "flamingo":
              response = await fetch("/api/flamingo-caption", {
                method: "POST",
                body: formData,
              });
              break;
            case "show-and-tell":
              response = await fetch("/api/show-and-tell-caption", {
                method: "POST",
                body: formData,
              });
              break;
          }
        }

        if (!response || !response.ok) {
          throw new Error("Failed to process image");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            data.text || data.caption || "No text/caption could be generated",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Sorry, there was an error processing your image. Please try again.",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUploadClick = () => {
    if (!isProcessing) {
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: isProcessing,
    noClick: true, // Disable automatic click handling
  });

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 -z-10"></div>
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <ChatSidebar
          mode="image-to-text"
          onNewChat={handleNewChat}
          onToggleHistory={() => setShowHistory(!showHistory)}
          showHistory={showHistory}
        />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-xl opacity-20" />

        {/* Main area */}
        <div className="flex-1 flex flex-col h-full backdrop-blur-sm bg-white/10 rounded-l-2xl">
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {messages.length === 0 ? (
              <div
                {...getRootProps()}
                className={`h-full flex items-center justify-center ${
                  isDragActive ? "bg-white/20" : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center p-12 border-2 border-dashed border-white/40 rounded-2xl cursor-pointer hover:border-white/60 transition-colors backdrop-blur-sm bg-white/10">
                  <div className="text-4xl mb-4">📸</div>
                  <p className="text-white/80">
                    {isDragActive
                      ? "Drop your image here..."
                      : "Drag and drop an image here, or click to select a file"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-purple-700 text-white backdrop-blur-sm border border-white/20"
                          : "bg-white/20 text-white backdrop-blur-sm border border-white/10"
                      }`}
                    >
                      {message.file ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-auto rounded-lg border border-white/20 overflow-hidden">
                            <Image
                              src={URL.createObjectURL(message.file)}
                              alt="Uploaded"
                              width={500}
                              height={300}
                              className="max-w-full"
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          <p>{message.content}</p>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          {/* Upload button area */}
          <div className="border-t border-white/20 p-4 backdrop-blur-md bg-white/5 overflow-hidden">
            <div className="flex gap-4 mb-4">
              <select
                value={mode}
                onChange={(e) =>
                  setMode(
                    e.target.value as "generate-image" | "ocr" | "captioning"
                  )
                }
                className="bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="ocr">Text from Image (OCR)</option>
                <option value="captioning">Describe Image (Captioning)</option>
                <option value="generate-image">Generate Image from Text</option>
              </select>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {modelOptions.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div {...getRootProps()} className="flex-1">
                <input {...getInputProps()} />
                <button
                  onClick={handleUploadClick}
                  className={`w-full bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    isProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-opacity-90"
                  }`}
                  disabled={isProcessing}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {isProcessing ? "Processing..." : "Upload Image"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
