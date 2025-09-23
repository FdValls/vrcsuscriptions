export interface SuscriptionResponse {
    id: string;
    payer_id: number;
    payer_email: string;
    back_url: string;
    collector_id: number;
    application_id: number;
    status: string;
    reason: string;
    external_reference: string;
    date_created: string;
    last_modified: string;
    init_point: string;
    auto_recurring: {
        frequency: number;
        frequency_type: string;
        transaction_amount: number;
        currency_id: string;
        start_date: string;
        end_date: string;
        free_trial: null;
    };
    summarized: {
        quotas: number;
        charged_quantity: number | null;
        pending_charge_quantity: number;
        charged_amount: number | null;
        pending_charge_amount: number;
        semaphore: unknown | null;
        last_charged_date: string | null;
        last_charged_amount: number | null;
    };
    next_payment_date: string;
    payment_method_id: string | null;
    payment_method_id_secondary: string | null;
    first_invoice_offset: number | null;
    subscription_id: string;
    owner: unknown | null;
}