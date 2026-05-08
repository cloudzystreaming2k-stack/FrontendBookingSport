import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface Props {
  isLoading: boolean;
  onSend: (text: string) => void;
}

export function ChatInput({ isLoading, onSend }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter gửi, Shift+Enter xuống dòng
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-3 flex items-end gap-2 bg-white rounded-b-2xl">
      <textarea
        className="flex-1 resize-none text-sm rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[40px] max-h-[120px]"
        rows={1}
        placeholder="Nhập câu hỏi của bạn..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        maxLength={500}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !value.trim()}
        className="w-9 h-9 flex-shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white flex items-center justify-center transition-colors"
        title="Gửi (Enter)"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
