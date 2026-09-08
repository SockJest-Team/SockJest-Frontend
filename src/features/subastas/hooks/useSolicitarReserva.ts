import { useMutation } from "@tanstack/react-query";
import { reservaService } from "@/api/services/reservaService";

export function useSolicitarReserva() {
  return useMutation({
    mutationFn: (idSubasta: string) => reservaService.solicitar(idSubasta),
  });
}
