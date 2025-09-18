"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  RadioGroup,
  Radio,
  Button,
} from "@heroui/react";
import { PlanRequestBody } from "@/interfaces/PlanRequestBody";

const options = [
  "General",
  "Carlos Ramallo",
  "Jorge Dartiguelongue",
  "Marcos Julaines",
  "Maria Passano",
  "Peta Caride",
  "Otro",
];

export default function SubscriptionForm() {
  const [selectedAmount, setSelectedAmount] = useState("20000");
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "Fernando",
    email: "fernandodanielvals@gmail.com",
    phone: "1123029425",
    howDidYouKnow: "evento",
    whoToldYou: "Carlos Ramallo",
  });

  const [value, setValue] = React.useState("");

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(e.target.value);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  // Definir las fechas dinámicamente
  const startDate = new Date();
  const endDate = addMonths(startDate, 12); // por ejemplo, 12 meses

  // Formatear fechas en formato ISO string si es necesario
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const getId = () =>
      new Promise<string>((resolve) => {
        setTimeout(() => resolve("mocked-id-12345"), 500);
      });

    // Validación de monto libre
    if (selectedAmount === "custom") {
      const amount = Number(customAmount);
      if (isNaN(amount) || amount < 15001) {
        alert("El monto libre debe ser mayor a $15.000");
        return;
      }
    }

    const mockCustomPlanBody = {
      reason: "VRC Suscripción Mensual",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        start_date: startDateISO,
        end_date: endDateISO,
        repetitions: 12,
        billing_day: startDate.getDate(), // día del mes
        billing_day_proportional: false,
        free_trial: {
          frequency: 1,
          frequency_type: "months",
        },
        transaction_amount:
          selectedAmount === "custom"
            ? Number(customAmount)
            : Number(selectedAmount), // usa lo que venga del form o fallback
        currency_id: "ARS",
      },
      payment_methods_allowed: {
        payment_types: [{ id: "credit_card" }],
        payment_methods: [{ id: "bolbradesco" }],
      },
      back_url: "https://www.yoursite.com",
    } as PlanRequestBody;

    const formValues = {
      ...formData,
      whoToldYou: value,
      selectedAmount:
        selectedAmount === "custom"
          ? Number(customAmount)
          : Number(selectedAmount)
    };

    // Espera el id de la promesa
    const id = await getId();

    // Crea el objeto final
    const submissionObject = {
      ...formValues,
      id,
    };

    console.log("Objeto final:", submissionObject);
  };

  const inputClasses = {
    input: "bg-white text-black border-gray-300 focus:border-green-500",
    inputWrapper:
      "bg-white border-gray-300 hover:border-gray-400 focus-within:border-green-500",
    label: "text-gray-700 font-medium",
  };

  return (
    <Card className="flex flex-col w-full max-w-3xl mx-auto bg-white shadow-lg border my-4 border-gray-200">
      <CardHeader className="pb-6 pt-8 px-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Quiero ser socio y contribuir mensualmente
        </h2>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-6 px-8 pb-8">
        {/* Nombre y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre y apellido"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            required
          />
        </div>

        {/* Teléfono y Cómo conociste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
          />

          <Input
            label="¿Cómo conociste VRC?"
            value={formData.howDidYouKnow}
            onChange={(e) => handleInputChange("howDidYouKnow", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
          />
        </div>

        <div className="select-wrapper">
          <label className="question-label">¿Quién te contó de VRC?</label>
          <div className="select-container">
            <select
              className="custom-select"
              value={value}
              onChange={handleChange}
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Selección de monto */}
        <div className="space-y-4 ">
          <h3 className="text-lg font-semibold text-gray-900">
            Seleccioná un monto
          </h3>
          <RadioGroup
            value={selectedAmount}
            onValueChange={setSelectedAmount}
            classNames={{
              wrapper: "flex flex-row gap-4 justify-evenly flex-wrap",
              base: "w-full",
            }}
          >
            <Radio
              value="20000"
              classNames={{
                base: "bg-white w-[10rem] border border-gray-300 hover:border-green-400 rounded-lg transition-colors",
                label: "text-black font-medium",
              }}
            >
              <p className="place-self-center"> $20.000</p>
            </Radio>
            <Radio
              value="40000"
              classNames={{
                base: "bg-green-50 w-[10rem] border-2 border-green-500 rounded-lg",
                label: "text-black font-medium",
              }}
            >
              <p className="place-self-center">$40.000</p>
            </Radio>
            <Radio
              value="60000"
              classNames={{
                base: "bg-white w-[10rem] border border-gray-300 hover:border-green-400 rounded-lg transition-colors",
                label: "text-black font-medium",
              }}
            >
              <p className="place-self-center"> $60.000</p>
            </Radio>
            <Radio
              value="custom"
              classNames={{
                base: "bg-white w-[10rem] border border-gray-300 hover:border-green-400 rounded-lg transition-colors",
                label: "text-black font-medium",
              }}
            >
              <p className="place-self-center">Libre</p>
            </Radio>
          </RadioGroup>
          {selectedAmount === "custom" && (
            <div className="mt-4 w-full flex flex-col items-center">
              <Input
                type="number"
                min={15001}
                placeholder="Ingresá el monto libre (mínimo $15.001)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                variant="bordered"
                size="lg"
                className="w-full max-w-xs"
                classNames={{
                  input: "bg-white text-black",
                  inputWrapper:
                    "bg-white border-gray-300 focus-within:border-green-500",
                }}
                required
              />
              {customAmount && Number(customAmount) < 15001 && (
                <span className="text-red-500 text-sm mt-2">
                  El monto debe ser mayor a $15.000
                </span>
              )}
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-lg transition-colors"
          size="lg"
        >
          Enviar y continuar a Mercado Pago
        </Button>
      </form>
    </Card>
  );
}
