import { axiosClient } from "../config/axiosClient";

export interface VendedorResumen {
  id: string;
  nombre: string;
  reputacion: { promedio: number; total: number };
}

export interface VendedoresRespuesta {
  items: VendedorResumen[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const vendedorService = {
  getAll: async (
    buscar?: string,
    page = 1,
    limit = 12,
  ): Promise<VendedoresRespuesta> => {
    const params = new URLSearchParams();
    if (buscar) params.set("buscar", buscar);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const { data } = await axiosClient.get<VendedoresRespuesta>(
      `/vendedores?${params.toString()}`,
    );
    return data;
  },

  getPerfil: async (id: string) => {
    const { data } = await axiosClient.get(`/vendedores/${id}`);
    return data;
  },
};
