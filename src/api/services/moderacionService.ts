import { axiosClient } from "../config/axiosClient";

export interface EstadisticasModeracion {
  aprobadas: number;
  rechazadas: number;
  pendientes: number;
  suspendidas: number;
  activas: number;
  finalizadas: number;
  reportesPendientes: number;
  total: number;
}

export interface ReporteSubasta {
  idReporte: string;
  idSubasta: string;
  idReportador: string;
  motivo: string;
  estado: string;
  fechaCreacion: string;
  idSubasta2?: { titulo: string };
  idReportador2?: { nombreCompleto: string; correo: string };
}

export const moderacionService = {
  getEstadisticas: async (): Promise<EstadisticasModeracion> => {
    const { data } = await axiosClient.get<EstadisticasModeracion>(
      "/subastas/moderacion/estadisticas",
    );
    return data;
  },

  getReportadas: async (): Promise<ReporteSubasta[]> => {
    const { data } = await axiosClient.get<ReporteSubasta[]>(
      "/subastas/moderacion/reportadas",
    );
    return data;
  },

  suspender: async (idSubasta: string, motivo: string) => {
    await axiosClient.patch(`/subastas/${idSubasta}/suspender`, { motivo });
  },

  reactivar: async (idSubasta: string) => {
    await axiosClient.patch(`/subastas/${idSubasta}/reactivar`);
  },

  reportar: async (idSubasta: string, motivo: string) => {
    await axiosClient.post(`/subastas/${idSubasta}/reportar`, { motivo });
  },
};
