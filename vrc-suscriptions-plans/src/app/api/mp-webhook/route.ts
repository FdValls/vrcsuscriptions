import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function validateSignature(req: Request, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return false;

  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id");

  if (!xSignature) return false;

  // Extraer ts y v1 del header x-signature
  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => p.split("=") as [string, string])
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];

  if (!ts || !v1) return false;

  // Construir el manifest según la doc de MP
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hash = createHmac("sha256", secret).update(manifest).digest("hex");

  return hash === v1;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { type, data } = body;

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
    const status = subscription.status;

    const { error } = await supabase
      .from("donantes")
      .update({ status })
      .eq("mp_subscription_id", subscriptionId);

    if (error) {
      console.error("[mp-webhook] Error actualizando Supabase:", error.message);
    } else {
      console.log(`[mp-webhook] Suscripción ${subscriptionId} → ${status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[mp-webhook] Error inesperado:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
