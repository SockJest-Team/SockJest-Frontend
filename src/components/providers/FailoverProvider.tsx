"use client";

import { useEffect, useState } from "react";
import {
  verificarApiAlArrancar,
  suscribirModo,
} from "@/api/config/api-failover";

export function FailoverProvider({ children }: { children: React.ReactNode }) {
  const [enRespaldo, setEnRespaldo] = useState(false);

  useEffect(() => {
    void verificarApiAlArrancar();
    return suscribirModo((modo) => setEnRespaldo(modo === "respaldo"));
  }, []);

  return (
    <>
      {children}
      {enRespaldo && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]
                        bg-amber-50 border border-amber-600 border-l-4 px-4 py-2
                        rounded-full shadow-lg"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-amber-700">
            ⚠ Operando en servidor de respaldo
          </p>
        </div>
      )}
    </>
  );
}
