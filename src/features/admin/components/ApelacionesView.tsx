"use client";

import { useApelaciones, useResolverApelacion } from "../hooks/useApelaciones";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { formatearFecha } from "@/utils/formatters";

export function ApelacionesView() {
  const { data, isPending } = useApelaciones();
  const resolver = useResolverApelacion();

  if (isPending)
    return <div className="text-center py-8 text-stone-400">Cargando...</div>;

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-500">No hay apelaciones pendientes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif text-stone-900">
        Apelaciones de suspensión
      </h2>
      {data.map((a) => (
        <div
          key={a.idApelacion}
          className="bg-white p-4 rounded-xl border border-stone-200"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-stone-900">
                {a.idUsuario2?.nombreCompleto}
              </p>
              <p className="text-xs text-stone-400">
                {formatearFecha(a.fechaCreacion)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resolver.mutate(
                    { id: a.idApelacion, estado: "Aprobada" },
                    {
                      onSuccess: () =>
                        toast.success(
                          "Apelación aprobada y usuario reactivado",
                        ),
                    },
                  );
                }}
                className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Aprobar
              </button>
              <button
                onClick={() => {
                  resolver.mutate(
                    { id: a.idApelacion, estado: "Rechazada" },
                    {
                      onSuccess: () => toast.success("Apelación rechazada"),
                    },
                  );
                }}
                className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded-lg flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Rechazar
              </button>
            </div>
          </div>
          <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg">
            {a.motivo}
          </p>
        </div>
      ))}
    </div>
  );
}
