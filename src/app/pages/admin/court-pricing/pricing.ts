export interface TimeSlot {
  startTime: string;
  endTime: string;
  price: number;
}

export interface DayPricing {
  day: string;       // "monday" | "tuesday" | ...
  dayLabel: string;
  dayOfWeek: number; // 0=CN, 1=T2, ..., 6=T7
  timeSlots: TimeSlot[];
}

export interface BatchPricingSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  price: number;
}
