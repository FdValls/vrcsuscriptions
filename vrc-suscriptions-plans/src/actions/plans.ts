"use server";

import { mpToken, planURL } from "@/config/data";
import { SuscriptionRequestBody } from "@/interfaces/PlanRequestBody";

export const createSuscription = async (
    body: {
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
): Promise<SuscriptionRequestBody> => {
    const url = `${planURL}`;
    const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mpToken}`,
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(body), // ✅ stringify
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorBody = await response.text();
                if (errorBody) {
                    errorMessage += ` - ${errorBody}`;
                }
            } catch {
                // ignore error parsing error body
            }
            console.error(`[ErrorCreatePlan] ${errorMessage}`);
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("[CreatePlanService] Error creating plan:", error);
        throw error;
    }
};
