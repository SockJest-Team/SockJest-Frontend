"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Check,
  CheckCheck,
  DollarSign,
  Lock,
  Clock,
  Trophy,
  RefreshCw,
  XCircle,
  CheckCircle2,
  PlayCircle,
  KeyRound,
  Info,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificacionService } from "@/api/services/notificacionService";
import { formatearFecha } from "@/utils/formatters";

type TipoNotificacion =
  | "APROBACION"
  | "RECHAZO"
  | "INICIO_SUBASTA"
  | "VICTORIA"
  | "RENOVACION"
  | "PAGO_CONFIRMADO"
  | "RESERVA"
  | "ACCESO";

interface ConfigTipo {
  label: string;
  icon: typeof Bell;
  color: string;
  bgColor: string;
  barraColor: string;
}

const CONFIG_TIPOS: Record<TipoNotificacion, ConfigTipo> = {
  APROBACION: {
    label: "Aprobaciones",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    barraColor: "bg-emerald-500",
  },
  RECHAZO: {
    label: "Rechazos",
    icon: XCircle,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    barraColor: "bg-rose-500",
  },
  INICIO_SUBASTA: {
    label: "Inicios",
    icon: PlayCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    barraColor: "bg-blue-500",
  },
  VICTORIA: {
    label: "Victorias",
    icon: Trophy,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    barraColor: "bg-amber-500",
  },
  RENOVACION: {
    label: "Renovaciones",
    icon: RefreshCw,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    barraColor: "bg-violet-500",
  },
  PAGO_CONFIRMADO: {
    label: "Pagos",
    icon: DollarSign,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    barraColor: "bg-emerald-600",
  },
  RESERVA: {
    label: "Reservas",
    icon: Lock,
    color: "text-stone-700",
    bgColor: "bg-stone-50",
    barraColor: "bg-stone-600",
  },
  ACCESO: {
    label: "Accesos",
    icon: KeyRound,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    barraColor: "bg-indigo-500",
  },
};

function getTipo(tipo: string): TipoNotificacion | "OTRO" {
  if (tipo in CONFIG_TIPOS) return tipo as TipoNotificacion;
  return "OTRO";
}

const CONFIG_OTRO: ConfigTipo = {
  label: "Otros",
  icon: Info,
  color: "text-stone-500",
  bgColor: "bg-stone-50",
  barraColor: "bg-stone-400",
};

export function CampanaNotificaciones() {
  const [abierta, setAbierta] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState<
    TipoNotificacion | "todas" | "noLeidas"
  >("todas");
  const queryClient = useQueryClient();

  const { data: bandeja } = useQuery({
    queryKey: ["bandeja"],
    queryFn: notificacionService.getBandeja,
    refetchInterval: abierta ? false : 30000,
  });

  const leerMutation = useMutation({
    mutationFn: notificacionService.leer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bandeja"] }),
  });

  const leerTodasMutation = useMutation({
    mutationFn: notificacionService.leerTodas,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bandeja"] }),
  });

  const items = bandeja?.items ?? [];
  const noLeidas = bandeja?.noLeidas ?? 0;

  const conteoPorTipo = useMemo(() => {
    const conteo: Record<string, number> = {};
    for (const item of items) {
      const t = getTipo(item.tipo);
      if (!item.leido) {
        conteo[t] = (conteo[t] ?? 0) + 1;
      }
    }
    return conteo;
  }, [items]);

  const itemsFiltrados = useMemo(() => {
    if (filtroActivo === "todas") return items;
    if (filtroActivo === "noLeidas") return items.filter((i) => !i.leido);
    return items.filter((i) => getTipo(i.tipo) === filtroActivo);
  }, [items, filtroActivo]);

  const bandejas: Array<{
    id: TipoNotificacion | "todas" | "noLeidas";
    label: string;
    count: number;
    icon?: typeof Bell;
    color?: string;
  }> = [
    { id: "todas", label: "Todas", count: items.length },
    { id: "noLeidas", label: "Sin leer", count: noLeidas },
    ...(Object.keys(CONFIG_TIPOS) as TipoNotificacion[])
      .filter(
        (t) =>
          (conteoPorTipo[t] ?? 0) > 0 ||
          items.some((i) => getTipo(i.tipo) === t),
      )
      .map((t) => ({
        id: t,
        label: CONFIG_TIPOS[t].label,
        count: conteoPorTipo[t] ?? 0,
        icon: CONFIG_TIPOS[t].icon,
        color: CONFIG_TIPOS[t].color,
      })),
  ];

  return (
    <div className="relative">
      {/* Botón campana */}
      <button
        onClick={() => setAbierta(!abierta)}
        className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {noLeidas > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={noLeidas}
            className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 grid place-items-center bg-rose-500 text-white text-[10px] font-bold rounded-full"
          >
            {noLeidas > 99 ? "99+" : noLeidas}
          </motion.span>
        )}
      </button>

      {/* Panel desplegable */}
      <AnimatePresence>
        {abierta && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setAbierta(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-stone-100">
                <h3 className="font-serif text-base text-stone-900">
                  Notificaciones
                </h3>
                {noLeidas > 0 && (
                  <button
                    onClick={() => leerTodasMutation.mutate()}
                    disabled={leerTodasMutation.isPending}
                    className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-50"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Marcar todas
                  </button>
                )}
              </div>

              {/* Bandejas por tipo */}
              <div className="flex gap-1 p-2 border-b border-stone-100 overflow-x-auto scrollbar-none">
                {bandejas.map((b) => {
                  const Icon = b.icon;
                  const activo = filtroActivo === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setFiltroActivo(b.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                        activo
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`w-3 h-3 ${activo ? "" : (b.color ?? "")}`}
                        />
                      )}
                      {b.label}
                      {b.count > 0 && (
                        <span
                          className={`px-1 rounded-full text-[9px] ${
                            activo ? "bg-white/20" : "bg-stone-200"
                          }`}
                        >
                          {b.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lista de notificaciones */}
              <div className="max-h-96 overflow-y-auto">
                {itemsFiltrados.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm text-stone-500">
                      No hay notificaciones
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-stone-100">
                    {itemsFiltrados.map((item) => {
                      const tipo = getTipo(item.tipo);
                      const config =
                        tipo === "OTRO" ? CONFIG_OTRO : CONFIG_TIPOS[tipo];
                      const Icon = config.icon;
                      return (
                        <li
                          key={item.idNotificacion}
                          className={`relative p-3 hover:bg-stone-50 transition-colors ${!item.leido ? config.bgColor : ""}`}
                        >
                          {/* Barra lateral de color */}
                          {!item.leido && (
                            <div
                              className={`absolute left-0 top-0 bottom-0 w-1 ${config.barraColor}`}
                            />
                          )}

                          <div className="flex gap-3 pl-1">
                            {/* Icono del tipo */}
                            <div
                              className={`shrink-0 w-8 h-8 rounded-full grid place-items-center ${config.bgColor} ${config.color}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-snug ${!item.leido ? "font-semibold text-stone-900" : "text-stone-600"}`}
                              >
                                {item.mensaje}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-stone-400 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatearFecha(item.fechaEnvio)}
                                </span>
                                {!item.leido && (
                                  <button
                                    onClick={() =>
                                      leerMutation.mutate(item.idNotificacion)
                                    }
                                    className="text-[10px] text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-0.5"
                                  >
                                    <Check className="w-3 h-3" />
                                    Marcar
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
