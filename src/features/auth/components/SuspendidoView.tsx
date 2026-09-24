"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosClient } from "@/api/config/axiosClient";

export function SuspendidoView() {
  const router = useRouter();
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarApelacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) return;
    setLoading(true);
    try {
      await axiosClient.post("/apelaciones", { motivo });
      toast.success("Apelación enviada. Un administrador la revisará.");
      setMotivo("");
      setTimeout(() => router.push("/auth?mode=login"), 2000);
    } catch {
      toast.error("No se pudo enviar la apelación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-stone-50 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
        <h1 className="text-2xl font-serif text-stone-900 mb-2">
          Cuenta Suspendida
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          Tu cuenta ha sido suspendida. Si crees que es un error, puedes enviar
          una apelación para que un administrador la revise.
        </p>
        <form onSubmit={enviarApelacion} className="space-y-4">
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={4}
            placeholder="Explica por qué debería ser reactivada tu cuenta..."
            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-stone-900 resize-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-mono rounded-lg hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar Apelación"}
          </button>
        </form>
      </div>
    </div>
  );
}
