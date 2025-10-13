import { Input } from "@heroui/react";
import options from "./utils/mocks/options";
import inputClasses from "./utils/styles/inputClasses";
import { validateWhoToldYou } from "./utils/validation/whoToldYouSchema";
import React from "react";

export default function SelectCustom({
  formData,
  setFormData,
  handleChange,
  whoToldYouCustom,
  errors = {},
  setErrors,
}) {
  return (
    <>
      {/* Select de quién te contó */}
      <div className="flex flex-col min-h-[5rem] mt-4">
        <label className="text-sm font-medium text-gray-700">
          ¿Quién te contó de VRC? <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus-within:border-green-500 transition-colors">
          <select
            required
            className="w-full bg-transparent outline-none text-black rounded-lg"
            value={formData.whoToldYou}
            onChange={(e) => {
              const val = e.target.value;

              // use the small Zod helper to get a friendly message for empty selection
              const { valid, error: msg } = validateWhoToldYou({
                whoToldYou: val,
                whoToldYouCustom: formData.whoToldYouCustom,
              });

              if (!valid) {
                // set error on the central errors object
                setErrors((prev) => ({ ...prev, whoToldYou: msg }));
                return;
              }

              // clear whoToldYou error and propagate change
              setErrors((prev) => {
                const copy = { ...(prev || {}) };
                delete copy.whoToldYou;
                return copy;
              });
              handleChange(e);
            }}
          >
            <option value="">Seleccioná una opción</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {formData.whoToldYou === "Otro" && (
          <div className="mt-4 w-full flex flex-col items-center">
            <Input
              type="text"
              placeholder="Ingresá el contacto que te contó sobre VRC"
              value={whoToldYouCustom}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, whoToldYouCustom: e.target.value }))
              }
              variant="bordered"
              size="lg"
              className="w-full text-center"
              classNames={inputClasses}
              required
            />
            {errors?.whoToldYouCustom && (
              <p className="text-sm text-red-600 mt-1 font-semibold">
                {errors.whoToldYouCustom}
              </p>
            )}
          </div>
        )}
        {errors?.whoToldYou && (
          <p className="text-sm text-red-600 mt-2 font-semibold">{errors.whoToldYou}</p>
        )}
      </div>
    </>
  );
}
