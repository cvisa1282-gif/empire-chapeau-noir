"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Fav = { id: string; title: string; slug: string };

export default function FavorisPage() {
  const [favs, setFavs] = useState<Fav[]>([]);

  useEffect(() => {
    setFavs(JSON.parse(localStorage.getItem("favorites") || "[]"));
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">
        Mes favoris
      </h1>
      <div className="mt-8 space-y-3">
        {favs.map((f) => (
          <Link
            key={f.id}
            href={`/offres/${f.slug}`}
            className="block rounded-2xl border border-black/10 p-4 font-semibold hover:text-accent dark:border-white/10"
          >
            {f.title}
          </Link>
        ))}
        {favs.length === 0 && (
          <p className="text-sm opacity-60">
            Aucun favori pour l&apos;instant.{" "}
            <Link href="/offres" className="text-accent underline">
              Parcourir les offres
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
