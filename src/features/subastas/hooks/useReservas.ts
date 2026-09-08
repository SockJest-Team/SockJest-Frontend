import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservaService } from "@/api/services/reservaService";

export function useMisReservas() {
  return useQuery({
    queryKey: ["reservas", "mias"],
    queryFn: reservaService.misSolicitudes,
    refetchInterval: 15_000,
  });
}

export function useResponderReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      idReserva,
      aprobar,
    }: {
      idReserva: string;
      aprobar: boolean;
    }) => reservaService.responder(idReserva, aprobar),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}

export function useMiAcceso(idSubasta: string, enabled: boolean) {
  return useQuery({
    queryKey: ["reservas", "mi-acceso", idSubasta],
    queryFn: () => reservaService.miEstado(idSubasta),
    enabled,
    refetchInterval: 10_000,
  });
}

export function useSolicitarAcceso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservaService.solicitar,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}

export function useInvitar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      idSubasta,
      correo,
    }: {
      idSubasta: string;
      correo: string;
    }) => reservaService.invitar(idSubasta, correo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}
