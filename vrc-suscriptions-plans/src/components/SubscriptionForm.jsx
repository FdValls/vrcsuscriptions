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
      // ✅ Validaciones básicas
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.whoToldYou ||
        (formData.whoToldYou === "Otro" && !formData.whoToldYouCustom) ||
        (selectedAmount === "custom" && !customAmount)
      ) {
        alert("Por favor, completá todos los campos requeridos");
        setIsLoading(false);
        return;
      }

      if (selectedAmount === "custom") {
        const amount = Number(customAmount);
        if (isNaN(amount) || amount <= 14999) {
          alert("El monto libre debe ser mayor a $15.000");
          setIsLoading(false);
          return;
        }
      }

      // 🔍 Detectar dispositivo o webview
      const ua = navigator.userAgent.toLowerCase();
      const isIphone = /iphone|ipad|ipod/.test(ua);
      const isWebView = /fbav|instagram|line|twitter/.test(ua);

      // ✅ Crear suscripción
      const res = await fetch("/api/create-suscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Virreyes Rugby Club",
          external_reference: "VRC-1234",
          payer_email: formData.email,
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: Number(
              selectedAmount === "custom" ? customAmount : selectedAmount
            ),
            currency_id: "ARS",
          },
          back_url: "https://www.mercadopago.com.ar",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.init_point) {
        console.error("❌ Error al crear suscripción:", data?.error || data);
        alert(`❌ ${data?.error || "Hubo un error al crear la suscripción"}`);
        setIsLoading(false);
        return;
      }

      // ✅ Enviar datos a la Sheet
      const { whoToldYouCustom, whoToldYou, ...restFormData } = formData;

      await fetch("/api/save-to-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...restFormData,
            whoToldYou: whoToldYou === "Otro" ? whoToldYouCustom : whoToldYou,
            monto: selectedAmount === "custom" ? customAmount : selectedAmount,
            id_suscription: data.subscription_id,
            origen: "donante",
          },
        }),
      });

      console.log("✅ Suscripción creada y datos enviados al sheet");

      // 🕒 Mostrar loading unos instantes (solo para UX)
      setTimeout(() => {
        // ✅ Abrir el link recién cuando ya existe el init_point
        if (isIphone || isWebView) {
          // Safari o WebView → redirigir misma pestaña
          window.location.href = data.init_point;
        } else {
          // Desktop / Android → abrir nueva pestaña
          window.open(data.init_point, "_blank");
        }

        // 🔄 Resetear formulario y estado
        setFormData({
          name: "",
          email: "",
          phone: "",
          whoToldYou: "General",
          whoToldYouCustom: "",
        });
        setSelectedAmount("20000");
        setCustomAmount("");
        setValue("");
        setIsLoading(false);
      }, 1200); // 🕒 Delay de 1.2 segundos solo para mostrar el spinner
    } catch (error) {
      console.error("❌ Error en la suscripción:", error);
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
