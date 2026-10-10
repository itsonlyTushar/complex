export interface FoodCourtAdmin {
  id: number;
  name: string;
  email: string;
}

export interface FoodCourtItem {
  id: string;
  name: string;
  location: string | null;
  currancy: string;
  paymentSystem: string;
  admins: FoodCourtAdmin[];
}

export interface EditingFormState {
  id: string;
  foodCourtName: string;
  email: string;
  managementDetails: string;
  location: string;
  currancy: string;
  paymentSystem: string;
}

export interface RestaurantCommission {
  id: string;
  name: string;
  stripeAccountId: string | null;
  onBoradingCompleted: boolean;
  razorpayKeyId: string | null;
  commissionRate: number;
  foodCourt: {
    name: string;
    paymentSystem: string;
  };
}
