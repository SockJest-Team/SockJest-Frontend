import { axiosClient } from "../config/axiosClient";

export interface SolicitudReserva {
  idReserva: string;
  idSubasta: string;
  tituloSubasta: string;
  estado: string;
  fechaSolicitud: string;
  comprador: { id: string; nombre: string; correo: string };
}

export interface RespuestaReserva {
  idReserva: string;
  estado: string;
  mensaje: string;
}

export const reservaService = {
  solicitar: async (idSubasta: string): Promise<{ mensaje: string }> => {
    const { data } = await axiosClient.post<{ mensaje: string }>(
      `/mis-reservas/solicitar/${idSubasta}`,
    );
    return data;
  },

  invitar: async (
    idSubasta: string,
    correo: string,
  ): Promise<{ mensaje: string }> => {
    const { data } = await axiosClient.post<{ mensaje: string }>(
      "/mis-reservas/invitar",
      { idSubasta, correo },
    );
    return data;
  },

  misSolicitudes: async (): Promise<SolicitudReserva[]> => {
    const { data } = await axiosClient.get<SolicitudReserva[]>("/mis-reservas");
    return data;
  },

  responder: async (
    idReserva: string,
    aprobar: boolean,
  ): Promise<RespuestaReserva> => {
    const { data } = await axiosClient.patch<RespuestaReserva>(
      `/mis-reservas/${idReserva}/responder`,
      { aprobar },
    );
    return data;
  },

  miEstado: async (idSubasta: string): Promise<{ estado: string | null }> => {
    const { data } = await axiosClient.get<{ estado: string | null }>(
      `/mis-reservas/estado/${idSubasta}`,
    );
    return data;
  },
};
