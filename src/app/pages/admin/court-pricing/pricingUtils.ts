export function formatK(price: number) { 
  return `${Math.round(price / 1000)}k`; 
}

export function formatVND(price: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

export function getPriceLevel(price: number): "low" | "mid" | "peak" | "super" {
  if (price >= 200000) return "super";
  if (price >= 180000) return "peak";
  if (price >= 150000) return "mid";
  return "low";
}

export const priceLevelStyle: Record<string, string> = {
  low:   "bg-teal-50   text-teal-700   border-teal-200   hover:bg-teal-100",
  mid:   "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100",
  peak:  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  super: "bg-red-50    text-red-700    border-red-200    hover:bg-red-100",
};
