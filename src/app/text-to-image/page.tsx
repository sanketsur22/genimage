"use client";
import { useState, useRef } from "react";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  imageUrl?: string;
}

export default function TextToImagePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    setMessages([]);
    setInputMessage("");
  };

  const handleGenerateImage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

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
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputMessage }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Here's your generated image:",
        sender: "assistant",
        timestamp: new Date(),
        imageUrl: data.imageUrl,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
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
      <ChatSidebar mode="text-to-image" onNewChat={handleNewChat} />

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
