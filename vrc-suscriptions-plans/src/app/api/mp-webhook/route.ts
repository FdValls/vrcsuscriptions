import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // MP manda distintos tipos de eventos, solo nos interesan estos dos
    if (
      type !== "subscription_preapproval" &&
      type !== "subscription_authorized_payment"
    ) {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = data?.id;
    if (!subscriptionId) {
      return NextResponse.json({ received: true });
    }

    // Consultamos el estado actual de la suscripción en MP
    const mpRes = await fetch(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TOKEN}`,
        },
      }
    );

    if (!mpRes.ok) {
      console.error("[mp-webhook] Error consultando MP:", mpRes.status);
      return NextResponse.json({ received: true });
    }

    const subscription = await mpRes.json();
    const status = subscription.status; // "authorized", "paused", "cancelled", "pending"

    // Actualizamos el status en Supabase buscando por el id de suscripción
    const { error } = await supabase
      .from("donantes")
      .update({ status })
      .eq("mp_subscription_id", subscriptionId);

    if (error) {
      console.error("[mp-webhook] Error actualizando Supabase:", error.message);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[mp-webhook] Error inesperado:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
