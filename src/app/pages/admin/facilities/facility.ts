export interface FacilityItem {
  _id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
}

export interface FacilityForm {
  name: string;
  icon: string;
  description: string;
}

export const defaultFacilityForm: FacilityForm = {
  name: "",
  icon: "🛜",
  description: "",
};
