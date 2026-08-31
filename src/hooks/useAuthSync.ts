"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "@/store/authStore";

export const useAuthSync = () => {
  const { isLoggedIn, setUser, logoutStore } = useAuthStore();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await axiosClient.get("/auth/profile");
      return response.data;
    },

    enabled: isLoggedIn,
    retry: false,
  });
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      logoutStore();
    }
  }, [isError, logoutStore]);

  return { isLoading };
};
