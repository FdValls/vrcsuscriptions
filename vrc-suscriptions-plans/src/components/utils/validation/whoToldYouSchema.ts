import { z } from "zod";
import options from "../mocks/options";

// Create a Zod enum from the options array (only string literals allowed)
// We filter out the placeholder text if accidentally passed.
const optionValues = options.map((o) => String(o));

export const WhoToldYouEnum = z.enum(optionValues as [string, ...string[]]);

export const whoToldYouSchema = z.object({
  whoToldYou: WhoToldYouEnum,
  whoToldYouCustom: z.string().optional(),
});

export type WhoToldYou = z.infer<typeof whoToldYouSchema>;

// helper validate function that returns { valid, error }
export function validateWhoToldYou(payload: unknown) {
  // If payload is an object and whoToldYou is an empty string, return a friendly message
  try {
    // quick guard for empty selection
    if (typeof payload === "object" && payload !== null && (payload as any).whoToldYou === "") {
      return { valid: false, error: "Por favor, seleccioná una opción" };
    }

    const result = whoToldYouSchema.safeParse(payload);
    if (result.success) return { valid: true, error: null };

    // Build a readable message from zod errors
    const message = result.error.errors
      .map((e) => e.message)
      .filter(Boolean)
      .join(". ") || "Seleccion inválida";

    return { valid: false, error: message };
  } catch {
    return { valid: false, error: "Selección inválida" };
  }
}

export default whoToldYouSchema;
