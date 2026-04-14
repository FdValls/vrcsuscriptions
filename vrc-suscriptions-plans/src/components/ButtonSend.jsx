import { Button } from "@heroui/react";

export default function ButtonSend({ isLoading, handleSubmit, isDisabled = false }) {
  return (
    <>
      {/* Botón de envío */}
      <div className="flex justify-center mt-4 gap-4">
        <Button
          type="button"
          isLoading={isLoading}
          isDisabled={isDisabled}
          color="secondary"
          onPress={handleSubmit}
          className="flex gap-[1rem] w-[60%] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 text-lg rounded-lg transition-colors justify-space"
          spinner={
            <svg
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          }
        >
          {!isLoading ? "Enviar y continuar a Mercado Pago" : "Redireccionando a Mercado Pago..."}
        </Button>
      </div>
    </>
  );
}
