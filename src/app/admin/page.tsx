"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Package,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Flag,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useEstadisticasModeracion } from "@/features/subastas/hooks/useModeracion";

function StatCard({
  label,
  valor,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  valor: number;
  icon: typeof Package;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-3xl font-bold text-stone-900 tabular-nums">
        {valor}
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-20 bg-stone-200 rounded" />
        <div className="h-4 w-4 bg-stone-200 rounded" />
      </div>
      <div className="h-8 w-12 bg-stone-200 rounded" />
    </div>
  );
}

export default function AdminResumenPage() {
  const { data, isPending } = useEstadisticasModeracion();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-serif text-stone-900">Resumen general</h1>
        <p className="text-sm text-stone-500 mt-1">
          Estado actual de la plataforma ·{" "}
          {new Date().toLocaleDateString("es-CO", { dateStyle: "full" })}
        </p>
      </motion.div>

      {/* KPIs de moderación */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-4">
          Moderación
        </h2>
        {isPending || !data ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Pendientes"
              valor={data.pendientes}
              icon={Package}
              color="text-amber-600"
              delay={0}
            />
            <StatCard
              label="Activas"
              valor={data.activas}
              icon={Play}
              color="text-emerald-600"
              delay={0.05}
            />
            <StatCard
              label="Suspendidas"
              valor={data.suspendidas}
              icon={Pause}
              color="text-rose-600"
              delay={0.1}
            />
            <StatCard
              label="Aprobadas"
              valor={data.aprobadas}
              icon={CheckCircle2}
              color="text-emerald-600"
              delay={0.15}
            />
            <StatCard
              label="Rechazadas"
              valor={data.rechazadas}
              icon={XCircle}
              color="text-rose-600"
              delay={0.2}
            />
            <StatCard
              label="Finalizadas"
              valor={data.finalizadas}
              icon={CheckCircle2}
              color="text-stone-600"
              delay={0.25}
            />
            <StatCard
              label="Reportes pend."
              valor={data.reportesPendientes}
              icon={Flag}
              color="text-orange-600"
              delay={0.3}
            />
            <StatCard
              label="Total"
              valor={data.total}
              icon={TrendingUp}
              color="text-stone-900"
              delay={0.35}
            />
          </div>
        )}
      </div>

      {/* Atajos rápidos */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-4">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/admin/moderacion"
              className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 grid place-items-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-stone-900">
                    Moderar subastas
                  </h3>
                  <p className="text-xs text-stone-400">
                    Revisar lotes pendientes
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Link
              href="/admin/apelaciones"
              className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 grid place-items-center">
                  <Flag className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-stone-900">
                    Revisar apelaciones
                  </h3>
                  <p className="text-xs text-stone-400">
                    Suspensiones en apelación
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/admin/usuarios"
              className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-stone-900">
                    Gestionar usuarios
                  </h3>
                  <p className="text-xs text-stone-400">
                    Ver y administrar cuentas
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Link
              href="/admin/pagos"
              className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-items-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-stone-900">Pagos</h3>
                  <p className="text-xs text-stone-400">
                    Transacciones de la plataforma
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/admin/categorias"
              className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-violet-100 grid place-items-center">
                  <Package className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-stone-900">
                    Categorías
                  </h3>
                  <p className="text-xs text-stone-400">Gestionar catálogo</p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Link
              href="/admin/historial"
              className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-stone-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-stone-100 grid place-items-center">
                  <TrendingUp className="w-5 h-5 text-stone-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-stone-900">
                    Historial
                  </h3>
                  <p className="text-xs text-stone-400">
                    Registro de cambios de estado
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
