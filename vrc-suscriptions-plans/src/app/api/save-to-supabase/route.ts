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

    const isJugador = data.origen === "jugador";
    const isMinor = data.categoria === "infantil" || data.categoria === "juvenil";

    // Campos base: quién paga depende del origen y la categoría
    const record: Record<string, unknown> = {
      name:          isJugador ? (isMinor ? data.padreNombre    : data.jugadorNombre)   : data.name,
      email:         isJugador ? (isMinor ? data.padreEmail     : data.jugadorEmail)    : data.email,
      phone:         isJugador ? (isMinor ? data.padreTelefono  : data.jugadorTelefono) : data.phone,
      who_told_you:  data.whoToldYou,
      amount:        Number(data.monto),
      mp_subscription_id: data.id_suscription,
      origen:        isJugador ? "jugador" : "donante",
    };

    // Campos exclusivos del form de jugadores
    if (isJugador) {
      const jugadorFields: Record<string, string> = {
        camada:           "camada",
        categoria:        "categoria",
        jugadorNombre:    "jugador_nombre",
        jugadorEmail:     "jugador_email",
        jugadorDni:       "jugador_dni",
        jugadorFechaNac:  "jugador_fecha_nac",
        jugadorDireccion: "jugador_direccion",
        jugadorTelefono:  "jugador_telefono",
        padreNombre:      "padre_nombre",
        padreEmail:       "padre_email",
        padreDni:         "padre_dni",
        padreFechaNac:    "padre_fecha_nac",
        padreDireccion:   "padre_direccion",
        padreTelefono:    "padre_telefono",
      };

      for (const [dataKey, dbCol] of Object.entries(jugadorFields)) {
        if (data[dataKey]) record[dbCol] = data[dataKey];
      }
    }

    const { error } = await supabase.from("donantes").insert(record);

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
