"use client";

import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEstadisticas } from "../hooks/useEstadisticas";
import { formatearMoneda } from "@/utils/formatters";

const COLORES = ["#1c1917", "#78716c", "#a8a29e", "#d6d3d1", "#57534e"];

function ContadorAnimado({
  valor,
  prefijo = "",
}: {
  valor: number;
  prefijo?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefijo}
      {new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(
        valor,
      )}
    </motion.span>
  );
}

const formatMonedaTooltip = (value: unknown) => formatearMoneda(Number(value));

export function DashboardView() {
  const { data, isPending, isError } = useEstadisticas();

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 text-stone-400">
        Cargando estadísticas...
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

  const totalSubastas = data?.totalSubastas ?? 0;
  const totalVentas = data?.totalVentas ?? 0;
  const comision = data?.comision ?? 0;
  const totalGanado = data?.totalGanado ?? 0;
  const promedioVenta = data?.promedioVenta ?? 0;

  const tarjetas = [
    {
      etiqueta: "Subastas Finalizadas",
      valor: totalSubastas,
      tipo: "numero" as const,
    },
    {
      etiqueta: "Ingresos Totales",
      valor: totalVentas,
      tipo: "moneda" as const,
    },
    {
      etiqueta: "Promedio Venta",
      valor: promedioVenta,
      tipo: "moneda" as const,
    },
    { etiqueta: "Ventas Brutas", valor: totalVentas, tipo: "moneda" as const },
    {
      etiqueta: "Comisión Plataforma (5%)",
      valor: comision,
      tipo: "moneda" as const,
    },
  ];

  const barData = [
    { name: "Ventas", valor: totalVentas },
    { name: "Ganado", valor: totalGanado },
    { name: "Comisión", valor: comision },
    { name: "Promedio", valor: promedioVenta },
  ];

  const pieData = [
    { name: "Ganado (neto)", valor: totalGanado },
    { name: "Comisión", valor: comision },
  ];

  return (
    <div className="bg-stone-50 min-h-[70vh] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light text-stone-900 mb-2"
        >
          Mis Estadísticas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-stone-500 text-sm mb-10"
        >
          Resumen de tu actividad como subastador
        </motion.p>

        {/* Tarjetas con contadores animados */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {tarjetas.map((t, i) => (
            <motion.div
              key={t.etiqueta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                {t.etiqueta}
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mt-2">
                {t.tipo === "moneda" ? (
                  <ContadorAnimado valor={t.valor} prefijo="$" />
                ) : (
                  <ContadorAnimado valor={t.valor} />
                )}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-stone-500 mb-4">
              Comparativo de métricas
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#78716c" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#78716c" }}
                  tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={formatMonedaTooltip}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e7e5e4",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="valor"
                  fill="#1c1917"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-stone-500 mb-4">
              Distribución de ingresos
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="valor"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry: any) =>
                    `${entry.name}: ${formatearMoneda(Number(entry.valor))}`
                  }
                  labelLine={false}
                  animationDuration={800}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatMonedaTooltip} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
