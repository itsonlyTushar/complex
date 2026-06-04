export interface FoodCourtAdmin {
  id: number;
  name: string;
  email: string;
}

export interface FoodCourtItem {
  id: number;
  name: string;
  location: string | null;
  currancy: string;
  paymentSystem: string;
  admins: FoodCourtAdmin[];
}

export interface EditingFormState {
  id: number;
  foodCourtName: string;
  email: string;
  managementDetails: string;
  location: string;
  currancy: string;
  paymentSystem: string;
}
