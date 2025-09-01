"use server";

import { mpToken, planA, planB, planC, planURL } from "@/config/data";
import { PlanRequestBody } from "@/interfaces/PlanRequestBody";


export const getPlanById = async (planId: string): Promise<unknown> => {

    const url = `${planURL}/${planId}`;
    const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mpToken}`,
    };

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: requestHeaders,
        })
            .then(async (response) => {
                if (!response.ok) {
                    // Get more detailed error information
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    try {
                        const errorBody = await response.text();
                        if (errorBody) {
                            errorMessage += ` - ${errorBody}`;
                        }
                    } catch (e) {
                        // Ignore error parsing error body
                    }

                    console.error(`[ErrorGetPlan] ${errorMessage}`);
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                resolve(data);
            })
            .catch((error) => {
                console.error("[UserInfoService] Error fetching user info:", error);
                reject(error);
            });
    });
};
export const createPlanWithFreeAmount = async (
    body: PlanRequestBody,
): Promise<unknown> => {
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


export async function getPlanByIdWithPlanA() {
    if (!planA) {
        throw new Error("Plan A no está configurado");
    }
    return await getPlanById(planA);
}
export async function getPlanByIdWithPlanB() {
    if (!planB) {
        throw new Error("Plan A no está configurado");
    }
    return await getPlanById(planB);
}
export async function getPlanByIdWithPlanC() {
    if (!planC) {
        throw new Error("Plan A no está configurado");
    }
    return await getPlanById(planC);
}
export async function createPlan(body: PlanRequestBody) {
    return await createPlanWithFreeAmount(body);
}