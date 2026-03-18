"use client";

import { useState } from "react";
import { infantilCategories, juvenilCategories } from "./utils/mocks/categories";
import React from "react";

export default function CategorySelector({ formData, setFormData, errors = {} }) {
  const [category, setCategory] = useState("infantil");

  const categories = category === "infantil" ? infantilCategories : juvenilCategories;

  const handleCategoryChange = () => {
    const newCategory = category === "infantil" ? "juvenil" : "infantil";
    setCategory(newCategory);
    // Reset the selected camada when switching categories
    setFormData((prev) => ({ ...prev, camada: "" }));
  };

  const handleCamadaChange = (e) => {
    setFormData((prev) => ({ ...prev, camada: e.target.value }));
  };

  return (
    <>
      {/* Switch para infantil/juvenil */}
      <div className="flex flex-col min-h-[6rem] mt-4">
        <label className="text-sm font-medium text-gray-700 mb-4">
          Categoría <span className="text-red-500">*</span>
        </label>
        
        <div className="flex items-center justify-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <span className={`text-sm font-semibold transition-colors ${category === "infantil" ? "text-green-600" : "text-gray-500"}`}>
            Infantil
          </span>
          
          {/* Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={category === "juvenil"}
              onChange={handleCategoryChange}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-600"></div>
          </label>
          
          <span className={`text-sm font-semibold transition-colors ${category === "juvenil" ? "text-green-600" : "text-gray-500"}`}>
            Juvenil
          </span>
        </div>

        {/* Dropdown para camada */}
        <label className="text-sm font-medium text-gray-700 mb-2">
          Seleccioná una camada <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus-within:border-green-500 transition-colors">
          <select
            required
            className="w-full bg-transparent outline-none text-black rounded-lg"
            value={formData.camada || ""}
            onChange={handleCamadaChange}
          >
            <option value="">Seleccioná una opción</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {errors?.camada && (
          <p className="text-sm text-red-600 mt-2 font-semibold">{errors.camada}</p>
        )}
      </div>
    </>
  );
}
