import { Input, Radio, RadioGroup } from "@heroui/react";
import inputWithSelect from "./utils/styles/inputWithSelect";

export default function RadioGroupCustom({
  value: selectedAmount,
  customAmount,
  setSelectedAmount,
  setCustomAmount,
  error,
  setError,
}) {
  return (
    <div className="space-y-4 mt-[1rem]">
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
        <div className="flex flex-col items-center">
          <p>Infantiles</p>
          <Radio
            value="20000"
            classNames={{
              base: [
                "flex-col p-[5px] w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
                // aplica estilos según si está seleccionado o no
                "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
                "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
              ].join(" "),
              label: "text-black font-medium mt-4",
            }}
          >
            <p className="place-self-center"> $20.000</p>
          </Radio>
        </div>
        <div className="flex flex-col items-center">
          <p>Juveniles</p>
          <Radio
            value="40000"
            classNames={{
              base: [
                "flex-col p-[5px] w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
                // aplica estilos según si está seleccionado o no
                "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
                "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
              ].join(" "),
              label: "text-black font-medium mt-4",
            }}
          >
            <p className="place-self-center">$40.000</p>
          </Radio>
        </div>
        <div className="flex flex-col items-center">
          <p>Plantel Superior</p>
          <Radio
            value="60000"
            classNames={{
              base: [
                "flex-col p-[5px] w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors",
                // aplica estilos según si está seleccionado o no
                "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
                "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
              ].join(" "),
              label: "text-black font-medium mt-4",
            }}
          >
            <p className="place-self-center">$60.000</p>
          </Radio>
        </div>
        <div className="flex flex-col items-center">
          <Radio
            value="custom"
            classNames={{
              // base: "bg-white w-[10rem] p-1 h-[3rem] border border-gray-300 hover:border-green-400 rounded-lg transition-colors",
              base: [
                "flex-col p-[5px] w-[10rem] p-1 h-[3rem] border border-gray-300 rounded-lg transition-colors mt-[24px]",
                // aplica estilos según si está seleccionado o no
                "data-[selected=true]:bg-emerald-50 data-[selected=true]:border-green-500 data-[selected=true]:border-2",
                "data-[selected=false]:bg-white data-[selected=false]:border-gray-300 hover:border-green-400",
              ].join(" "),
              label: "text-black font-medium mt-4",
            }}
          >
            <p className="place-self-center">Libre</p>
          </Radio>
        </div>
      </RadioGroup>
      {selectedAmount === "custom" && (
        <div className="mt-4 w-full flex flex-col items-center">
          <Input
            type="number"
            min={15000}
            placeholder="Ingresá el monto libre (mínimo $15.000)"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              if (error) setError(null);
            }}
            variant="bordered"
            size="lg"
            className="w-full text-center"
            classNames={inputWithSelect}
            required
          />
          {error ? (
            <p className="text-sm text-red-600 mt-1 font-semibold">{error}</p>
          ) : (
            customAmount &&
            Number(customAmount) <= 14999 && (
              <span className="text-red-500 text-sm font-semibold">
                El monto debe ser mayor a $15.000
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
