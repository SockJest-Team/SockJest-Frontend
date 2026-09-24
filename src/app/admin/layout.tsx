"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useSincronizarPerfil } from "@/features/auth/hooks/useSincronizarPerfil";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  History,
  Flag,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/moderacion", label: "Moderación", icon: ShieldCheck },
  { href: "/admin/apelaciones", label: "Apelaciones", icon: Flag },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/categorias", label: "Categorías", icon: Package },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/historial", label: "Historial", icon: History },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [hidratado, setHidratado] = useState(false);

  useSincronizarPerfil();

  useEffect(() => {
    const t = setTimeout(() => setHidratado(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    if (!user) {
      router.replace("/auth?mode=login");
      return;
    }
    const t = setTimeout(() => {
      if (!user.roles?.includes("Admin")) {
        router.replace("/");
      }
    }, 300);
    return () => clearTimeout(t);
  }, [hidratado, user, router]);

  if (!hidratado || !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-stone-900 animate-spin" />
      </div>
    );
  }

  if (!user.roles?.includes("Admin")) {
    return (
      <div className="min-h-screen grid place-items-center bg-stone-50">
        <div className="h-8 w-8 rounded-full border-2 border-stone-300 border-t-stone-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200">
        <div className="h-16 border-b border-stone-200 flex items-center px-6">
          <span className="font-mono text-xs uppercase tracking-widest text-stone-900 font-medium">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-serif text-stone-900">Administración</h1>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900"
          >
            Ver sitio →
          </Link>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
