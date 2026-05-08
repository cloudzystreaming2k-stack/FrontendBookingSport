import { useState, useRef, useCallback } from "react";
import api from "../lib/api";

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Xin chào! Tôi là trợ lý AI của SportBooking 👋\nTôi có thể giúp bạn tìm sân, hướng dẫn đặt sân, giải đáp thắc mắc về thanh toán và nhiều hơn nữa. Bạn cần hỗ trợ gì?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Thêm tin nhắn user ngay lập tức
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setIsLoading(true);

    try {
      abortRef.current = new AbortController();
      const res = await api.post(
        "/chatbot/message",
        { message: trimmed },
        { signal: abortRef.current.signal }
      );
      const reply = res.data?.reply || "Xin lỗi, tôi không nhận được phản hồi.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err: any) {
      if (err?.code === "ERR_CANCELED") return; // Bị cancel, bỏ qua
      const errMsg =
        err?.response?.data?.message || "Chatbot đang bận, vui lòng thử lại sau nhé!";
      setMessages((prev) => [...prev, { role: "bot", text: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { messages, isLoading, sendMessage };
}
