import ChatHistory from "./ChatHistory";

interface ChatSidebarProps {
  mode: string;
  onNewChat: () => void;
  onToggleHistory: () => void;
  showHistory: boolean;
}

export default function ChatSidebar({
  mode,
  onNewChat,
  onToggleHistory,
  showHistory,
}: ChatSidebarProps) {
  return (
    <div className="w-72 bg-white/10 backdrop-blur-sm border-r border-white/20 flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white/5 backdrop-blur-sm p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold mb-2 text-white">
          {mode === "text-to-image" ? "Text to Image" : "Image to Text"}
        </h2>
        <div className="space-y-2">
          <button
            className="w-full bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700 transition-colors"
            onClick={onNewChat}
          >
            New Chat
          </button>
          <button
            className={`w-full text-white border border-white/20 rounded-lg py-2 px-4 transition-colors ${
              showHistory ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
            }`}
            onClick={onToggleHistory}
          >
            View History
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="flex-1 overflow-y-auto p-4">
          <ChatHistory mode={mode} />
        </div>
      )}
    </div>
  );
}
