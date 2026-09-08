import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  pagoService,
  type PayloadProcesarPago,
} from "@/api/services/pagoService";

export function useProcesarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      idPago,
      payload,
    }: {
      idPago: string;
      payload: PayloadProcesarPago;
    }) => pagoService.procesar(idPago, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pagos"] });
    },
  });
}
