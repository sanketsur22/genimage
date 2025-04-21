"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";

const TEXT_TO_IMAGE_MODELS = [
  { id: "gemini-2", name: "Gemini 2.0" },
  { id: "stable-diffusion", name: "Stable Diffusion" },
  { id: "dall-e-3", name: "DALL-E 3" },
];

const IMAGE_TO_TEXT_MODELS = [
  { id: "gemini-vision", name: "Gemini Vision" },
  { id: "gpt-4-vision", name: "GPT-4 Vision" },
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  imageUrl?: string;
}

export default function TextToImagePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<"text-to-image" | "image-to-text">(
    "text-to-image"
  );
  const [selectedModel, setSelectedModel] = useState(
    TEXT_TO_IMAGE_MODELS[0].id
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  // Add model options based on selected mode
  const modelOptions =
    mode === "text-to-image" ? TEXT_TO_IMAGE_MODELS : IMAGE_TO_TEXT_MODELS;

  // Update selected model when mode changes
  useEffect(() => {
    setSelectedModel(
      mode === "text-to-image"
        ? TEXT_TO_IMAGE_MODELS[0].id
        : IMAGE_TO_TEXT_MODELS[0].id
    );
  }, [mode]);

  // Add navigation when mode changes
  useEffect(() => {
    if (mode === "image-to-text") {
      router.push("/image-to-text");
    }
  }, [mode, router]);

  const handleNewChat = () => {
    setMessages([]);
    setInputMessage("");
  };

  const handleGenerateImage = async () => {
    if (!inputMessage.trim() || isGenerating || !userId) return;

    // Check if the selected model is Gemini 2.0
    if (selectedModel !== "gemini-2") {
      const comingSoonMessage: Message = {
        id: Date.now().toString(),
        content:
          "This feature is coming soon! Currently, only Gemini 2.0 is supported.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, comingSoonMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/gemini-generate-image", {
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
    } catch (error) {
      console.error("Error generating image:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, there was an error generating your image. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
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
    <div className="flex h-[calc(100vh-4rem)] mt-16 bg-gradient-to-br from-indigo-500 to-purple-600">
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
                    <img
                      src={message.imageUrl}
                      alt="Generated"
                      className="max-w-full rounded-lg border border-white/20"
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
                setMode(e.target.value as "text-to-image" | "image-to-text")
              }
              className="bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="text-to-image">Text to Image</option>
              <option value="image-to-text">Image to Text</option>
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
  );
}
