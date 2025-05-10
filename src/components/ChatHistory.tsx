import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image"; // Import the Next.js Image component

type Chat = {
  id: string;
  prompt: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
};

type PaginationData = {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};

interface ChatHistoryProps {
  // Keeping the mode prop for future use
  mode: "text-to-image" | "image-to-text";
}

export default function ChatHistory({}: /* mode */ ChatHistoryProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const { userId, isLoaded, isSignedIn } = useAuth();
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchChats = useCallback(
    async (pageNum: number) => {
      if (!isLoaded || !isSignedIn || !userId) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await fetch(
          `/api/chats?clerkId=${userId}&page=${pageNum}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch chats");
        }

        if (pageNum === 1) {
          setChats(data.chats);
        } else {
          setChats((prev) => [...prev, ...data.chats]);
        }
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load chat history"
        );
        // Reset pagination on error to prevent infinite loading attempts
        if (pageNum > 1) {
          setPagination((prev) => (prev ? { ...prev, hasMore: false } : null));
        }
      } finally {
        setLoading(false);
      }
    },
    [userId, isLoaded, isSignedIn]
  );

  useEffect(() => {
    fetchChats(1);
  }, [fetchChats]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && pagination?.hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchChats(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [pagination?.hasMore, loading, fetchChats]);

  if (!isSignedIn) {
    return (
      <div className="p-4 text-white">Please sign in to view chat history.</div>
    );
  }

  if (loading && page === 1) {
    return <div className="p-4 text-white">Loading chat history...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-white space-y-2">
        <p className="text-red-400">Error loading chat history:</p>
        <p>{error}</p>
        <button
          onClick={() => fetchChats(1)}
          className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-white">No previous conversations found.</div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4 text-white">
        Previous Conversations
      </h2>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="border border-white/20 rounded-lg p-4 space-y-2 bg-white/10"
        >
          <p className="font-semibold text-white">Prompt: {chat.prompt}</p>
          <Image
            src={chat.imageUrl}
            alt={chat.prompt}
            className="w-full max-w-md rounded-lg"
            width={500} // Specify a width for the image
            height={300} // Specify a height for the image
          />
          {chat.description && (
            <p className="text-sm text-white/80">{chat.description}</p>
          )}
          <p className="text-xs text-white/60">
            {new Date(chat.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}

      {pagination?.hasMore && (
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center"
        >
          {loading && <div className="text-white">Loading more...</div>}
        </div>
      )}
    </div>
  );
}
