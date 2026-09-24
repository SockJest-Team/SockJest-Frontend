import { axiosClient } from "../config/axiosClient";

export interface Apelacion {
  idApelacion: string;
  idUsuario: string;
  motivo: string;
  estado: string;
  fechaCreacion: string;
  idUsuario2?: { nombreCompleto: string; correo: string };
}

export const apelacionService = {
  getAll: async (): Promise<Apelacion[]> => {
    const { data } = await axiosClient.get<Apelacion[]>("/apelaciones");
    return data;
  },

  resolver: async (id: string, estado: "Aprobada" | "Rechazada") => {
    await axiosClient.patch(`/apelaciones/${id}/resolver`, { estado });
  },
};
