"use client";

import { motion } from "motion/react";
import { useEstadisticas } from "../hooks/useEstadisticas";
import { formatearMoneda } from "@/utils/formatters";

export function DashboardView() {
  const { data, isPending, isError } = useEstadisticas();

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 text-stone-400">
        Cargando...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50">
        <p className="font-serif text-xl text-stone-700">
          No se pudieron cargar tus estadísticas.
        </p>
      </div>
    );
  }

  const tarjetas = [
    {
      etiqueta: "Subastas Finalizadas",
      valor: String(data?.totalSubastas ?? 0),
    },
    {
      etiqueta: "Ingresos Totales",
      valor: formatearMoneda(data?.totalGanado ?? 0),
    },
    {
      etiqueta: "Promedio Venta",
      valor: formatearMoneda(data?.promedioVenta ?? 0),
    },
    {
      etiqueta: "Ventas Brutas",
      valor: formatearMoneda(data?.totalVentas ?? 0),
    },
    {
      etiqueta: "Comisión Plataforma (5%)",
      valor: formatearMoneda(data?.comision ?? 0),
    },
  ];

  return (
    <div className="bg-stone-50 min-h-[70vh] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light text-stone-900 mb-10"
        >
          Mis Estadísticas
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tarjetas.map((t, i) => (
            <motion.div
              key={t.etiqueta}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
                {t.etiqueta}
              </span>
              <h2 className="text-4xl font-serif font-bold text-stone-900 mt-2">
                {t.valor}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
