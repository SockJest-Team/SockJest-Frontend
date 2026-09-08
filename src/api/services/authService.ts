import { axiosClient } from "../config/axiosClient";

export interface DatosUsuario {
  id: string;
  nombre: string;
  email: string;
  roles: string[];
}

export interface RespuestaLogin {
  userId: string;
  access_token: string;
  refresh_token: string;
}

export const authService = {
  login: async (
    correo: string,
    contraseña: string,
  ): Promise<RespuestaLogin> => {
    const { data } = await axiosClient.post<RespuestaLogin>("/auth/login", {
      correo,
      contraseña,
    });
    return data;
  },

  register: async (payload: {
    nombre_completo: string;
    correo: string;
    contraseña: string;
    telefono: string;
    rol: string;
  }) => {
    const { data } = await axiosClient.post("/auth/register", payload);
    return data;
  },

  me: async (): Promise<{ user: DatosUsuario }> => {
    const { data } = await axiosClient.get<{ user: DatosUsuario }>("/auth/me");
    return data;
  },
};
