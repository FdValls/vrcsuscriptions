import { Input } from "@heroui/react";
import inputClasses from "./utils/styles/inputClasses";

export default function InputsGroup({ formData, handleInputChange, errors = {} }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Nombre y apellido <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            placeholder="Ingresá tu nombre y apellido"
            onChange={(e) => handleInputChange("name", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="Ingresá tu email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Celular <span className="text-red-500">*</span>
          </label>
          <Input
            type="Number"
            placeholder="Ingresá tu número de celular"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone}
            required
          />
        </div>
      </div>
    </>
  );
}
