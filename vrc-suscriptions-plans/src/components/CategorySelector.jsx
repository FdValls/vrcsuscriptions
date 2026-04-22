"use client";

import { useState } from "react";
import { yearCategories, calculateAge, getCategoryType } from "./utils/mocks/categories";

export default function CategorySelector({
  setFormData,
  onCategoryChange,
  errors = {},
}) {
  const [selectedYear, setSelectedYear] = useState("");
  const [categoryType, setCategoryType] = useState(null);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year) {
      const age = calculateAge(parseInt(year));
      const category = getCategoryType(age);
      setCategoryType(category);
      setFormData((prev) => ({ ...prev, camada: year }));
      onCategoryChange?.(category);
    } else {
      setCategoryType(null);
      setFormData((prev) => ({ ...prev, camada: "" }));
      onCategoryChange?.(null);
    }
  };

  const categoryLabel = {
    infantil: { label: "Infantil", color: "text-green-600" },
    juvenil: { label: "Juvenil", color: "text-yellow-600" },
    plantel: { label: "Plantel", color: "text-blue-600" },
  };

  return (
    <div className="flex flex-col mt-4">
      <label className="text-sm font-medium text-gray-700 mb-2">
        Camada <span className="text-red-500">*</span>
      </label>
      <div
        className={`border-2 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus-within:border-green-500 transition-colors mb-2 ${
          errors?.camada ? "border-red-400" : "border-gray-300"
        }`}
      >
        <select
          required
          className="w-full bg-transparent outline-none text-black rounded-lg"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Seleccioná un año</option>
          {yearCategories.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {errors?.camada && (
        <p className="text-sm text-red-600 font-semibold">{errors.camada}</p>
      )}

      {selectedYear && categoryType && (
        <p className="text-sm font-semibold text-gray-700 mt-1">
          Categoría:{" "}
          <span className={`capitalize ${categoryLabel[categoryType]?.color}`}>
            {categoryLabel[categoryType]?.label}
          </span>
        </p>
      )}
    </div>
  );
}
