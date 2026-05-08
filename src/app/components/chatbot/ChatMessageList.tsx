import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../hooks/useChatbot";

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {/* Avatar Bot */}
          {msg.role === "bot" && (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 self-end">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          )}

          {/* Bong bóng chat */}
          <div
            className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
