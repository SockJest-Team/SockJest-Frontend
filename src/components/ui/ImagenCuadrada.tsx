"use client";

import { useState } from "react";

export function ImagenCuadrada({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [esVertical, setEsVertical] = useState(false);
  const [cargada, setCargada] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className ?? ""}`}>
      <img
        src={src ?? "/placeholder.svg"}
        alt={alt}
        loading="lazy"
        onLoad={(e) => {
          setCargada(true);
          const img = e.currentTarget;
          setEsVertical(img.naturalHeight > img.naturalWidth);
        }}
        className={`
          w-full h-full transition-opacity duration-300
          ${cargada ? "opacity-100" : "opacity-0"}
          object-cover
          ${esVertical ? "object-[50%_30%]" : "object-[50%_50%]"}
        `}
      />
      {!cargada && (
        <div className="absolute inset-0 animate-pulse bg-stone-200" />
      )}
    </div>
  );
}
