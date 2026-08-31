import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loginStore: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logoutStore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: typeof window !== "undefined" && !!localStorage.getItem("token"),
  user: null,

  loginStore: (token, user) => {
    localStorage.setItem("token", token);
    set({ isLoggedIn: true, user });
  },

  setUser: (user) => set({ user, isLoggedIn: true }),

  logoutStore: () => {
    localStorage.removeItem("token");
    set({ isLoggedIn: false, user: null });
  },
}));
