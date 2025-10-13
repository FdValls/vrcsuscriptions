import { z } from "zod";
import options from "../mocks/options";

const WhoToldYouEnum = z.enum(options.map((o) => String(o)) as [string, ...string[]]);

const FormSchema = z
  .object({
    name: z.string().min(1, "Ingresá tu nombre y apellido"),
    email: z.string().email("Ingresá un email válido"),
    phone: z
      .string()
      .min(7, "Ingresá un número de celular válido")
      .regex(/^[0-9()+\-\s]+$/, "El teléfono sólo puede contener números y símbolos válidos"),
  whoToldYou: z.union([WhoToldYouEnum, z.literal("")]),
    whoToldYouCustom: z.string().optional(),
    selectedAmount: z.string(),
    customAmount: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If the user didn't choose a whoToldYou option, add a friendly issue
    if (!data.whoToldYou || data.whoToldYou === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Por favor, seleccioná una opción",
        path: ["whoToldYou"],
      });
    }

    if (data.whoToldYou === "Otro") {
      if (!data.whoToldYouCustom || data.whoToldYouCustom.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Por favor, ingresá quién te contó de VRC",
          path: ["whoToldYouCustom"],
        });
      }
    }

    if (data.selectedAmount === "custom") {
      const amount = Number(data.customAmount);
      if (!data.customAmount || isNaN(amount) || amount <= 14999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El monto libre debe ser mayor a $15.000",
          path: ["customAmount"],
        });
      }
    }
  });

export function validateForm(payload: unknown) {
  const result = FormSchema.safeParse(payload);
  if (result.success) return { valid: true, errors: {} };

  const errors: Record<string, string> = {};
  result.error.errors.forEach((e) => {
    const key = e.path?.[0] || "form";
    if (!errors[key]) errors[key] = e.message;
  });

  return { valid: false, errors };
}

export default FormSchema;
