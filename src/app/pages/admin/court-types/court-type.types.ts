// ─── Types ────────────────────────────────────────────────────────
export interface CourtTypeItem {
  _id: string;
  name: string;
  icon: string;
  color: string;
  minPlayers: number;
  maxPlayers: number;
  courtCount: number;
  createdAt: string;
}

export interface CourtTypeForm {
  name: string;
  icon: string;
  color: string;
  minPlayers: number;
  maxPlayers: number;
}

// ─── Constants ────────────────────────────────────────────────────
export const defaultForm: CourtTypeForm = {
  name: "",
  icon: "🏓",
  color: "#3b82f6",
  minPlayers: 2,
  maxPlayers: 4,
};
