"use client";

import { useState, useRef, useEffect } from "react";

type Orientacion = "horizontal" | "vertical" | "cuadrada";

interface ImagenCuadradaProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspecto?: "cuadrada" | "video" | "horizontal" | "vertical";
}

const ASPECTO_CLASES: Record<
  NonNullable<ImagenCuadradaProps["aspecto"]>,
  string
> = {
  cuadrada: "aspect-square",
  video: "aspect-video",
  horizontal: "aspect-[4/3]",
  vertical: "aspect-[3/4]",
};

export function ImagenCuadrada({
  src,
  alt,
  className,
  aspecto = "cuadrada",
}: ImagenCuadradaProps) {
  const [orientacion, setOrientacion] = useState<Orientacion>("cuadrada");
  const [cargada, setCargada] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && !cargada) {
      setCargada(true);
      detectarOrientacion(imgRef.current);
    }
  }, [cargada]);

  function detectarOrientacion(img: HTMLImageElement) {
    const { naturalWidth: w, naturalHeight: h } = img;
    if (w === 0 || h === 0) return;
    if (h > w * 1.15) setOrientacion("vertical");
    else if (w > h * 1.15) setOrientacion("horizontal");
    else setOrientacion("cuadrada");
  }

  const posicionFoco =
    orientacion === "vertical" ? "object-[50%_30%]" : "object-center";

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${ASPECTO_CLASES[aspecto]} ${className ?? ""}`}
    >
      {!error && src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(e) => {
            setCargada(true);
            detectarOrientacion(e.currentTarget);
          }}
          onError={() => setError(true)}
          className={`
            absolute inset-0 w-full h-full
            transition-all duration-500 ease-out
            ${cargada ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            object-cover ${posicionFoco}
          `}
        />
      )}

      {!cargada && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 to-stone-200" />
      )}

      {(error || !src) && (
        <div className="absolute inset-0 grid place-items-center bg-stone-100">
          <svg
            className="w-1/4 h-1/4 text-stone-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
