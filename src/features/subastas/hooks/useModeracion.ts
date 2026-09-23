import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moderacionService } from "@/api/services/moderacionService";

export function useEstadisticasModeracion() {
  return useQuery({
    queryKey: ["moderacion", "estadisticas"],
    queryFn: moderacionService.getEstadisticas,
    refetchInterval: 30000,
  });
}

export function useSubastasReportadas() {
  return useQuery({
    queryKey: ["moderacion", "reportadas"],
    queryFn: moderacionService.getReportadas,
  });
}

export function useSuspenderSubasta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      idSubasta,
      motivo,
    }: {
      idSubasta: string;
      motivo: string;
    }) => moderacionService.suspender(idSubasta, motivo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moderacion"] });
      qc.invalidateQueries({ queryKey: ["subastas"] });
    },
  });
}

export function useReactivarSubasta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idSubasta: string) => moderacionService.reactivar(idSubasta),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moderacion"] });
      qc.invalidateQueries({ queryKey: ["subastas"] });
    },
  });
}
