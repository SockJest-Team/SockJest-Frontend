import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { vendedorService } from "@/api/services/vendedorService";

export function useVendedores(buscar: string) {
  return useInfiniteQuery({
    queryKey: ["vendedores", "lista", buscar],
    queryFn: ({ pageParam = 1 }) =>
      vendedorService.getAll(buscar || undefined, pageParam, 12),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function usePerfilVendedor(id: string | undefined) {
  return useQuery({
    queryKey: ["vendedores", "perfil", id],
    queryFn: () => vendedorService.getPerfil(id!),
    enabled: Boolean(id),
  });
}
