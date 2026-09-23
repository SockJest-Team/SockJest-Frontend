"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Tag,
  TrendingUp,
  AlertCircle,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { usePendientesModeracion } from "../hooks/usePendientesModeracion";
import { useResolverSubasta } from "../hooks/useResolverSubasta";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearMoneda, formatearFecha } from "@/utils/formatters";
import type { SubastaResumen } from "../types";

export function ModeracionView() {
  const {
    data: pendientes,
    isPending,
    isError,
    error,
  } = usePendientesModeracion();
  const resolver = useResolverSubasta();

  const [motivoEnEdicion, setMotivoEnEdicion] = useState<string | null>(null);
  const [textoMotivo, setTextoMotivo] = useState("");
  const [loteExpandido, setLoteExpandido] = useState<string | null>(null);

  function aprobar(lote: SubastaResumen) {
    resolver.mutate(
      { idSubasta: lote.idSubasta, aprobar: true },
      {
        onSuccess: () =>
          toast.success(
            `"${lote.titulo}" aprobada — programada para su fecha de inicio.`,
          ),
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  function confirmarRechazo(lote: SubastaResumen) {
    if (!textoMotivo.trim()) {
      toast.error("Escribe el motivo del rechazo para el subastador.");
      return;
    }
    resolver.mutate(
      { idSubasta: lote.idSubasta, aprobar: false, motivo: textoMotivo.trim() },
      {
        onSuccess: () => {
          toast.success(
            `"${lote.titulo}" rechazada con motivo enviado al subastador.`,
          );
          setMotivoEnEdicion(null);
          setTextoMotivo("");
        },
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  // Checklist de verificación para cada lote
  function calcularChecks(lote: SubastaResumen) {
    const checks = [
      {
        label: "Tiene imagen principal",
        ok: !!lote.imagenes?.[0]?.url,
        icon: ImageIcon,
      },
      {
        label: "Tiene descripción",
        ok: !!lote.descripcion && lote.descripcion.length >= 20,
        icon: Package,
      },
      {
        label: "Precio base válido",
        ok: Number(lote.precioBase) > 0,
        icon: TrendingUp,
      },
      {
        label: "Fecha de inicio futura",
        ok: new Date(lote.fechaInicio) > new Date(),
        icon: Clock,
      },
      {
        label: "Categoría asignada",
        ok: !!lote.idCategoria2?.nombre,
        icon: Tag,
      },
    ];
    const passed = checks.filter((c) => c.ok).length;
    return { checks, passed, total: checks.length };
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] grid place-items-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="font-serif text-xl text-stone-700">
            {obtenerMensajeError(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      {/* Header compacto */}
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-500">
                Panel de moderación · {pendientes?.length ?? 0} lotes pendientes
              </span>
            </div>
            <h1 className="text-3xl font-serif font-normal text-stone-900">
              Verificación de legitimidad
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Revisa que el producto, imágenes y envío sean legítimos antes de
              publicar.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isPending && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-white border border-stone-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {!isPending && pendientes?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border border-dashed border-stone-300 rounded-xl"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="font-serif text-xl text-stone-700">
              No hay lotes pendientes de revisión.
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mt-2">
              El catálogo está al día
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          {pendientes?.map((lote, i) => {
            const { checks, passed, total } = calcularChecks(lote);
            const todosOk = passed === total;
            const expandido = loteExpandido === lote.idSubasta;

            return (
              <motion.article
                key={lote.idSubasta}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr]">
                  {/* Imagen con badge de checks */}
                  <div className="relative">
                    <ImagenConFallback
                      src={lote.imagenes?.[0]?.url}
                      alt={lote.titulo}
                      className="w-full h-40 md:h-full"
                    />
                    {/* Badge de completitud */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        todosOk
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {passed}/{total}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 space-y-3">
                    {/* Header: título + precio */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                            #{lote.idSubasta}
                          </span>
                          {lote.idCategoria2 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                              {lote.idCategoria2.nombre}
                            </span>
                          )}
                          {lote.esPrivada && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                              Privada
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-serif font-medium text-stone-900 mt-1 line-clamp-1">
                          {lote.titulo}
                        </h2>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] uppercase tracking-wider text-stone-400">
                          Base
                        </div>
                        <div className="text-lg font-bold text-stone-900 tabular-nums">
                          {formatearMoneda(lote.precioBase)}
                        </div>
                      </div>
                    </div>

                    {/* Descripción corta */}
                    {lote.descripcion && (
                      <p className="text-sm text-stone-600 line-clamp-1">
                        {lote.descripcion}
                      </p>
                    )}

                    {/* Meta info compacta */}
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatearFecha(lote.fechaInicio)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />+
                        {lote.incrementoMinimoPct}%
                      </span>
                      {lote.imagenes && lote.imagenes.length > 1 && (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {lote.imagenes.length} imgs
                        </span>
                      )}
                    </div>

                    {/* Checklist expandible */}
                    <button
                      onClick={() =>
                        setLoteExpandido(expandido ? null : lote.idSubasta)
                      }
                      className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      <div className="flex gap-0.5">
                        {checks.map((c, idx) => (
                          <div
                            key={idx}
                            className={`h-1 w-6 rounded-full ${c.ok ? "bg-emerald-500" : "bg-stone-300"}`}
                          />
                        ))}
                      </div>
                      <span>
                        {passed} de {total} verificaciones
                      </span>
                    </button>

                    <AnimatePresence>
                      {expandido && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {checks.map((c, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs"
                              >
                                {c.ok ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                                <span
                                  className={
                                    c.ok ? "text-stone-700" : "text-amber-700"
                                  }
                                >
                                  {c.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => aprobar(lote)}
                        disabled={resolver.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-wider font-mono rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprobar
                      </button>
                      <button
                        onClick={() =>
                          setMotivoEnEdicion(
                            motivoEnEdicion === lote.idSubasta
                              ? null
                              : lote.idSubasta,
                          )
                        }
                        disabled={resolver.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 hover:border-red-500 hover:text-red-600 text-stone-700 text-xs uppercase tracking-wider font-mono rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                      <a
                        href={`/subastas/${lote.idSubasta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-mono text-stone-500 hover:text-stone-900 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver detalle
                      </a>
                    </div>

                    {/* Form de rechazo */}
                    <AnimatePresence>
                      {motivoEnEdicion === lote.idSubasta && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2 mt-2">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-red-700">
                              Motivo del rechazo (visible para el subastador)
                            </label>
                            <textarea
                              value={textoMotivo}
                              onChange={(e) => setTextoMotivo(e.target.value)}
                              rows={2}
                              placeholder="Ej: Las imágenes no corresponden al producto descrito…"
                              className="w-full bg-white border border-red-200 rounded-md px-3 py-2 text-stone-900 text-sm focus:outline-none focus:border-red-500 resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => confirmarRechazo(lote)}
                                disabled={resolver.isPending}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest font-mono rounded-md transition-colors disabled:opacity-50"
                              >
                                Confirmar rechazo
                              </button>
                              <button
                                onClick={() => {
                                  setMotivoEnEdicion(null);
                                  setTextoMotivo("");
                                }}
                                className="px-4 py-2 border border-stone-300 text-stone-600 text-[10px] uppercase tracking-widest font-mono rounded-md hover:border-stone-900 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
