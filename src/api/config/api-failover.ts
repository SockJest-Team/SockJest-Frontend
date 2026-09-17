const PRINCIPAL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const RESPALDO = process.env.NEXT_PUBLIC_API_URL_BACKUP ?? PRINCIPAL;

const WS_PRINCIPAL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";
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
    if (!res.ok) return false;
    const contentType = res.headers.get("content-type") ?? "";
    return contentType.includes("application/json");
  } catch {
    return false;
  }
}

export async function verificarApiAlArrancar(): Promise<void> {
  if (modo === "principal") {
    const azureVive = await ping(PRINCIPAL);
    if (!azureVive) {
      await new Promise((r) => setTimeout(r, 3_000));
      const azureVive2 = await ping(PRINCIPAL);
      if (!azureVive2) {
        const renderVive = await ping(RESPALDO);
        if (renderVive) cambio("respaldo");
      }
    }
  }
}

function cambio(nuevo: Modo) {
  if (modo === nuevo) return;
  modo = nuevo;
  window.localStorage.setItem("livebid-api-modo", nuevo);
  notificar();
}

let ultimoFailover = 0;
const COOLDOWN_FAILOVER_MS = 30_000;

export async function failoverPorError(): Promise<boolean> {
  if (modo === "principal") {
    if (Date.now() - ultimoFailover < COOLDOWN_FAILOVER_MS) return false;

    const renderVive = await ping(RESPALDO);
    if (renderVive) {
      ultimoFailover = Date.now();
      cambio("respaldo");
      return true;
    }
    return false;
  }
  return false;
}
