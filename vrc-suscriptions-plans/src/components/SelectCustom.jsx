import { Input } from "@heroui/react";
import options from "./utils/mocks/options";
import inputClasses from "./utils/styles/inputClasses";

export default function SelectCustom({
  formData,
  setFormData,
  handleChange,
  whoToldYouCustom,
  errors = {},
  setErrors,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        ¿Quién te contó de VRC? <span className="text-red-500">*</span>
      </label>
      <div
        className={`border-2 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus-within:border-green-500 transition-colors ${
          errors.whoToldYou ? "border-red-400" : "border-gray-300"
        }`}
      >
        <select
          required
          className="w-full bg-transparent outline-none text-black rounded-lg"
          value={formData.whoToldYou}
          onChange={(e) => {
            handleChange(e);
            setErrors?.((prev) => { const c = { ...prev }; delete c.whoToldYou; return c; });
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
      {errors.whoToldYou && (
        <p className="text-sm text-red-500 mt-1">{errors.whoToldYou}</p>
      )}

      {formData.whoToldYou === "Otro" && (
        <div className="mt-2 w-full flex flex-col">
          <Input
            type="text"
            placeholder="Ingresá el contacto que te contó sobre VRC"
            value={whoToldYouCustom}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, whoToldYouCustom: e.target.value }));
              setErrors?.((prev) => { const c = { ...prev }; delete c.whoToldYouCustom; return c; });
            }}
            variant="bordered"
            size="lg"
            className="w-full text-center"
            classNames={inputClasses}
            isInvalid={!!errors.whoToldYouCustom}
            errorMessage={errors.whoToldYouCustom}
            required
          />
        </div>
      )}
    </div>
  );
}
