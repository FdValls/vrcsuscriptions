"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    Input,
    RadioGroup,
    Radio,
    Button,
} from "@heroui/react";
import { createPlanWithFreeAmount, getPlanByIdWithPlanA, getPlanByIdWithPlanB, getPlanByIdWithPlanC } from "@/actions/plans";
import { PlanRequestBody } from "@/interfaces/PlanRequestBody";

export const animals = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
    { key: "tiger", label: "Tiger" },
    { key: "giraffe", label: "Giraffe" },
    { key: "dolphin", label: "Dolphin" },
    { key: "penguin", label: "Penguin" },
    { key: "zebra", label: "Zebra" },
    { key: "shark", label: "Shark" },
    { key: "whale", label: "Whale" },
    { key: "otter", label: "Otter" },
    { key: "crocodile", label: "Crocodile" },
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

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", {
            ...formData,
            selectedAmount,
            customAmount,
        });

        const mockCustomPlanBody = {
            reason: "Plan Custom Test",
            auto_recurring: {
                frequency: 1,
                frequency_type: "months",
                repetitions: 12,
                billing_day: 10,
                billing_day_proportional: false,
                free_trial: {
                    frequency: 1,
                    frequency_type: "months",
                },
                transaction_amount: Number(customAmount) || 45000, // usa lo que venga del form o fallback
                currency_id: "ARS",
            },
            payment_methods_allowed: {
                payment_types: [{ id: "credit_card" }],
                payment_methods: [{ id: "bolbradesco" }],
            },
            back_url: "https://www.yoursite.com",
        } as PlanRequestBody;


        let rta = null;
        switch (selectedAmount) {
            case "20000":
                rta = await getPlanByIdWithPlanA()
                break;
            case "40000":
                rta = await getPlanByIdWithPlanB()
                break;
            case "60000":
                rta = await getPlanByIdWithPlanC()
                break;
            case "custom":
                rta = await createPlanWithFreeAmount(mockCustomPlanBody)
                break;
            default:
                break;
        }
        console.log("Rta: ", rta)
    };

    const inputClasses = {
        input: "bg-white text-black border-gray-300 focus:border-green-500",
        inputWrapper: "bg-white border-gray-300 hover:border-gray-400 focus-within:border-green-500",
        label: "text-gray-700 font-medium"
    };

    return (
        <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg border my-4 border-gray-200">
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

                {/* Selección de monto */}
                <div className="space-y-4 ">
                    <h3 className="text-lg font-semibold text-gray-900">Seleccioná un monto</h3>
                    <RadioGroup
                        value={selectedAmount}
                        onValueChange={setSelectedAmount}
                        classNames={{
                            wrapper: "flex flex-row gap-4 justify-evenly", // 👈 flex en fila
                            base: "w-full",
                        }}
                    >
                        <Radio
                            value="20000"
                            classNames={{
                                base: "bg-white w-[10rem] border border-gray-300 hover:border-green-400 rounded-lg  transition-colors",
                                label: "text-black font-medium"
                            }}
                        >

                            <p className="place-self-center"> $20.000</p>
                        </Radio>
                        <Radio
                            value="40000"
                            classNames={{
                                base: "bg-green-50 w-[10rem] border-2 border-green-500 rounded-lg ",
                                label: "text-black font-medium"
                            }}
                        >

                            <p className="place-self-center">$40.000</p>
                        </Radio>
                        <Radio
                            value="60000"
                            classNames={{
                                base: "bg-white w-[10rem] border border-gray-300 hover:border-green-400 rounded-lg  transition-colors",
                                label: "text-black font-medium"
                            }}
                        >

                            <p className="place-self-center"> $60.000</p>
                        </Radio>
                        <Radio
                            value="custom"
                            classNames={{
                                base: "bg-white w-[10rem] border border-gray-300 hover:border-green-400 rounded-lg  transition-colors",
                                label: "text-black font-medium"
                            }}
                        >
                            <p className="place-self-center">Libre</p>
                        </Radio>

                        {selectedAmount === "custom" && (
                            <Input
                                placeholder="Ingresá el monto"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                variant="bordered"
                                size="sm"
                                classNames={{
                                    input: "bg-white text-black",
                                    inputWrapper:
                                        "bg-white border-gray-300 focus-within:border-green-500"
                                }}
                            />
                        )}
                    </RadioGroup>

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