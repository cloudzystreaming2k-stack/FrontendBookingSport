import { Sun, Sunset, Moon } from "lucide-react";

export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // T2 -> CN

export const TIME_OPTIONS: string[] = [
  "06:00","06:30","07:00","07:30","08:00","08:30",
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30","20:00","20:30",
  "21:00","21:30","22:00","22:30","23:00"
];

export const TIME_BLOCKS = [
  { id: "morning",   label: "Buổi Sáng", range: "06:00 – 12:00", icon: Sun,    color: "amber",  slotStart: "06:00", slotEnd: "12:00" },
  { id: "afternoon", label: "Buổi Chiều",range: "12:00 – 18:00", icon: Sunset, color: "sky",    slotStart: "12:00", slotEnd: "18:00" },
  { id: "evening",   label: "Buổi Tối",  range: "18:00 – 23:00", icon: Moon,   color: "violet", slotStart: "18:00", slotEnd: "23:00" },
];
