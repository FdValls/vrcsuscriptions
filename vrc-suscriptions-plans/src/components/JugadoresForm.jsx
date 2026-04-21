"use client";

import React, { useState } from "react";
import { Card, CardHeader, Input, Radio, RadioGroup } from "@heroui/react";
import ButtonSend from "./ButtonSend";
import SelectCustom from "./SelectCustom";
import CategorySelector from "./CategorySelector";
import PersonFields from "./PersonFields";
import { validateJugadoresForm } from "./utils/validation/jugadoresFormSchema";
import { categoryAmounts } from "./utils/mocks/categories";

const SECTION_ORDER = [
  { id: "section-camada",     keys: ["camada", "categoryType"] },
  { id: "section-jugador",    keys: ["jugadorNombre", "jugadorEmail", "jugadorDni", "jugadorFechaNac", "jugadorDireccion", "jugadorTelefono"] },
  { id: "section-padre",      keys: ["padreNombre", "padreEmail", "padreDni", "padreFechaNac", "padreDireccion", "padreTelefono"] },
  { id: "section-whoToldYou", keys: ["whoToldYou", "whoToldYouCustom"] },
  { id: "section-amount",     keys: ["selectedAmount", "customAmount"] },
];

const scrollToFirstError = (errors) => {
  const errorKeys = new Set(Object.keys(errors));
  const firstSection = SECTION_ORDER.find(({ keys }) => keys.some((k) => errorKeys.has(k)));
  if (!firstSection) return;
  setTimeout(() => {
    document.getElementById(firstSection.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 50);
};

const INITIAL_FORM = {
  camada: "", customAmount: "",
  whoToldYou: "", whoToldYouCustom: "",
  jugadorNombre: "", jugadorEmail: "", jugadorDni: "", jugadorFechaNac: "", jugadorDireccion: "", jugadorTelefono: "",
  padreNombre: "",  padreEmail: "",  padreDni: "",  padreFechaNac: "",  padreDireccion: "",  padreTelefono: "",
};

const AMOUNT_LABELS = { "20000": "$20.000", "40000": "$40.000", "60000": "$60.000" };

const radioBaseClasses = [
  "flex flex-col p-3 border-2 border-gray-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md",
  "data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-emerald-50 data-[selected=true]:to-green-50 data-[selected=true]:border-green-500 data-[selected=true]:shadow-lg",
  "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
].join(" ");

export default function JugadoresForm() {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [categoryType, setCategoryType] = useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleWhoToldYouChange = (e) => {
    setFormData((prev) => ({ ...prev, whoToldYou: e.target.value }));
    setErrors((prev) => { const c = { ...prev }; delete c.whoToldYou; return c; });
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => { const c = { ...prev }; delete c[field]; return c; });
  };

  const handleCategoryChange = (category) => {
    setCategoryType(category);
    setSelectedAmount("");
    setCustomAmount("");
    if (category === "plantel") {
      setErrors((prev) => {
        const c = { ...prev };
        ["padreNombre","padreEmail","padreDni","padreFechaNac","padreDireccion","padreTelefono"].forEach((k) => delete c[k]);
        return c;
      });
    }
  };

  const handleAmountChange = (val) => {
    setSelectedAmount(val);
    setCustomAmount("");
    setErrors((prev) => { const c = { ...prev }; delete c.selectedAmount; delete c.customAmount; return c; });
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setFormData((prev) => ({ ...prev, customAmount: val }));
    if (val && Number(val) > 14999) {
      setSelectedAmount("custom");
      setErrors((prev) => { const c = { ...prev }; delete c.customAmount; delete c.selectedAmount; return c; });
    } else {
      setSelectedAmount("");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const needsPadreFields = categoryType === "infantil" || categoryType === "juvenil";

    const { valid, errors: validationErrors } = validateJugadoresForm({
      ...formData,
      customAmount,
      selectedAmount,
      categoryType,
    });

    if (!valid) {
      setErrors(validationErrors);
      scrollToFirstError(validationErrors);
      setIsLoading(false);
      return;
    }

    setErrors({});

    try {
      const ua = navigator.userAgent.toLowerCase();
      const isIphone = /iphone|ipad|ipod/.test(ua);
      const isWebView = /fbav|instagram|line|twitter/.test(ua);
      const transactionAmount = Number(selectedAmount === "custom" ? customAmount : selectedAmount);
      const payerEmail = needsPadreFields ? formData.padreEmail : formData.jugadorEmail;

      const res = await fetch("/api/create-suscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Virreyes Rugby Club",
          external_reference: "VRC-1234",
          payer_email: payerEmail,
          auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: transactionAmount, currency_id: "ARS" },
          back_url: "https://www.mercadopago.com.ar",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.init_point) {
        alert(`❌ ${data?.error || "Hubo un error al crear la suscripción"}`);
        setIsLoading(false);
        return;
      }

      const { whoToldYouCustom, whoToldYou, ...restFormData } = formData;

      await fetch("/api/save-to-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            ...restFormData,
            whoToldYou: whoToldYou === "Otro" ? whoToldYouCustom : whoToldYou,
            monto: transactionAmount,
            categoria: categoryType,
            id_suscription: data.subscription_id,
          },
        }),
      });

      setTimeout(() => {
        if (isIphone || isWebView) window.location.href = data.init_point;
        else window.open(data.init_point, "_blank");
        setFormData(INITIAL_FORM);
        setSelectedAmount("");
        setCustomAmount("");
        setCategoryType(null);
        setErrors({});
        setIsLoading(false);
      }, 1200);
    } catch {
      alert("Hubo un error al crear la suscripción");
      setIsLoading(false);
    }
  };

  const needsPadreFields = categoryType === "infantil" || categoryType === "juvenil";
  const defaultAmount = categoryType ? String(categoryAmounts[categoryType]) : null;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg border border-gray-200 my-8">
      <CardHeader className="pb-4 pt-6 px-6 md:px-8 justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Quiero ser socio y contribuir mensualmente
        </h2>
      </CardHeader>

      <div className="space-y-6 px-6 md:px-8 pb-8">

        <div id="section-camada">
          <CategorySelector
            setFormData={setFormData}
            onCategoryChange={handleCategoryChange}
            errors={errors}
          />
        </div>

        {categoryType && (
          <div id="section-jugador">
            <PersonFields
              prefix="jugador"
              title="Datos del jugador"
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              showEmail={!needsPadreFields}
            />
          </div>
        )}

        {needsPadreFields && (
          <div id="section-padre">
            <PersonFields
              prefix="padre"
              title="Datos del padre / madre / tutor"
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              showEmail={true}
            />
          </div>
        )}

        {categoryType && (
          <div id="section-whoToldYou">
            <SelectCustom
              whoToldYouCustom={formData.whoToldYouCustom}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleWhoToldYouChange}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        )}

        {categoryType && (
          <div id="section-amount" className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Seleccioná un monto</h3>
            <div className="flex flex-col gap-4 items-center">
              <RadioGroup
                value={selectedAmount}
                onValueChange={handleAmountChange}
                classNames={{
                  wrapper: "flex flex-row gap-4 justify-evenly flex-wrap",
                  base: "w-full",
                }}
              >
                <Radio value={defaultAmount} classNames={{ base: radioBaseClasses, label: "text-black font-bold text-lg flex-1" }}>
                  {AMOUNT_LABELS[defaultAmount]}
                </Radio>
              </RadioGroup>

              <div className="w-full max-w-xs">
                <Input
                  type="number"
                  min={15000}
                  placeholder="Monto libre (mínimo $15.000)"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  variant="bordered"
                  size="lg"
                  className="w-full"
                  classNames={{ base: "w-full", input: "text-center font-bold text-lg placeholder:text-gray-400" }}
                  isInvalid={!!errors.customAmount}
                  errorMessage={errors.customAmount}
                />
                {!errors.customAmount && customAmount && Number(customAmount) <= 14999 && (
                  <span className="text-red-500 text-sm font-semibold mt-1 block text-center">
                    El monto debe ser mayor a $15.000
                  </span>
                )}
              </div>

              {errors.selectedAmount && !errors.customAmount && (
                <p className="text-sm text-red-600 font-semibold text-center">{errors.selectedAmount}</p>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <ButtonSend isLoading={isLoading} handleSubmit={handleSubmit} />
        </div>
      </div>
    </Card>
  );
}
