// ── Shared types for CourtDetail module ──────────────────────────────────────

export interface ApiCourt {
  _id: string;
  name: string;
  code?: string;
  address: string;
  description?: string;
  images: string[];
  mainImage?: string;
  pricing: { morning: number; afternoon: number; evening: number };
  typeId?: { _id: string; name: string; icon: string; color: string };
  facilities?: { _id: string; name: string; icon: string }[];
  latitude?: number;
  longitude?: number;
  openTime?: string;
  closeTime?: string;
  rating?: number;
  reviewCount?: number;
  capacity?: number;
  status?: string;
  province?: { code: number; name: string };
  district?: { code: number; name: string };
}

export interface ApiSlot {
  time: string;
  endTime: string;
  price: number;
  status: 'available' | 'booked';
}

export interface SlotGroup {
  startTime: string;
  endTime: string;
  price: number;
}
