import { useState } from "react";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { useChatbot } from "../../hooks/useChatbot";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChatbot();

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col shadow-2xl"
          style={{
            width: "360px",
            height: "520px",
            borderRadius: "20px",
            animation: "chatPopup 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 rounded-t-[20px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">SportBooking AI</p>
                <p className="text-xs text-blue-100 leading-tight">Trợ lý thông minh</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Thu nhỏ"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Body: danh sách tin nhắn */}
          <div className="flex-1 overflow-hidden bg-white flex flex-col">
            <ChatMessageList messages={messages} isLoading={isLoading} />
          </div>

          {/* Footer: ô nhập */}
          <ChatInput isLoading={isLoading} onSend={sendMessage} />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
        title={isOpen ? "Đóng chat" : "Mở chat hỗ trợ"}
        style={{ boxShadow: "0 10px 25px -5px rgba(37,99,235,0.5)" }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Animation keyframes */}
      <style>{`
        @keyframes chatPopup {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
