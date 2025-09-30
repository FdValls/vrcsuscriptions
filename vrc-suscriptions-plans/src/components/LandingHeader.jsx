import Image from "next/image";
import React from "react";

export default function LandingHeader() {
  return (
    <div className="relative w-full sm:h-90 md:h-140 flex items-center justify-center bg-emerald-700">
      {/* Imagen de fondo */}
      <Image
        src="/vrc.jpg"
        alt="Header background"
        fill
        className="object-cover opacity-80"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/60 px-4">
        <Image
          src="/logovrc_transparente.png"
          alt="Logo"
          width={120}
          height={120}
          className="mb-4 w-auto h-auto"
        />

        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Somos Virreyes
        </h1>

        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[20px] text-white text-center mb-1">
            Cada chico que está en el club es gracias a alguien que apostó por
            este sueño. Vos podés ser ese alguien.
          </p>
          <br/>
          <p className="text-base text-white text-center">
            Con tu aporte, ayudás a que más de 600 chicos sigan entrenando,
            estudiando y creciendo dentro de un espacio que les da identidad,
            valores y oportunidades.
          </p>
        </div>
      </div>
    </div>
  );
}
