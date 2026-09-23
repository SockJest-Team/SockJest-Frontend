"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Package,
  Flag,
  TrendingUp,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useEstadisticasModeracion,
  useSubastasReportadas,
  useSuspenderSubasta,
  useReactivarSubasta,
} from "../hooks/useModeracion";
import { ModeracionView } from "./ModeracionView";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";

type Tab = "pendientes" | "reportadas" | "estadisticas";

export function ModeracionPanel() {
  const [tab, setTab] = useState<Tab>("pendientes");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          <TabButton
            active={tab === "pendientes"}
            onClick={() => setTab("pendientes")}
            icon={Package}
            label="Pendientes"
          />
          <TabButton
            active={tab === "reportadas"}
            onClick={() => setTab("reportadas")}
            icon={Flag}
            label="Reportadas"
          />
          <TabButton
            active={tab === "estadisticas"}
            onClick={() => setTab("estadisticas")}
            icon={TrendingUp}
            label="Estadísticas"
          />
        </div>
      </div>

      {/* Contenido según tab */}
      {tab === "pendientes" && <ModeracionView />}
      {tab === "reportadas" && <ReportadasView />}
      {tab === "estadisticas" && <EstadisticasView />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Package;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
        active
          ? "text-stone-900 border-stone-900"
          : "text-stone-500 border-transparent hover:text-stone-900"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function EstadisticasView() {
  const { data, isPending } = useEstadisticasModeracion();

  if (isPending || !data) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const tarjetas = [
    {
      label: "Pendientes",
      valor: data.pendientes,
      icon: Package,
      color: "text-amber-600",
    },
    {
      label: "Activas",
      valor: data.activas,
      icon: Play,
      color: "text-emerald-600",
    },
    {
      label: "Suspendidas",
      valor: data.suspendidas,
      icon: Pause,
      color: "text-rose-600",
    },
    {
      label: "Aprobadas",
      valor: data.aprobadas,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      label: "Rechazadas",
      valor: data.rechazadas,
      icon: XCircle,
      color: "text-rose-600",
    },
    {
      label: "Finalizadas",
      valor: data.finalizadas,
      icon: CheckCircle2,
      color: "text-stone-600",
    },
    {
      label: "Reportes pend.",
      valor: data.reportesPendientes,
      icon: Flag,
      color: "text-orange-600",
    },
    {
      label: "Total",
      valor: data.total,
      icon: TrendingUp,
      color: "text-stone-900",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-serif text-stone-900 mb-6">
        Estadísticas de moderación
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tarjetas.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-xl border border-stone-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400">
                  {t.label}
                </span>
                <Icon className={`w-4 h-4 ${t.color}`} />
              </div>
              <div className="text-2xl font-bold text-stone-900 tabular-nums">
                {t.valor}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ReportadasView() {
  const { data: reportes, isPending } = useSubastasReportadas();
  const suspender = useSuspenderSubasta();
  const reactivar = useReactivarSubasta();

  if (isPending) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reportes || reportes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <Flag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-600 font-serif text-lg">
          No hay subastas reportadas
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-3">
      <h2 className="text-2xl font-serif text-stone-900 mb-4">
        Subastas reportadas
      </h2>
      {reportes.map((r, i) => (
        <motion.div
          key={r.idReporte}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white p-4 rounded-xl border border-stone-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Flag className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-sm font-medium text-stone-900">
                  {r.idSubasta2?.titulo ?? "Subasta desconocida"}
                </span>
              </div>
              <p className="text-sm text-stone-600 mb-2">{r.motivo}</p>
              <div className="flex items-center gap-3 text-[10px] text-stone-400">
                <span>Por: {r.idReportador2?.nombreCompleto ?? "Anónimo"}</span>
                <span>{new Date(r.fechaCreacion).toLocaleString("es-CO")}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  reactivar.mutate(r.idSubasta, {
                    onSuccess: () => toast.success("Subasta reactivada"),
                    onError: (e) => toast.error(obtenerMensajeError(e)),
                  });
                }}
                className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                OK
              </button>
              <button
                onClick={() => {
                  const motivo = prompt("Motivo de suspensión:");
                  if (motivo) {
                    suspender.mutate(
                      { idSubasta: r.idSubasta, motivo },
                      {
                        onSuccess: () => toast.success("Subasta suspendida"),
                        onError: (e) => toast.error(obtenerMensajeError(e)),
                      },
                    );
                  }
                }}
                className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1"
              >
                <Pause className="w-3 h-3" />
                Suspender
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
