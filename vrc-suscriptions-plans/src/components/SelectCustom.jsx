import { Input } from "@heroui/react";
import options from "./utils/mocks/options";
import inputClasses from "./utils/styles/inputClasses";

export default function SelectCustom({
  formData,
  setFormData,
  handleChange,
  whoToldYouCustom,
}) {
  return (
    <>
      {/* Select de quién te contó */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          ¿Quién te contó de VRC? <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus-within:border-green-500 transition-colors">
          <select
            required
            className="w-full bg-transparent outline-none text-black rounded-lg"
            value={formData.whoToldYou}
            onChange={handleChange}
          >
            <option>Seleccioná una opción</option>
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
                setFormData((prev) => ({
                  ...prev,
                  whoToldYouCustom: e.target.value,
                }))
              }
              variant="bordered"
              size="lg"
              className="w-full text-center"
              classNames={inputClasses}
              required
            />
          </div>
        )}
      </div>
    </>
  );
}
