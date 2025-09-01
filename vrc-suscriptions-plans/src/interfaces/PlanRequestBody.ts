export interface PlanRequestBody {
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: "days" | "months"; // según docs de MP
    repetitions: number;
    billing_day: number;
    billing_day_proportional: boolean;
    free_trial?: {
      frequency: number;
      frequency_type: "days" | "months";
    };
    transaction_amount: number;
    currency_id: string;
  };
  payment_methods_allowed: {
    payment_types: { id: string }[];
    payment_methods: { id: string }[];
  };
  back_url: string;
}
