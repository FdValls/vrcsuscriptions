import { z } from "zod";
import options from "../mocks/options";

const WhoToldYouEnum = z.enum(options.map((o) => String(o)) as [string, ...string[]]);

const JugadoresFormSchema = z
  .object({
    // Camada
    camada: z.string().min(1, "Seleccioná una camada"),
    categoryType: z
      .enum(["infantil", "juvenil", "plantel"])
      .nullable()
      .refine((v) => v !== null, { message: "Seleccioná una camada" }),
    // ¿Quién te contó?
    whoToldYou: z.union([WhoToldYouEnum, z.literal("")]),
    whoToldYouCustom: z.string().optional(),
    // Monto
    selectedAmount: z.string(),
    customAmount: z.string().optional(),
    // Jugador
    jugadorNombre: z.string().min(1, "Ingresá nombre y apellido"),
    jugadorEmail: z.string().optional(),
    jugadorDni: z
      .string()
      .min(1, "Ingresá el DNI")
      .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
    jugadorFechaNac: z.string().min(1, "Ingresá la fecha de nacimiento"),
    jugadorDireccion: z.string().min(1, "Ingresá la dirección"),
    jugadorTelefono: z
      .string()
      .min(7, "Ingresá un teléfono válido")
      .regex(/^\d+$/, "El teléfono solo puede contener números"),
    // Padre (opcional a nivel base, validado condicionalmente)
    padreNombre: z.string().optional(),
    padreEmail: z.string().optional(),
    padreDni: z.string().optional(),
    padreFechaNac: z.string().optional(),
    padreDireccion: z.string().optional(),
    padreTelefono: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.whoToldYou) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Por favor, seleccioná una opción",
        path: ["whoToldYou"],
      });
    }
    if (data.whoToldYou === "Otro" && !data.whoToldYouCustom?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Por favor, ingresá quién te contó de VRC",
        path: ["whoToldYouCustom"],
      });
    }
    if (!data.selectedAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccioná un monto para continuar",
        path: ["selectedAmount"],
      });
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
    // Jugador plantel: email requerido (el jugador es el pagador)
    if (data.categoryType === "plantel") {
      if (!data.jugadorEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.jugadorEmail)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ingresá un email válido", path: ["jugadorEmail"] });
      }
    }
    // Padre requerido para infantil y juvenil
    if (data.categoryType === "infantil" || data.categoryType === "juvenil") {
      if (!data.padreNombre?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ingresá nombre y apellido", path: ["padreNombre"] });
      if (!data.padreEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.padreEmail))
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ingresá un email válido", path: ["padreEmail"] });
      if (!data.padreDni?.trim() || !/^\d{7,8}$/.test(data.padreDni))
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El DNI debe tener 7 u 8 dígitos", path: ["padreDni"] });
      if (!data.padreFechaNac?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ingresá la fecha de nacimiento", path: ["padreFechaNac"] });
      if (!data.padreDireccion?.trim())
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ingresá la dirección", path: ["padreDireccion"] });
      if (!data.padreTelefono?.trim() || data.padreTelefono.trim().length < 7 || !/^\d+$/.test(data.padreTelefono))
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ingresá un teléfono válido", path: ["padreTelefono"] });
    }
  });

export function validateJugadoresForm(
  payload: unknown
): { valid: boolean; errors: Record<string, string> } {
  const result = JugadoresFormSchema.safeParse(payload);
  if (result.success) return { valid: true, errors: {} };

  const errors: Record<string, string> = {};
  result.error.issues.forEach((e) => {
    const key = String(e.path?.[0] ?? "form");
    if (!errors[key]) errors[key] = e.message;
  });

  return { valid: false, errors };
}
