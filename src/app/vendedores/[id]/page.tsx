"use client";

import { use } from "react";
import { PerfilVendedorView } from "@/features/vendedores/components/PerfilVendedorView";

export default function PerfilVendedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PerfilVendedorView vendedorId={id} />;
}
