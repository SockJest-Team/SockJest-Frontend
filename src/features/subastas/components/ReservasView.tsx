"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { useMisReservas, useResponderReserva } from "../hooks/useReservas";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearFecha } from "@/utils/formatters";
import { InvitarComprador } from "./InvitarComprador";

const COLOR_ESTADO: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-700",
  Aceptada: "bg-green-100 text-green-700",
  Rechazada: "bg-red-100 text-red-700",
};

export function ReservasView() {
  const { data: solicitudes, isPending } = useMisReservas();
  const responder = useResponderReserva();

  const pendientes = solicitudes?.filter((s) => s.estado === "Pendiente") ?? [];
  const respondidas =
    solicitudes?.filter((s) => s.estado !== "Pendiente") ?? [];

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      <section className="pt-20 pb-12 px-6 max-w-5xl mx-auto border-b border-stone-200">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-500 block mb-3">
          Panel del Subastador · Accesos
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-stone-900">
          Solicitudes de <span className="italic font-light">acceso</span>.
        </h1>
        <p className="mt-4 text-stone-600 font-light leading-relaxed">
          Aprueba o rechaza los compradores que quieren entrar a tus subastas
          privadas o con reserva temprana, o invítalos directamente por correo.
        </p>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Invitar comprador por correo (acceso inmediato) */}
        <InvitarComprador />

        {isPending && (
          <div className="h-24 bg-white border border-stone-200 animate-pulse rounded-3xl" />
        )}

        {!isPending && pendientes.length === 0 && respondidas.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-300 rounded-3xl">
            <p className="text-stone-600 font-serif text-lg">
              Aún no tienes solicitudes de acceso.
            </p>
          </div>
        )}

        {pendientes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Pendientes ({pendientes.length})
            </h2>
            {pendientes.map((s, i) => (
              <motion.article
                key={s.idReserva}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                    «{s.tituloSubasta}» · {formatearFecha(s.fechaSolicitud)}
                  </span>
                  <h3 className="font-serif text-xl text-stone-900 mt-1">
                    {s.comprador.nombre}
                  </h3>
                  <span className="text-xs font-mono text-stone-400">
                    {s.comprador.correo}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      responder.mutate(
                        { idReserva: s.idReserva, aprobar: true },
                        {
                          onSuccess: (r) => toast.success(r.mensaje),
                          onError: (e) => toast.error(obtenerMensajeError(e)),
                        },
                      )
                    }
                    disabled={responder.isPending}
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
                  >
                    Conceder
                  </button>
                  <button
                    onClick={() =>
                      responder.mutate(
                        { idReserva: s.idReserva, aprobar: false },
                        {
                          onSuccess: (r) => toast(r.mensaje),
                          onError: (e) => toast.error(obtenerMensajeError(e)),
                        },
                      )
                    }
                    disabled={responder.isPending}
                    className="px-6 py-3 border border-stone-300 hover:border-red-700 hover:text-red-700 text-stone-700 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              </motion.article>
            ))}
          </section>
        )}

        {respondidas.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
              Historial
            </h2>
            <div className="bg-white border border-stone-200 rounded-3xl divide-y divide-stone-100">
              {respondidas.map((s) => (
                <div
                  key={s.idReserva}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block truncate">
                      «{s.tituloSubasta}»
                    </span>
                    <span className="text-sm text-stone-700">
                      {s.comprador.nombre}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                      COLOR_ESTADO[s.estado] ?? "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {s.estado}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
