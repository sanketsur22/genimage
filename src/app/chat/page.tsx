"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "text-to-image";
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a sample response from the assistant.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 bg-gradient-to-br from-indigo-500 to-purple-600">
      <ChatSidebar mode={mode} onNewChat={handleNewChat} />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-xl opacity-20" />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full backdrop-blur-sm bg-white/10 rounded-l-2xl">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="text-center text-white/80 mt-10">
              {mode === "text-to-image"
                ? "Describe the image you want to generate..."
                : "Upload an image or paste its URL to extract text..."}
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
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Message input */}
        <div className="border-t border-white/20 p-4 backdrop-blur-md bg-white/5">
          <div className="flex gap-2">
            {mode === "image-to-text" && (
              <button
                className="bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-800 transition-all border border-white/20 transform hover:scale-105"
                onClick={() => {
                  /* TODO: Implement image upload */
                }}
              >
                Upload Image
              </button>
            )}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                mode === "text-to-image"
                  ? "Describe the image you want to generate..."
                  : "Paste image URL or type a message..."
              }
              className="flex-1 rounded-xl border border-white/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 text-white placeholder-white/70"
            />
            <button
              onClick={handleSendMessage}
              className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!inputMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
