"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Pas de bouton retour sur l'accueil
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      aria-label="Retour"
      className="mx-5 mt-4 flex items-center gap-1.5 text-sm font-medium opacity-70 transition hover:opacity-100"
    >
      <span aria-hidden>←</span> Retour
    </button>
  );
}
