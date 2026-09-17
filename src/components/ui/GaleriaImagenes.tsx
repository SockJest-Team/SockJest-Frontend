"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PropsGaleria {
  imagenes: { idImagen: string; url: string; esPrincipal: boolean }[];
  alt: string;
}

export function GaleriaImagenes({ imagenes, alt }: PropsGaleria) {
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <>
      {/* Miniaturas clicables */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {imagenes.map((img, i) => (
            <button
              key={img.idImagen}
              onClick={() => setSeleccionada(i)}
              className="shrink-0 cursor-pointer group relative"
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img
                src={img.url}
                alt={`${alt} ${i + 1}`}
                className="h-16 w-24 object-cover border border-stone-200
                           group-hover:border-stone-900 transition-colors"
              />
              {i === seleccionada && (
                <span className="absolute inset-0 border-2 border-stone-900" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      <AnimatePresence>
        {seleccionada !== null && imagenes[seleccionada] && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSeleccionada(null)}
              className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            />
            <motion.div
              key="lightbox"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] max-w-4xl mx-auto"
            >
              <img
                src={imagenes[seleccionada].url}
                alt={alt}
                className="w-full max-h-[80vh] object-contain"
              />
              {/* Controles */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() =>
                    setSeleccionada((prev) =>
                      prev === null
                        ? null
                        : (prev - 1 + imagenes.length) % imagenes.length,
                    )
                  }
                  className="text-white/70 hover:text-white font-mono text-sm px-4 py-2"
                >
                  ← Anterior
                </button>
                <span className="text-white/50 font-mono text-xs">
                  {seleccionada + 1} / {imagenes.length}
                </span>
                <button
                  onClick={() =>
                    setSeleccionada((prev) =>
                      prev === null ? null : (prev + 1) % imagenes.length,
                    )
                  }
                  className="text-white/70 hover:text-white font-mono text-sm px-4 py-2"
                >
                  Siguiente →
                </button>
              </div>
              <button
                onClick={() => setSeleccionada(null)}
                className="absolute -top-2 -right-2 text-white/60 hover:text-white text-2xl w-10 h-10 grid place-items-center bg-stone-900 rounded-full"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
