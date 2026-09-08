import { useQuery } from "@tanstack/react-query";
import { pagoService } from "@/api/services/pagoService";

export function useMisPagos() {
  return useQuery({
    queryKey: ["pagos", "mios"],
    queryFn: pagoService.getMisPagos,
    refetchInterval: 60_000,
  });
}
