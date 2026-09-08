"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/api/config/axiosClient";
import { formatearFechaHora } from "@/utils/formatters";

interface RegistroHistorial {
  idHistorial: string;
  estadoAnterior: string | null;
  estadoNuevo: string;
  fecha: string;
  idSubasta: { idSubasta: string; titulo: string } | null;
  idUsuarioResponsable: { nombreCompleto: string } | null;
}

export default function AdminHistorialPage() {
  const [filtro, setFiltro] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["historial", "estados", filtro],
    queryFn: async () => {
      const { data } = await axiosClient.get<RegistroHistorial[]>(
        "/historial/subastas",
        { params: filtro ? { idSubasta: filtro } : {} },
      );
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-stone-900">
        Historial de Estados
      </h1>
      <input
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Filtrar por ID de subasta…"
        className="w-full max-w-sm bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm
                   focus:outline-none focus:border-stone-900 rounded-full"
      />
      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm divide-y divide-stone-100 overflow-x-auto">
        {isPending && <p className="p-6 text-stone-400">Cargando…</p>}
        {data?.map((h) => (
          <div
            key={h.idHistorial}
            className="p-4 flex flex-wrap gap-x-6 gap-y-1 items-center"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 w-40 truncate">
              #{h.idSubasta?.idSubasta} · {h.idSubasta?.titulo}
            </span>
            <span className="text-sm text-stone-600">
              <b className="text-stone-900">{h.estadoAnterior ?? "—"}</b> →{" "}
              <b className="text-stone-900">{h.estadoNuevo}</b>
            </span>
            <span className="text-xs font-mono text-stone-400 ml-auto">
              {formatearFechaHora(h.fecha)} ·{" "}
              {h.idUsuarioResponsable?.nombreCompleto ?? "Sistema"}
            </span>
          </div>
        ))}
        {data?.length === 0 && (
          <p className="p-6 text-stone-400">Sin registros.</p>
        )}
      </div>
    </div>
  );
}
