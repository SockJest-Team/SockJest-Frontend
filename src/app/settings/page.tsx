"use client";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-stone-50 py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-[2rem] p-10 shadow-xl"
      >
        <h1 className="text-3xl font-light text-stone-900 mb-8">
          Ajustes de Usuario
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              disabled
              className="w-full bg-stone-100 border border-stone-200 px-4 py-3 text-stone-900 text-sm rounded-2xl cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-2">
              Rol Principal
            </label>
            <input
              type="text"
              defaultValue={user?.roles?.[0] || "Usuario"}
              disabled
              className="w-full bg-stone-100 border border-stone-200 px-4 py-3 text-stone-900 text-sm rounded-2xl cursor-not-allowed"
            />
          </div>
          <button className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-mono rounded-full cursor-pointer transition-colors">
            Guardar Cambios
          </button>
        </div>
      </motion.div>
    </div>
  );
}
