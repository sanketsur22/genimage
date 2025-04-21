import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type Chat = {
  id: string;
  prompt: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
};

interface ChatHistoryProps {
  mode: string;
}

export default function ChatHistory({ mode }: ChatHistoryProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clerkId: userId }),
        });
        const data = await response.json();
        setChats(data.chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading chat history...</div>;
  }

  if (chats?.length === 0) {
    return <div className="p-4">No previous conversations found.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Previous Conversations</h2>
      {chats?.map((chat) => (
        <div key={chat.id} className="border rounded-lg p-4 space-y-2">
          <p className="font-semibold">Prompt: {chat.prompt}</p>
          <img
            src={chat.imageUrl}
            alt={chat.prompt}
            className="w-full max-w-md rounded-lg"
          />
          {chat.description && (
            <p className="text-sm text-gray-600">{chat.description}</p>
          )}
          <p className="text-xs text-gray-400">
            {new Date(chat.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
