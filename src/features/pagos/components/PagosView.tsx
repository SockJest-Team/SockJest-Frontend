"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useMisPagos } from "../hooks/useMisPagos";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearMoneda, formatearFechaHora } from "@/utils/formatters";
import { Countdown } from "@/components/ui/Countdown";
import { CheckoutModal } from "./CheckoutModal";
import type { PagoResumen } from "@/api/services/pagoService";

export function PagosView() {
  const { data: pagos, isPending, isError, error } = useMisPagos();
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoResumen | null>(
    null,
  );

  const pendientes = pagos?.filter((p) => p.estado === "Pendiente") ?? [];
  const historial = pagos?.filter((p) => p.estado !== "Pendiente") ?? [];

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      <section className="pt-20 pb-12 px-6 max-w-5xl mx-auto border-b border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-500 block mb-3">
            Cuenta &middot; Pagos
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-stone-900 leading-[1.1]">
            {pendientes.length > 0 ? (
              <>
                Tienes{" "}
                <span className="italic font-light">
                  {pendientes.length} pago{pendientes.length > 1 ? "s" : ""}{" "}
                  pendiente{pendientes.length > 1 ? "s" : ""}
                </span>
                .
              </>
            ) : (
              <>
                Pagos al <span className="italic font-light">día</span>.
              </>
            )}
          </h1>
          <p className="mt-4 text-stone-600 text-base sm:text-lg font-light leading-relaxed">
            {pendientes.length > 0
              ? "Recuerda: el plazo es de 48 horas desde el cierre de la subasta. Si vence, el lote pasa al siguiente postor."
              : "Aquí verás tus pagos pendientes y el historial de compras confirmadas."}
          </p>
        </motion.div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {isError && (
          <div className="text-center py-16 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-lg">
              {obtenerMensajeError(error)}
            </p>
          </div>
        )}

        {isPending && (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-white border border-stone-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {pendientes.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Pendientes de pago ({pendientes.length})
            </h2>
            {pendientes.map((pago, i) => (
              <motion.article
                key={pago.idPago}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white border border-stone-200 shadow-sm hover:border-stone-900 transition-colors"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                      Ganaste &middot; Lote #{pago.idSubasta}
                    </span>
                    <h3 className="text-2xl font-serif font-normal text-stone-900">
                      {pago.tituloSubasta}
                    </h3>
                    <p className="text-3xl font-serif font-semibold text-stone-900 tabular-nums">
                      {formatearMoneda(pago.monto)}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-widest text-amber-700 bg-amber-50 border-l-2 border-amber-600 px-3 py-2 inline-block">
                      ⏱ Vence en <Countdown fechaFin={pago.fechaLimite} />
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 md:items-end">
                    <button
                      onClick={() => setPagoSeleccionado(pago)}
                      className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white
                                 font-mono text-[11px] uppercase tracking-widest
                                 transition-colors"
                    >
                      Pagar ahora
                    </button>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                      Tarjeta · PSE · Nequi
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        )}

        {historial.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Historial de pagos
            </h2>
            <div className="bg-white border border-stone-200 rounded-3xl shadow-sm divide-y divide-stone-100">
              {historial.map((pago) => (
                <div
                  key={pago.idPago}
                  className="p-5 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-serif text-base text-stone-900">
                      {pago.tituloSubasta}
                    </p>
                    <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                      {pago.fechaPago
                        ? `Pagado el ${formatearFechaHora(pago.fechaPago)}`
                        : "—"}
                      {pago.referenciaPasarela &&
                        ` · Ref: ${pago.referenciaPasarela}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-serif font-semibold text-stone-900 tabular-nums">
                      {formatearMoneda(pago.monto)}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                        pago.estado === "Pagado"
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {pago.estado === "Pagado" ? "✓ Pagado" : pago.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isPending && pagos?.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-xl">
              Aún no tienes pagos.
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mt-3">
              Cuando ganes una subasta, aparecerá aquí
            </p>
          </div>
        )}
      </main>

      <CheckoutModal
        key={pagoSeleccionado?.idPago ?? "cerrado"}
        pago={pagoSeleccionado}
        onCerrar={() => setPagoSeleccionado(null)}
      />
    </div>
  );
}
