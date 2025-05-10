"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import the Next.js Image component
import ChatSidebar from "@/components/ChatSidebar";
import { useUser } from "@clerk/nextjs";

const TEXT_TO_IMAGE_MODELS = [
  { id: "stable-diffusion", name: "Stable Diffusion XL" },
  { id: "gemini-2", name: "Gemini 2.0" },
  { id: "dall-e-3", name: "DALL·E 3 (Coming Soon)" },
];

const OCR_MODELS = [
  { id: "tesseract", name: "Tesseract OCR (Google)" },
  { id: "tesseractInBuilt", name: "Tesseract (Tesseract.js)" },
  { id: "trocr", name: "TrOCR" },
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
  imageUrl?: string;
  status?: "pending" | "completed" | "failed";
  chatId?: string;
}

export default function TextToImagePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<"generate-image" | "ocr" | "captioning">(
    "generate-image"
  );
  const [selectedModel, setSelectedModel] = useState("stable-diffusion");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const modelOptions =
    mode === "generate-image"
      ? TEXT_TO_IMAGE_MODELS
      : mode === "ocr"
      ? OCR_MODELS
      : CAPTIONING_MODELS;

  useEffect(() => {
    setSelectedModel(
      mode === "generate-image"
        ? TEXT_TO_IMAGE_MODELS[0].id
        : mode === "ocr"
        ? OCR_MODELS[0].id
        : CAPTIONING_MODELS[0].id
    );
  }, [mode]);

  useEffect(() => {
    if (mode === "ocr" || mode === "captioning") {
      router.push("/image-to-text");
    }
  }, [mode, router]);

  const handleNewChat = () => {
    setMessages([]);
    setInputMessage("");
  };

  const pollForUpdates = async (chatId: string, messageId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      if (data.status === "completed" && data.imageUrl) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: "completed",
                  imageUrl: data.imageUrl,
                  content: "Here's your generated image:",
                }
              : msg
          )
        );

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setIsGenerating(false);
      } else if (data.status === "failed") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: "failed",
                  content: data.error || "Failed to generate image.",
                }
              : msg
          )
        );

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error polling for updates:", error);
    }
  };

  const handleGenerateImage = async () => {
    if (!inputMessage.trim() || isGenerating || !userId) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);

    try {
      let response;
      if (selectedModel === "stable-diffusion") {
        response = await fetch("/api/stable-diffusion-generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputMessage,
            clerkId: userId,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const pendingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Generating your image... This may take a few moments.",
          sender: "assistant",
          timestamp: new Date(),
          status: "pending",
          chatId: data.chatId,
        };

        setMessages((prev) => [...prev, pendingMessage]);

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
        pollIntervalRef.current = setInterval(
          () => pollForUpdates(data.chatId, pendingMessage.id),
          2000
        );
      } else if (selectedModel === "gemini-2") {
        response = await fetch("/api/gemini-generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputMessage,
            clerkId: userId,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        const assistantMessage: Message = {
          id: data.chatId || (Date.now() + 1).toString(),
          content: data.description || "Here's your generated image:",
          sender: "assistant",
          timestamp: new Date(),
          imageUrl: data.imageUrl,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsGenerating(false);
      } else {
        const comingSoonMessage: Message = {
          id: Date.now().toString(),
          content:
            "This model is coming soon! Currently, only Gemini 2.0 and Stable Diffusion are supported.",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, comingSoonMessage]);
        setIsGenerating(false);
      }
    } catch (error: unknown) {
      console.error("Error generating image:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          error instanceof Error
            ? error.message
            : "Sorry, there was an error generating your image. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
        status: "failed",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 -z-10"></div>
      <div className="flex h-[calc(100vh-4rem)] mt-16">
        <ChatSidebar
          mode="text-to-image"
          onNewChat={handleNewChat}
          onToggleHistory={() => setShowHistory(!showHistory)}
          showHistory={showHistory}
        />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-xl opacity-20" />

        {/* Main area */}
        <div className="flex-1 flex flex-col h-full backdrop-blur-sm bg-white/10 rounded-l-2xl">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="text-center text-white/80 mt-10">
                Describe the image you want to generate...
              </div>
            )}
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-purple-700 text-white backdrop-blur-sm border border-white/20"
                        : "bg-white/20 text-white backdrop-blur-sm border border-white/10"
                    }`}
                  >
                    <p className="mb-2">{message.content}</p>
                    {message.imageUrl && (
                      <Image
                        src={message.imageUrl}
                        alt="Generated"
                        width={500}
                        height={400}
                        className="max-w-full rounded-lg border border-white/20"
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-white/20 p-4 backdrop-blur-md bg-white/5">
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
                <option value="generate-image">Generate Image from Text</option>
                <option value="ocr">Text from Image (OCR)</option>
                <option value="captioning">Describe Image (Captioning)</option>
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
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe the image you want to generate..."
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 text-white placeholder-white/70"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerateImage}
                className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!inputMessage.trim() || isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
