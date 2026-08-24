import { supabase } from "../../lib/supabase";
import Link from "next/link";
import type { Metadata } from "next";
import OfferCta from "../../components/OfferCta";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Offres & Services",
  description:
    "Formations, accompagnement et création de contenu — découvre toutes les offres disponibles.",
};

type Offer = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_free: boolean;
  featured: boolean;
  created_at: string;
};

function isNew(createdAt: string) {
  const diffDays =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export default async function OffresPage() {
  const [{ data }, { count: affiliateCount }] = await Promise.all([
    supabase
      .from("offers")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false }),
    supabase
      .from("affiliates")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
  ]);

  const offers = (data as Offer[]) || [];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        Ce que je propose
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">
        Offres & Services
      </h1>
      <p className="mt-4 max-w-xl text-sm opacity-70">
        Formations, accompagnement et création de contenu — pour commander,
        remplis simplement le formulaire de contact.
      </p>
      {!!affiliateCount && affiliateCount > 0 && (
        <p className="mt-2 text-xs font-semibold text-gold">
          {affiliateCount} affilié{affiliateCount > 1 ? "s" : ""} actif
          {affiliateCount > 1 ? "s" : ""} nous font confiance
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative flex flex-col rounded-2xl border border-black/10 p-6 dark:border-white/10"
          >
            <div className="flex flex-wrap gap-2">
              {offer.featured && (
                <span className="seal absolute -top-3 left-5 bg-paper-50 text-[10px] font-bold uppercase tracking-wide text-gold dark:bg-base-950">
                  Offre phare
                </span>
              )}
              <span
                className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  offer.is_free
                    ? "bg-accent/15 text-accent"
                    : "bg-gold/15 text-gold"
                }`}
              >
                {offer.is_free ? "Gratuit" : "Payant"}
              </span>
              {isNew(offer.created_at) && (
                <span className="w-fit rounded-full bg-ember/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ember">
                  Nouveau
                </span>
              )}
            </div>

            <Link href={`/offres/${offer.slug}`}>
              <h2 className="mt-4 font-display text-lg font-bold hover:text-accent">
                {offer.title}
              </h2>
            </Link>
            <p className="mt-2 flex-1 text-sm opacity-75">
              {offer.description}
            </p>

            <OfferCta
              offerId={offer.id}
              href={`/contact?offre=${encodeURIComponent(offer.title)}`}
              className="mt-5 rounded-full bg-accent px-5 py-2.5 text-center text-sm font-bold text-white"
            >
              {offer.is_free ? "Recevoir gratuitement" : "Commander"}
            </OfferCta>
          </div>
        ))}

        {offers.length === 0 && (
          <p className="text-sm opacity-60">
            Aucune offre pour l&apos;instant — ajoute-en une depuis{" "}
            <Link href="/admin" className="text-accent underline">
              l&apos;espace admin
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
