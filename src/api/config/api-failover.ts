const PRINCIPAL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const RESPALDO = process.env.NEXT_PUBLIC_API_URL_BACKUP ?? PRINCIPAL;

const WS_PRINCIPAL = process.env.NEXT_PUBLIC_WS_URL == "http://localhost:4000";
const WS_RESPALDO = process.env.NEXT_PUBLIC_WS_URL_BACKUP ?? WS_PRINCIPAL;

const RUTA_HEALTH = "/subastas?limit=1";
const TIMEOUT_HEALTH = 4_000;

type Modo = "principal" | "respaldo";

let modo: Modo =
  typeof window !== "undefined" &&
  window.localStorage.getItem("livebid-api-modo") === "respaldo"
    ? "respaldo"
    : "principal";

const oyentes = new Set<(modo: Modo) => void>();

export function getUrlApi(): string {
  return modo === "principal" ? PRINCIPAL : RESPALDO;
}

export function getUrlWs(): string {
  return modo === "principal" ? WS_PRINCIPAL : WS_RESPALDO;
}

export function getModo(): Modo {
  return modo;
}

export function suscribirModo(cb: (modo: Modo) => void): () => void {
  oyentes.add(cb);
  return () => oyentes.delete(cb);
}

function notificar() {
  oyentes.forEach((cb) => cb(modo));
}

async function ping(urlBase: string): Promise<boolean> {
  try {
    const res = await fetch(`${urlBase}${RUTA_HEALTH}`, {
      signal: AbortSignal.timeout(TIMEOUT_HEALTH),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function verificarApiAlArrancar(): Promise<void> {
  if (modo === "principal") {
    const azureTest = await ping(RESPALDO);
    if (!azureTest) {
      const renderTest = await ping(RESPALDO);
      if (renderTest) cambio("respaldo");
    }
  } else {
    const azureTest = await ping(PRINCIPAL);
    if (azureTest) cambio("principal");
  }
}

function cambio(nuevo: Modo) {
  if (modo === nuevo) return;
  modo = nuevo;
  window.localStorage.setItem("livebid-api-modo", nuevo);
  notificar();
}

export async function failoverPorError(): Promise<boolean> {
  if (modo === "principal") {
    const renderTest = await ping(RESPALDO);
    if (renderTest) {
      cambio("respaldo");
      return true;
    }
    return false;
  }
  return false;
}
