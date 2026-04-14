import { Input } from "@heroui/react";
import inputClasses from "./utils/styles/inputClasses";

/**
 * Renderiza un grupo de campos de persona (nombre, DNI, fecha nac, dirección, teléfono).
 * @param {string} prefix  - prefijo de clave en formData: "jugador" | "padre"
 * @param {string} title   - título de la sección
 */
export default function PersonFields({ prefix, title, formData, handleInputChange, errors }) {
  const field = (name) => `${prefix}${name}`;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Nombre y apellido <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData[field("Nombre")] || ""}
            placeholder="Ingresá nombre y apellido"
            onChange={(e) => handleInputChange(field("Nombre"), e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isInvalid={!!errors?.[field("Nombre")]}
            errorMessage={errors?.[field("Nombre")]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              DNI <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData[field("Dni")] || ""}
              placeholder="Ej: 12345678"
              onChange={(e) => handleInputChange(field("Dni"), e.target.value)}
              variant="bordered"
              classNames={inputClasses}
              isInvalid={!!errors?.[field("Dni")]}
              errorMessage={errors?.[field("Dni")]}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Fecha de nacimiento <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData[field("FechaNac")] || ""}
              onChange={(e) => handleInputChange(field("FechaNac"), e.target.value)}
              variant="bordered"
              classNames={inputClasses}
              isInvalid={!!errors?.[field("FechaNac")]}
              errorMessage={errors?.[field("FechaNac")]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Dirección <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData[field("Direccion")] || ""}
            placeholder="Calle, número, ciudad"
            onChange={(e) => handleInputChange(field("Direccion"), e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isInvalid={!!errors?.[field("Direccion")]}
            errorMessage={errors?.[field("Direccion")]}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            value={formData[field("Telefono")] || ""}
            placeholder="Ingresá el número de teléfono"
            onChange={(e) => handleInputChange(field("Telefono"), e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isInvalid={!!errors?.[field("Telefono")]}
            errorMessage={errors?.[field("Telefono")]}
          />
        </div>
      </div>
    </div>
  );
}
