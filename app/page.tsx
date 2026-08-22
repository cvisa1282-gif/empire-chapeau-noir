import Link from "next/link";
import TestimonialStrip from "../components/TestimonialStrip";
import { supabase } from "../lib/supabase";

export const revalidate = 0;

export default async function HomePage() {
  const { data: featured } = await supabase
    .from("offers")
    .select("*")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
            Résultats vérifiés
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight md:text-6xl">
            Construis ton empire,
            <br />
            <span className="text-accent">un contenu à la fois.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base opacity-75 md:text-lg">
            Formations, accompagnement et création de contenu pour lancer et
            faire grandir ton activité en ligne — étape par étape.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/offres"
              className="rounded-full bg-accent px-7 py-3 text-sm font-bold text-white shadow-lg shadow-accent/30 transition hover:scale-105"
            >
              Voir les offres
            </Link>
            <Link
              href="/a-propos"
              className="rounded-full border border-black/10 px-7 py-3 text-sm font-semibold dark:border-white/15"
            >
              Mon histoire
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider mx-5" />

      {/* PREUVES / TÉMOIGNAGES */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Ce que ça donne, en vrai
          </h2>
          <p className="mt-2 max-w-xl text-sm opacity-70">
            Des captures directement issues de résultats obtenus grâce aux
            méthodes enseignées.
          </p>
          <TestimonialStrip />
        </div>
      </section>

      {featured && (
        <>
          <div className="section-divider mx-5" />
          {/* OFFRE PHARE (pilotée depuis /admin) */}
          <section className="px-5 py-16">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-3xl bg-base-950 p-10 text-paper-50 md:flex-row md:p-14">
              <div className="flex-1">
                <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
                  Offre phare
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold md:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-md text-sm opacity-75">
                  {featured.description}
                </p>
                <Link
                  href={`/contact?offre=${encodeURIComponent(featured.title)}`}
                  className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
                >
                  {featured.is_free ? "Recevoir gratuitement" : "Commander cette formation"}
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
