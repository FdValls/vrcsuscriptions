"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@heroui/react";
import RadioGroupCustom from "./RadioGroupCustom";
import ButtonSend from "./ButtonSend";
import InputsGroup from "./InputsGroup";
import SelectCustom from "./SelectCustom";

export default function SubscriptionForm() {
  const [selectedAmount, setSelectedAmount] = useState("20000");
  const [customAmount, setCustomAmount] = useState("");
  const [value, setValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    // howDidYouKnow: "",
    whoToldYou: "General",
    whoToldYouCustom: "",
  });

  const handleChange = (e) => {
    setValue(e.target.value);
    setFormData((prev) => ({ ...prev, whoToldYou: e.target.value }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Validación campos requeridos
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        // !formData.howDidYouKnow ||
        !formData.whoToldYou ||
        (formData.whoToldYou === "Otro" && !formData.whoToldYouCustom) ||
        (selectedAmount === "custom" && !customAmount)
      ) {
        alert("Por favor, completá todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      // Validación monto libre
      if (selectedAmount === "custom") {
        const amount = Number(customAmount);
        if (isNaN(amount) || amount <= 14999) {
          alert("El monto libre debe ser mayor a $15.000");
          setIsLoading(false);
          return;
        }
      }

      // Configurar fechas
      const startDate = new Date();
      const endDate = addMonths(startDate, 12);

      const bodyForSuscription = {
        reason: "Virreyes Rugby Club",
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
      const res = await fetch("/api/create-suscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyForSuscription),
      });

      // acá todavía no parseamos
      const data = await res.json();

      // si falló la request, manejo el error
      if (!res.ok) {
        console.error("❌", data.error);

        alert(`❌ ${data.error}`);
        setIsLoading(false);
        return; // 👈 importante cortar acá
      }

      const { whoToldYouCustom, whoToldYou, ...restFormData } = formData;

      // 2) Enviar datos al Google Sheet
      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...restFormData,
            // ✅ Corregido: verifica si whoToldYou es "Otro"
            whoToldYou: whoToldYou === "Otro" ? whoToldYouCustom : whoToldYou,
            monto: selectedAmount === "custom" ? customAmount : selectedAmount,
            id_suscription: data.subscription_id,
          },
        }),
      });

      console.log("✅ Suscripción creada y datos enviados al sheet");

      //Pequeño delay para que el usuario vea el cambio de texto en el botón
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      // 3) Abrir checkout de MP
      window.open(data.init_point, "_blank");
      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        phone: "",
        // howDidYouKnow: "",
        whoToldYou: "General",
        whoToldYouCustom: "",
      });
      setValue("");
      setSelectedAmount("20000");
      setCustomAmount("");
    } catch (error) {
      console.error("❌ Error en la suscripción:");
      alert("Hubo un error al crear la suscripción");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg border border-gray-200 my-8">
      <CardHeader className="pb-4 pt-6 px-6 md:px-8 justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Quiero ser socio y contribuir mensualmente
        </h2>
      </CardHeader>

      <div className="space-y-5 px-6 md:px-8 pb-8">
        <InputsGroup
          formData={formData}
          handleChange={handleChange}
          handleInputChange={handleInputChange}
        />

        {/* Select de quién te contó */}
        <SelectCustom
          whoToldYouCustom={formData.whoToldYouCustom}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
        />
        {/* Radio Group de montos */}
        <div>
          <RadioGroupCustom
            value={selectedAmount}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
          />
        </div>

        {/* Botón de envío */}
        <div className="pt-2">
          <ButtonSend isLoading={isLoading} handleSubmit={handleSubmit} />
        </div>
      </div>
    </Card>
  );
}
