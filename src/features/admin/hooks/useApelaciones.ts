import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apelacionService } from "@/api/services/apelacionService";

export function useApelaciones() {
  return useQuery({
    queryKey: ["apelaciones"],
    queryFn: apelacionService.getAll,
  });
}

export function useResolverApelacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      estado,
    }: {
      id: string;
      estado: "Aprobada" | "Rechazada";
    }) => apelacionService.resolver(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apelaciones"] }),
  });
}
