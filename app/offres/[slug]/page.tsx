import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";
import OfferCta from "../../../components/OfferCta";
import AffiliateRequestForm from "../../../components/AffiliateRequestForm";
import OfferCountdown from "../../../components/OfferCountdown";
import FavoriteButton from "../../../components/FavoriteButton";

export const revalidate = 60;

async function getOffer(slug: string) {
  const { data } = await supabase
    .from("offers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

function isNew(createdAt: string) {
  const diffDays =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const offer = await getOffer(params.slug);
  if (!offer) return { title: "Offre introuvable" };
  return {
    title: offer.title,
    description: offer.description || undefined,
    openGraph: {
      title: offer.title,
      description: offer.description || undefined,
      images: offer.image_url ? [{ url: offer.image_url }] : undefined,
    },
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const offer = await getOffer(params.slug);
  if (!offer) notFound();

  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      {offer.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={offer.image_url}
          alt=""
          className="mb-6 h-56 w-full rounded-2xl object-cover"
        />
      )}

      <div className="flex flex-wrap gap-2">
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

      <h1 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">
        {offer.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed opacity-85">
        {offer.description}
      </p>

      {offer.price && !offer.is_free && (
        <p className="mt-4 font-display text-2xl font-bold text-accent">
          {Number(offer.price).toLocaleString("fr-FR")} CFA
        </p>
      )}

      {offer.deadline && <OfferCountdown deadline={offer.deadline} />}

      <div className="mt-6 flex flex-wrap gap-3">
        <OfferCta
          offerId={offer.id}
          href={`/contact?offre=${encodeURIComponent(offer.title)}`}
          className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
        >
          {offer.is_free ? "Recevoir gratuitement" : "Commander"}
        </OfferCta>
        <FavoriteButton
          offerId={offer.id}
          offerTitle={offer.title}
          offerSlug={offer.slug}
        />
      </div>

      <div className="mt-4">
        <AffiliateRequestForm offerTitle={offer.title} />
      </div>
    </section>
  );
}
