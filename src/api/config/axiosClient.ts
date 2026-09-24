import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { traducirError } from "@/utils/helpers/error-messages";
import { getUrlApi, failoverPorError } from "./api-failover";

export const axiosClient = axios.create({
  baseURL: getUrlApi(),
  timeout: 20_000,
});

let redirigiendoALogin = false;

axiosClient.interceptors.request.use((config) => {
  config.baseURL = getUrlApi();
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _reintentado?: boolean })
      | undefined;

    (error as AxiosError & { mensajeUsuario?: string }).mensajeUsuario =
      traducirError(error);

    const esRutaAuth = original?.url?.includes("/auth/");

    if (
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/auth") ||
        window.location.pathname.startsWith("/suspendido"))
    ) {
      return Promise.reject(error);
    }

    const esCaídaDeRed =
      !error.response &&
      original &&
      !original._reintentado &&
      !esRutaAuth &&
      typeof window !== "undefined";

    if (esCaídaDeRed) {
      original._reintentado = true;
      const conmutó = await failoverPorError();
      if (conmutó) {
        original.baseURL = getUrlApi();
        return axiosClient(original);
      }
    }

    if (
      error.response?.status === 401 &&
      original &&
      !original._reintentado &&
      !esRutaAuth &&
      typeof window !== "undefined"
    ) {
      original._reintentado = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${getUrlApi()}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          useAuthStore
            .getState()
            .actualizarTokens(data.access_token, data.refresh_token);

          original.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosClient(original);
        } catch {
          const errorData = error.response?.data as
            | { code?: string }
            | undefined;
          const errorCode = errorData?.code;
          useAuthStore.getState().logout();
          if (!redirigiendoALogin) {
            redirigiendoALogin = true;
            if (errorCode === "CUENTA_BLOQUEADA") {
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/suspendido";
            } else {
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/auth?mode=login";
            }
          }
          return Promise.reject(error);
        }
      }
    }

    if (
      error.response?.status === 401 &&
      !esRutaAuth &&
      typeof window !== "undefined"
    ) {
      const errorData = error.response?.data as { code?: string } | undefined;
      const errorCode = errorData?.code;
      useAuthStore.getState().logout();
      if (!redirigiendoALogin) {
        redirigiendoALogin = true;
        if (errorCode === "CUENTA_BLOQUEADA") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/suspendido";
        } else {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/auth?mode=login";
        }
      }
    }

    return Promise.reject(error);
  },
);
