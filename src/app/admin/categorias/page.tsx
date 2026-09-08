"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriaService } from "@/api/services/categoriaService";
import { ConfirmacionModal } from "@/components/ui/ConfirmacionModal";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import type { Categoria } from "@/features/subastas/types";

const CLASE_INPUT =
  "flex-1 bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm " +
  "focus:outline-none focus:border-stone-900 rounded-full";

export default function AdminCategoriasPage() {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [categoriaAEliminar, setCategoriaAEliminar] =
    useState<Categoria | null>(null);

  const { data: categorias, isPending } = useQuery({
    queryKey: ["categorias"],
    queryFn: categoriaService.getAll,
  });

  const crear = useMutation({
    mutationFn: () =>
      categoriaService.create({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Categoría creada");
      setNombre("");
      setDescripcion("");
      void queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (e) => toast.error(obtenerMensajeError(e)),
  });

  const actualizar = useMutation({
    mutationFn: (cat: Categoria) =>
      categoriaService.update(cat.idCategoria, { nombre: editNombre.trim() }),
    onSuccess: () => {
      toast.success("Categoría actualizada");
      setEditando(null);
      void queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (e) => toast.error(obtenerMensajeError(e)),
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => categoriaService.remove(id),
    onSuccess: () => {
      toast.success("Categoría eliminada");
      void queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: (e) => toast.error(obtenerMensajeError(e)),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-stone-900">
        Gestión de Categorías
      </h1>

      {/* Crear */}
      <section className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
          Nueva categoría
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre (ej. Arte, Tecnología…)"
            maxLength={80}
            className={CLASE_INPUT}
          />
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            className={CLASE_INPUT}
          />
          <button
            onClick={() => {
              if (!nombre.trim()) {
                toast.error("Escribe el nombre de la categoría.");
                return;
              }
              crear.mutate();
            }}
            disabled={crear.isPending}
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white
                       font-mono text-[10px] uppercase tracking-widest rounded-full
                       disabled:opacity-50 shrink-0"
          >
            {crear.isPending ? "..." : "Crear"}
          </button>
        </div>
      </section>

      {/* Lista */}
      <section className="bg-white border border-stone-200 rounded-3xl shadow-sm divide-y divide-stone-100">
        {isPending && <p className="p-6 text-stone-400">Cargando…</p>}
        {categorias?.map((c) => (
          <div
            key={c.idCategoria}
            className="p-4 flex flex-wrap items-center gap-3"
          >
            {editando?.idCategoria === c.idCategoria ? (
              <>
                <input
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="flex-1 min-w-40 bg-stone-50 border border-stone-200 px-4 py-2
                             text-sm focus:outline-none focus:border-stone-900 rounded-full"
                  autoFocus
                />
                <button
                  onClick={() => actualizar.mutate(c)}
                  disabled={actualizar.isPending}
                  className="px-5 py-2 bg-stone-900 text-white font-mono
                             text-[9px] uppercase tracking-widest rounded-full"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditando(null)}
                  className="px-5 py-2 border border-stone-300 text-stone-600 font-mono
                             text-[9px] uppercase tracking-widest rounded-full"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="font-serif text-lg text-stone-900 flex-1">
                  {c.nombre}
                </span>
                <button
                  onClick={() => {
                    setEditando(c);
                    setEditNombre(c.nombre);
                  }}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-mono
                             text-[9px] uppercase tracking-widest rounded-full
                             hover:border-stone-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => setCategoriaAEliminar(c)}
                  disabled={eliminar.isPending}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-mono
                             text-[9px] uppercase tracking-widest rounded-full
                             hover:border-red-700 hover:text-red-700"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ))}
        {!isPending && categorias?.length === 0 && (
          <p className="p-6 text-stone-400">Sin categorías.</p>
        )}
      </section>

      {/* modal de confirmacion*/}
      <ConfirmacionModal
        abierto={categoriaAEliminar !== null}
        titulo="¿Eliminar categoría?"
        mensaje={`Se eliminará «${categoriaAEliminar?.nombre ?? ""}». Las subastas que la usen podrían quedar sin clasificar. Esta acción no se puede deshacer.`}
        confirmarTexto="Eliminar categoría"
        cancelarTexto="Conservar"
        peligro
        cargando={eliminar.isPending}
        cargandoTexto="Eliminando…"
        onCancelar={() => setCategoriaAEliminar(null)}
        onConfirmar={() => {
          if (categoriaAEliminar) {
            eliminar.mutate(categoriaAEliminar.idCategoria, {
              onSettled: () => setCategoriaAEliminar(null),
            });
          }
        }}
      />
    </div>
  );
}
