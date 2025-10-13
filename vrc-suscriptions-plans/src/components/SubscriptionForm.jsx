"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@heroui/react";
import RadioGroupCustom from "./RadioGroupCustom";
import ButtonSend from "./ButtonSend";
import InputsGroup from "./InputsGroup";
import SelectCustom from "./SelectCustom";
import { validateForm } from "./utils/validation/formSchema";

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
    whoToldYou: "",
    whoToldYouCustom: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValue(e.target.value);
    setFormData((prev) => ({ ...prev, whoToldYou: e.target.value }));
  };

  const handleInputChange = (field, value) => {
    // clear field-level error when user starts typing
    setErrors((prev) => {
      const copy = { ...prev };
      if (copy[field]) delete copy[field];
      return copy;
    });
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
      // Validate whole form with Zod schema
      const payload = {
        ...formData,
        selectedAmount: selectedAmount,
        customAmount: customAmount,
      };

      const { valid, errors: validationErrors } = validateForm(payload);

      if (!valid) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Clear errors when validation passes
      setErrors({});

      if (selectedAmount === "custom") {
        const amount = Number(customAmount);
        if (isNaN(amount) || amount <= 14999) {
          // alert("El monto libre debe ser mayor a $15.000");
          setIsLoading(false);
          return;
        }
      }

      // 🔍 Detectar dispositivo o webview
      const ua = navigator.userAgent.toLowerCase();
      const isIphone = /iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);
      const isMobile = isIphone || isAndroid;
      const isWebView = /fbav|instagram|line|twitter/.test(ua);

      // No abrimos un placeholder para evitar mostrar about:blank inmediatamente.
      // Mantendremos el botón cargando hasta que recibamos el init_point.
      let popup = null; // reservado si se necesitara más tarde

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

      await fetch("/api/save-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...restFormData,
            whoToldYou: whoToldYou === "Otro" ? whoToldYouCustom : whoToldYou,
            monto: selectedAmount === "custom" ? customAmount : selectedAmount,
            id_suscription: data.subscription_id,
          },
        }),
      });

      console.log("✅ Suscripción creada y datos enviados al sheet");

      // Cuando tengamos init_point, intentar abrir en nueva pestaña en desktop/Android.
      // En iPhone o webviews navegamos en la misma pestaña.
      try {
        if (isIphone || isWebView) {
          // iOS / In-app browsers: redirigir misma pestaña
          window.location.href = data.init_point;
        } else {
          // Desktop / Android: intentar abrir nueva pestaña
          const newWin = window.open(data.init_point, '_blank', 'noopener');
          if (newWin) {
            try {
              newWin.focus();
            } catch (e) {
              // ignore focus errors
            }
          }
          //  else {
          //   // Popup bloqueado: fallback a navegación misma pestaña
          //   window.location.href = data.init_point;
          // }
        }
      } catch (e) {
        // Fallback seguro
        window.location.href = data.init_point;
      }

      // 🔄 Resetear estado local (si la navegación no recarga la página)
      setFormData({
        name: "",
        email: "",
        phone: "",
        whoToldYou: "",
        whoToldYouCustom: "",
      });
      setSelectedAmount("20000");
      setCustomAmount("");
      setValue("");
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error en la suscripción:", error);
      alert("Hubo un error al crear la suscripción");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl max-h-full mx-auto bg-white shadow-lg border border-gray-200 my-8">
      <CardHeader className="pb-4 pt-6 px-6 md:px-8 justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Quiero ser socio y contribuir mensualmente
        </h2>
      </CardHeader>

      <div className="space-y-5 px-6 md:px-8">
        <InputsGroup
          formData={formData}
          handleChange={handleChange}
          handleInputChange={handleInputChange}
          errors={errors}
        />

        {/* Select de quién te contó */}
        <SelectCustom
          whoToldYouCustom={formData.whoToldYouCustom}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
        />
        {/* Radio Group de montos */}
        <div>
          <RadioGroupCustom
            value={selectedAmount}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
            error={errors.customAmount}
            setError={(msg) => setErrors((prev) => ({ ...prev, customAmount: msg }))}
          />
        </div>

        {/* Botón de envío */}
        <div className="mb-6">
          <ButtonSend isLoading={isLoading} handleSubmit={handleSubmit} />
        </div>
      </div>
    </Card>
  );
}
