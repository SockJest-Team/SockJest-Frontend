"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useProcesarPago } from "../hooks/useProcesarPago";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearMoneda } from "@/utils/formatters";
import type { PagoResumen, MetodoPago } from "@/api/services/pagoService";

const BANCOS_PSE = [
  "Bancolombia",
  "Banco de Bogotá",
  "Davivienda",
  "BBVA",
  "Banco Agrario",
  "Nu",
];

interface PropsCheckoutModal {
  pago: PagoResumen | null;
  onCerrar: () => void;
}

export function CheckoutModal({ pago, onCerrar }: PropsCheckoutModal) {
  const [metodo, setMetodo] = useState<MetodoPago>("tarjeta");
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    cvv: "",
    expiracion: "",
    nombre: "",
  });
  const [banco, setBanco] = useState(BANCOS_PSE[0]);
  const [celular, setCelular] = useState("");

  const procesar = useProcesarPago();
  const [pagoExitoso, setPagoExitoso] = useState(false);

  const CLASE_INPUT =
    "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 text-sm " +
    "focus:outline-none focus:border-stone-900 transition-colors rounded-none";

  function confirmarPago() {
    if (!pago) return;

    const payload = {
      metodo,
      ...(metodo === "tarjeta" && {
        numeroTarjeta: tarjeta.numero.replace(/\s/g, ""),
        cvv: tarjeta.cvv,
        expiracion: tarjeta.expiracion,
        nombreTitular: tarjeta.nombre,
      }),
      ...(metodo === "pse" && { banco }),
      ...(metodo === "nequi" && { celular }),
    };

    procesar.mutate(
      { idPago: pago.idPago, payload },
      {
        onSuccess: (r) => {
          setPagoExitoso(true);
          toast.success(r.mensaje ?? "¡Pago confirmado!");
        },
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  const procesando = procesar.isPending;

  return (
    <AnimatePresence>
      {pago && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !procesando && onCerrar()}
            className="fixed inset-0 bg-stone-900/50 z-40"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[8vh] md:inset-x-0 md:mx-auto max-w-lg
                       bg-white border border-stone-200 shadow-2xl z-50 max-h-[84vh] overflow-y-auto"
          >
            <div className="bg-stone-900 text-white p-6 sticky top-0">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">
                  LIVEBID &middot; CHECKOUT
                </span>
                <button
                  onClick={() => !procesando && onCerrar()}
                  className="text-stone-400 hover:text-white text-lg"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-stone-400 mt-4">
                Pagando:
              </p>
              <p className="text-2xl font-serif text-white">
                {pago.tituloSubasta}
              </p>
              <p className="text-4xl font-serif font-semibold text-white tabular-nums mt-1">
                {formatearMoneda(pago.monto)}
              </p>
            </div>

            {pagoExitoso ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full grid place-items-center">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-serif font-normal text-stone-900">
                  ¡Pago confirmado!
                </h3>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  El subastador fue notificado y recibirán ambos un correo de
                  confirmación. Coordinarán el envío según la política del lote.
                </p>
                {pago.politicaEnvio && (
                  <p className="text-xs font-mono uppercase tracking-widest text-stone-500 bg-stone-50 p-3">
                    Envío: {pago.politicaEnvio}
                  </p>
                )}
                <button
                  onClick={onCerrar}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white
                             font-mono text-[11px] uppercase tracking-widest transition-colors"
                >
                  Ver mis pagos
                </button>
              </div>
            ) : (
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  {(["tarjeta", "pse", "nequi"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetodo(m)}
                      disabled={procesando}
                      className={`p-3 border text-center transition-colors ${
                        metodo === m
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider block">
                        {m === "tarjeta" ? "💳" : m === "pse" ? "🏦" : "📱"}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        {m === "tarjeta"
                          ? "Tarjeta"
                          : m === "pse"
                            ? "PSE"
                            : "Nequi"}
                      </span>
                    </button>
                  ))}
                </div>

                {metodo === "tarjeta" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                        Número de tarjeta
                      </label>
                      <input
                        value={tarjeta.numero}
                        onChange={(e) => {
                          const v = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16);
                          setTarjeta({
                            ...tarjeta,
                            numero: v.replace(/(\d{4})(?=\d)/g, "$1 "),
                          });
                        }}
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        className={CLASE_INPUT}
                        disabled={procesando}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                          Expiración (MM/AA)
                        </label>
                        <input
                          value={tarjeta.expiracion}
                          onChange={(e) => {
                            let v = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            if (v.length > 2)
                              v = `${v.slice(0, 2)}/${v.slice(2)}`;
                            setTarjeta({ ...tarjeta, expiracion: v });
                          }}
                          placeholder="12/28"
                          className={CLASE_INPUT}
                          disabled={procesando}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                          CVV
                        </label>
                        <input
                          value={tarjeta.cvv}
                          onChange={(e) =>
                            setTarjeta({
                              ...tarjeta,
                              cvv: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                          inputMode="numeric"
                          placeholder="123"
                          className={CLASE_INPUT}
                          disabled={procesando}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                        Nombre del titular
                      </label>
                      <input
                        value={tarjeta.nombre}
                        onChange={(e) =>
                          setTarjeta({ ...tarjeta, nombre: e.target.value })
                        }
                        placeholder="Como aparece en la tarjeta"
                        className={CLASE_INPUT}
                        disabled={procesando}
                      />
                    </div>
                  </div>
                )}

                {metodo === "pse" && (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                      Selecciona tu banco
                    </label>
                    <select
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      className={CLASE_INPUT + " cursor-pointer"}
                      disabled={procesando}
                    >
                      {BANCOS_PSE.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-stone-400 font-light mt-2">
                      Serás redirigido al portal de tu banco para autorizar el
                      débito.
                    </p>
                  </div>
                )}

                {metodo === "nequi" && (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                      Celular asociado a Nequi
                    </label>
                    <input
                      value={celular}
                      onChange={(e) =>
                        setCelular(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      inputMode="numeric"
                      placeholder="3001234567"
                      className={CLASE_INPUT}
                      disabled={procesando}
                    />
                    <p className="text-xs text-stone-400 font-light mt-2">
                      Recibirás una notificación en tu app Nequi para aprobar el
                      pago.
                    </p>
                  </div>
                )}

                <button
                  onClick={confirmarPago}
                  disabled={procesando}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-60
                             text-white font-mono text-xs uppercase tracking-widest
                             transition-colors"
                >
                  {procesando ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando pago…
                    </span>
                  ) : (
                    `Pagar ${formatearMoneda(pago.monto)}`
                  )}
                </button>

                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-400 text-center leading-relaxed">
                  Transacción segura &middot; Al confirmar aceptas los términos
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
