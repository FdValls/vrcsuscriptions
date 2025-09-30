// src/app/api/create-suscription/route.ts
import { NextResponse } from "next/server";
import { mpToken, planURL } from "@/config/data";
import { SuscriptionRequestBody } from "@/interfaces/SuscriptionRequestBody";
import { SuscriptionResponse } from "@/interfaces/SuscriptionResponse";

export async function POST(req: Request) {
  const body: SuscriptionRequestBody = await req.json();

  try {
    const url = `${planURL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mpToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.text();
        if (errorBody) {
          errorMessage += ` - ${errorBody}`;
        }
      } catch {
        // ignore parse errors
      }
      console.error(`[ErrorCreatePlan] ${errorMessage}`);
      // return NextResponse.json({ error: errorMessage }, { status: response.status });
      return NextResponse.json(
        { error: "Error creando suscripción revise los datos ingresados" },
        { status: 404 }
      );
    }

    const data: SuscriptionResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[CreatePlanService] Error creating plan:", error);
    return NextResponse.json(
      { error: "Error creando suscripción" },
      { status: 500 }
    );
  }
}
