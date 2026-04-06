export interface Court {
  _id: string;
  name: string;
  typeId?: { _id: string; name: string } | string;
}

export interface CourtType {
  _id: string;
  name: string;
  icon?: string;
}
