import { Input, Radio, RadioGroup } from "@heroui/react";

interface RadioGroupCustomProps {
  value: string;
  setCustomAmount: (value: React.SetStateAction<string>) => void;
  setSelectedAmount: (value: React.SetStateAction<string>) => void;
  customAmount: string;
  selectedAmount: string;
}

export default function RadioGroupCustom({
  value: selectedAmount,
  customAmount,
  setSelectedAmount,
  setCustomAmount,
}: RadioGroupCustomProps) {
  return (
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
  );
}
