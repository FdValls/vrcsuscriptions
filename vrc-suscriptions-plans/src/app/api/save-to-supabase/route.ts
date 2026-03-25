import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "No se recibió data válida en el body" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("donantes").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      who_told_you: data.whoToldYou,
      amount: Number(data.monto),
      mp_subscription_id: data.id_suscription,
    });

    if (error) {
      console.error("[SaveToSupabase] Error:", error);
      return NextResponse.json(
        { error: "Error al guardar en la base de datos", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Donante guardado correctamente" });
  } catch (error) {
    console.error("[SaveToSupabase] Error inesperado:", error);
    return NextResponse.json(
      { error: "Error inesperado", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
