export interface SuscriptionRequestBody {
  reason: string;
  external_reference: string;
  payer_email: string;
  auto_recurring: {
    frequency: number;
    frequency_type: string;
    start_date: string;
    end_date: string;
    transaction_amount: number;
    currency_id: string;
  };
  back_url: string;
}
