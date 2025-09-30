import { Input, Radio, RadioGroup } from "@heroui/react";

export default function RadioGroupCustom({
  value: selectedAmount,
  customAmount,
  setSelectedAmount,
  setCustomAmount,
}) {
  return (
    <div className="space-y-4 ">
      <h3 className="text-lg font-semibold text-gray-900">
        Seleccioná un monto
      </h3>
      <RadioGroup
        value={selectedAmount}
        onValueChange={setSelectedAmount}
        classNames={{
          label: "text-black font-medium",
          wrapper: "flex flex-row gap-4 justify-evenly flex-wrap",
          base: "w-full",
        }}
      >
        <Radio
          value="20000"
          classNames={{
            base: [
              "w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
              // aplica estilos según si está seleccionado o no
              "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
              "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
            ].join(" "),
            label: "text-black font-medium mt-4",
          }}
        >
          <p className="place-self-center"> $20.000</p>
        </Radio>
        <Radio
          value="40000"
          classNames={{
            base: [
              "w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
              // aplica estilos según si está seleccionado o no
              "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
              "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
            ].join(" "),
            label: "text-black font-medium mt-4",
          }}
        >
          <p className="place-self-center">$40.000</p>
        </Radio>
        <Radio
          value="60000"
          classNames={{
            base: [
              "w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
              // aplica estilos según si está seleccionado o no
              "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
              "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
            ].join(" "),
            label: "text-black font-medium mt-4",
          }}
        >
          <p className="place-self-center"> $60.000</p>
        </Radio>
        <Radio
          value="custom"
          classNames={{
            // base: "bg-white w-[10rem] p-1 h-[3rem] border border-gray-300 hover:border-green-400 rounded-lg transition-colors",
            base: [
              "w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
              // aplica estilos según si está seleccionado o no
              "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
              "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
            ].join(" "),
            label: "text-black font-medium mt-4",
          }}
        >
          <p className="place-self-center">Libre</p>
        </Radio>
      </RadioGroup>
      {selectedAmount === "custom" && (
        <div className="mt-4 w-full flex flex-col items-center">
          <Input
            type="number"
            min={15000}
            placeholder="Ingresá el monto libre (mínimo $15.000)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            variant="bordered"
            size="lg"
            className="w-full text-center"
            classNames={{
              input: "bg-white text-black",
              inputWrapper:
                "bg-white border-gray-300 focus-within:border-green-500",
            }}
            required
          />
          {customAmount && Number(customAmount) <= 14999 && (
            <span className="text-red-500 text-sm">
              El monto debe ser mayor a $15.000
            </span>
          )}
        </div>
      )}
    </div>
  );
}
