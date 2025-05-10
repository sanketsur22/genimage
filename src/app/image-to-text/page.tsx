"use client";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  file?: File;
}

export default function ImageToTextPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    setMessages([]);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const newMessage: Message = {
        id: Date.now().toString(),
        content: `Processing image: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
        file: file,
      };
      setMessages((prev) => [...prev, newMessage]);

      // Simulate response (replace with actual API call)
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "This is the extracted text from your image. Replace this with actual OCR results.",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] mt-16 bg-gradient-to-br from-indigo-500 to-purple-600">
      <ChatSidebar mode="image-to-text" onNewChat={handleNewChat} />

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
                    {message.file ? (
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(message.file)}
                          alt="Uploaded"
                          className="max-w-full rounded-lg border border-white/20"
                        />
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
        <div className="border-t border-white/20 p-4 backdrop-blur-md bg-white/5">
          <div className="flex gap-2">
            <div {...getRootProps()} className="flex-1">
              <input {...getInputProps()} />
              <button className="w-full bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
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
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
