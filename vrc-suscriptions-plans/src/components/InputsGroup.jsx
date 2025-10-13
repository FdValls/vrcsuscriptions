import { Input } from "@heroui/react";
import inputClasses from "./utils/styles/inputClasses";

export default function InputsGroup({
  formData,
  handleInputChange,
  errors = {},
}) {
  return (
    <>
      <div className="flex flex-col min-h-[5rem] mt-4 ">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Nombre y apellido <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.name}
          placeholder="Ingresá tu nombre y apellido"
          onChange={(e) => {
            handleInputChange("name", e.target.value);
          }}
          variant="bordered"
          classNames={inputClasses}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1 font-semibold">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col min-h-[5rem] mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          placeholder="Ingresá tu email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          variant="bordered"
          classNames={inputClasses}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1 font-semibold">
            {errors.email}
          </p>
        )}
      </div>

      {/* Teléfono y Cómo conociste */}
      <div className="flex flex-col min-h-[5rem] mt-4">
        <label className="text-sm font-medium text-gray-700 mb-2">
          Celular <span className="text-red-500">*</span>
        </label>
        <Input
          type="Number"
          placeholder="Ingresá tu número de celular"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          variant="bordered"
          classNames={inputClasses}
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1 font-semibold">
            {errors.phone}
          </p>
        )}
      </div>
    </>
  );
}
