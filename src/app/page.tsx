"use client";
import HomeView from "@/features/home/HomeView";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const { isLoggedIn, logoutStore } = useAuthStore();

  return (
    <main>
      <HomeView />
    </main>
  );
}
