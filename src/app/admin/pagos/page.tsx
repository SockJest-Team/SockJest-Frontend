"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/api/config/axiosClient";
import { Countdown } from "@/components/ui/Countdown";
import { formatearMoneda, formatearFechaHora } from "@/utils/formatters";

interface PagoAdmin {
  idPago: string;
  tituloSubasta: string;
  comprador: string;
  monto: string;
  estado: string;
  fechaLimite: string;
  fechaPago: string | null;
  referencia: string | null;
}

const ESTADOS = [
  "Todos",
  "Pendiente",
  "Pagado",
  "Vencido",
  "Cancelado",
] as const;

const COLOR_ESTADO: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-700",
  Pagado: "bg-green-100 text-green-700",
  Vencido: "bg-red-100 text-red-700",
  Cancelado: "bg-stone-100 text-stone-500",
};

export default function AdminPagosPage() {
  const [filtro, setFiltro] = useState<(typeof ESTADOS)[number]>("Todos");

  const { data, isPending } = useQuery({
    queryKey: ["admin", "pagos"],
    queryFn: async () => {
      const { data } = await axiosClient.get<PagoAdmin[]>("/reportes/pagos");
      return data;
    },
    refetchInterval: 30_000,
  });

  const filtrados =
    filtro === "Todos"
      ? (data ?? [])
      : (data ?? []).filter((p) => p.estado === filtro);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-stone-900">Pagos</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`shrink-0 font-mono text-[10px] uppercase tracking-widest px-4 py-2
                        rounded-full transition-colors ${
                          filtro === e
                            ? "bg-stone-900 text-white"
                            : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                        }`}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm divide-y divide-stone-100 overflow-x-auto">
        {isPending && <p className="p-6 text-stone-400">Cargando…</p>}

        {filtrados.map((p) => (
          <div
            key={p.idPago}
            className="p-4 flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-stone-900 truncate">
                {p.tituloSubasta}
              </p>
              <p className="text-xs font-mono text-stone-400 truncate">
                #{p.idPago} · {p.comprador}
                {p.referencia && ` · Ref: ${p.referencia}`}
              </p>
            </div>

            <span className="font-serif font-semibold text-stone-900 tabular-nums shrink-0">
              {formatearMoneda(p.monto)}
            </span>

            {p.estado === "Pendiente" ? (
              <span className="text-xs font-mono uppercase tracking-widest text-amber-700 shrink-0">
                ⏱ <Countdown fechaFin={p.fechaLimite} />
              </span>
            ) : (
              <span className="text-xs font-mono text-stone-400 shrink-0">
                {p.fechaPago ? formatearFechaHora(p.fechaPago) : "—"}
              </span>
            )}

            <span
              className={`shrink-0 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                COLOR_ESTADO[p.estado] ?? "bg-stone-100 text-stone-500"
              }`}
            >
              {p.estado}
            </span>
          </div>
        ))}

        {!isPending && filtrados.length === 0 && (
          <p className="p-6 text-stone-400">Sin pagos en este estado.</p>
        )}
      </div>
    </div>
  );
}
