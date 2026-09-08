import { axiosClient } from "../config/axiosClient";

export interface ReputacionVendedor {
  promedio: number;
  total: number;
}

export interface VendedorResumen {
  id: string;
  nombre: string;
  reputacion: ReputacionVendedor;
}

export interface SubastaVendedor {
  idSubasta: string;
  titulo: string;
  estado: string;
  precioBase: string;
  fechaFin: string;
  categoria: string | null;
  imagen: string | null;
}

export interface CalificacionVendedor {
  puntuacion: number;
  comentario: string | null;
  fecha: string;
  comprador: string;
}

export interface PerfilVendedor {
  id: string;
  nombre: string;
  desde: string;
  reputacion: ReputacionVendedor;
  subastasActivas: number;
  subastas: SubastaVendedor[];
  calificaciones: CalificacionVendedor[];
}

export const vendedorService = {
  getAll: async (buscar?: string): Promise<VendedorResumen[]> => {
    const { data } = await axiosClient.get<VendedorResumen[]>("/vendedores", {
      params: buscar ? { buscar } : {},
    });
    return data;
  },

  getPerfil: async (id: string): Promise<PerfilVendedor> => {
    const { data } = await axiosClient.get<PerfilVendedor>(`/vendedores/${id}`);
    return data;
  },
};
