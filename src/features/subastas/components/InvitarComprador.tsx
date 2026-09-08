"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMisSubastas } from "../hooks/useMisSubastas";
import { useInvitar } from "../hooks/useReservas";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";

const CLASE_INPUT =
  "flex-1 bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm " +
  "focus:outline-none focus:border-stone-900 rounded-full";

export function InvitarComprador() {
  const { data: subastas } = useMisSubastas();
  const invitar = useInvitar();
  const [idSubasta, setIdSubasta] = useState("");
  const [correo, setCorreo] = useState("");

  const candidatas = (subastas ?? []).filter(
    (s) => s.esPrivada || s.requiereReserva,
  );

  if (candidatas.length === 0) return null;

  function enviar() {
    if (!idSubasta) {
      toast.error("Selecciona una subasta.");
      return;
    }
    if (!correo.trim()) {
      toast.error("Escribe el correo del invitado.");
      return;
    }
    invitar.mutate(
      { idSubasta, correo },
      {
        onSuccess: (r: { mensaje: string }) => {
          toast.success(r.mensaje);
          setCorreo("");
        },
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  return (
    <section className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
          Invitar comprador
        </h2>
        <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase tracking-wider">
          Acceso inmediato por correo a tus salas privadas o con reserva
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={idSubasta}
          onChange={(e) => setIdSubasta(e.target.value)}
          className={CLASE_INPUT}
        >
          <option value="">Selecciona subasta…</option>
          {candidatas.map((s) => (
            <option key={s.idSubasta} value={s.idSubasta}>
              {s.titulo}
            </option>
          ))}
        </select>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="comprador@correo.com"
          className={CLASE_INPUT}
        />
        <button
          onClick={enviar}
          disabled={invitar.isPending}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-mono
                     text-[10px] uppercase tracking-widest rounded-full
                     disabled:opacity-50 shrink-0"
        >
          {invitar.isPending ? "..." : "Invitar"}
        </button>
      </div>
    </section>
  );
}
