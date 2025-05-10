interface ChatSidebarProps {
  mode: string;
  onNewChat: () => void;
}

export default function ChatSidebar({ mode, onNewChat }: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-2 text-black">
          {mode === "text-to-image" ? "Text to Image" : "Image to Text"}
        </h2>
        <button
          className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          onClick={onNewChat}
        >
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <div className="p-3 rounded-lg hover:bg-gray-200 cursor-pointer text-black">
            Previous chat 1
          </div>
          <div className="p-3 rounded-lg hover:bg-gray-200 cursor-pointer text-black">
            Previous chat 2
          </div>
        </div>
      </div>
    </div>
  );
}
