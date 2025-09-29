"use client";

import React, { useState } from "react";
import { Card, CardHeader, Input, Button } from "@heroui/react";
import { createSuscription } from "@/actions/plans";
import { SuscriptionRequestBody } from "@/interfaces/SuscriptionRequestBody";
import RadioGroupCustom from "./RadioGroupCustom";
import ButtonSend from "./ButtonSend";

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
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    howDidYouKnow: "",
    whoToldYou: "Carlos Ramallo",
  });

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

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validación monto libre
      if (selectedAmount === "custom") {
        const amount = Number(customAmount);
        if (isNaN(amount) || amount < 15001) {
          alert("El monto libre debe ser mayor a $15.000");
          setIsLoading(false);
          return;
        }
      }

      // Configurar fechas
      const startDate = new Date();
      const endDate = addMonths(startDate, 12);

      const body: SuscriptionRequestBody = {
        reason: "Test 1",
        external_reference: "VRC-1234",
        payer_email: formData.email,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          transaction_amount: Number(
            selectedAmount === "custom" ? customAmount : selectedAmount
          ),
          currency_id: "ARS",
        },
        back_url: "https://www.mercadopago.com.ar",
      };

      // 1) Crear suscripción en Mercado Pago
      const result = await createSuscription(body);

      // 2) Enviar datos al Google Sheet
      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...formData,
            monto: selectedAmount === "custom" ? customAmount : selectedAmount,
            id_suscription: result.subscription_id,
          },
        }),
      });

      console.log("✅ Suscripción creada y datos enviados al sheet");

      // 3) Abrir checkout de MP
      window.open(result.init_point, "_blank");
    } catch (error) {
      console.error("❌ Error en la suscripción:", error);
      alert("Hubo un error al crear la suscripción");
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        howDidYouKnow: "",
        whoToldYou: "Carlos Ramallo",
      });
      setSelectedAmount("20000");
      setCustomAmount("");
      setValue("");
    }
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

      <div className="space-y-6 px-8 pb-8">
        {/* Nombre y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={
              <span>
                Nombre y apellido <span className="text-red-500">*</span>
              </span>
            }
            value={formData.name}
            placeholder="Ingresa tu nombre y apellido"
            onChange={(e) => handleInputChange("name", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            required
          />
          <Input
            label={
              <span>
                Email <span className="text-red-500">*</span>
              </span>
            }
            type="email"
            placeholder="Ingresa tu email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
            isRequired
            required
          />
        </div>

        {/* Teléfono y Cómo conociste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={
              <span>
                Celular <span className="text-red-500">*</span>
              </span>
            }
            placeholder="Ingresa tu número de celular"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
          />

          <Input
            label={
              <span>
                ¿Cómo conociste VRC? <span className="text-red-500">*</span>
              </span>
            }
            value={formData.howDidYouKnow}
            placeholder="Ej: Evento, amigo, redes sociales..."
            onChange={(e) => handleInputChange("howDidYouKnow", e.target.value)}
            variant="bordered"
            classNames={inputClasses}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className={`${inputClasses.label}`}>
            ¿Quién te contó de VRC? <span className="text-red-500">*</span>
          </label>

          <div className={`${inputClasses.inputWrapper} rounded-lg px-2 py-1`}>
            <select
              required
              className={`${inputClasses.input} w-full bg-transparent outline-none`}
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

        <RadioGroupCustom
          value={selectedAmount}
          selectedAmount={selectedAmount}
          setSelectedAmount={setSelectedAmount}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
        />

        <ButtonSend isLoading={isLoading} handleSubmit={handleSubmit} />
      </div>
    </Card>
  );
}
