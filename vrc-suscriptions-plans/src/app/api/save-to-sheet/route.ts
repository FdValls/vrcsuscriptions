import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic"; // 👈 evita cache en Next.js

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificar variables individuales
    const requiredVars = {
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    };

    console.log("Body completo recibido:", JSON.stringify(body, null, 2));

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Faltan variables de entorno: ${missingVars.join(", ")}`);
    }

    // Construir las credenciales manualmente
    const credentials = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Obtener información de la hoja para conocer el nombre exacto
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const firstSheetName =
      spreadsheetInfo.data.sheets?.[0]?.properties?.title || "Sheet1";

    const { data } = body;

    // Asegurarnos de que data existe y no está vacío
    if (!data || typeof data !== "object") {
      throw new Error("No se recibió data válida en el body");
    }

    // Agregar timestamp para hacer cada fila única y verificar que se están enviando datos nuevos
    const dataWithTimestamp = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    const values = Object.values(dataWithTimestamp);

    // Enviar a Google Sheets
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${firstSheetName}!A2`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });

    return NextResponse.json({
      message: "Datos guardados en Google Sheets",
      rowsAdded: result.data.updates?.updatedRows || 0,
      range: result.data.updates?.updatedRange || "unknown",
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error al guardar en Google Sheets:", error);
    return NextResponse.json(
      {
        error: "Error al guardar en Google Sheets",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
