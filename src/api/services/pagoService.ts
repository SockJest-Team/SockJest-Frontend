import { axiosClient } from "../config/axiosClient";

export type MetodoPago = "tarjeta" | "pse" | "nequi";

export interface PagoResumen {
  idPago: string;
  idSubasta: string;
  tituloSubasta: string;
  monto: string;
  estado: "Pendiente" | "Pagado" | "Vencido";
  fechaLimite: string;
  fechaPago: string | null;
  referenciaPasarela: string | null;
  politicaEnvio: string;
}

export interface PayloadProcesarPago {
  metodo: MetodoPago;
  numeroTarjeta?: string;
  cvv?: string;
  expiracion?: string;
  nombreTitular?: string;
  banco?: string;
  celular?: string;
  cuotas?: number;
}

export const pagoService = {
  getMisPagos: async (): Promise<PagoResumen[]> => {
    const { data } = await axiosClient.get<PagoResumen[]>("/pagos/mios");
    return data;
  },

  getById: async (id: string): Promise<PagoResumen> => {
    const { data } = await axiosClient.get<PagoResumen>(`/pagos/${id}`);
    return data;
  },

  procesar: async (
    idPago: string,
    payload: PayloadProcesarPago,
  ): Promise<PagoResumen & { metodo: string; mensaje: string }> => {
    const { data } = await axiosClient.post(
      `/pagos/${idPago}/procesar`,
      payload,
    );
    return data;
  },
};
