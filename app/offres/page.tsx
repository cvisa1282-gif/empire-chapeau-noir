import Link from "next/link";

// 👉 Liste des offres. On pourra migrer ça vers Supabase (table "offers")
// pour que tu puisses en ajouter sans redéployer, mais pour l'instant
// c'est ici que tu ajoutes une offre : copie un objet et modifie les champs.
const offers = [
  {
    title: "Formation Vidéos IA — Fruits",
    description:
      "La méthode complète (format PDF) pour créer des vidéos de fruits générées par IA : outils, prompts, astuces et étapes pour lancer et monétiser ta propre chaîne.",
    price: "15 000 CFA",
    free: false,
    featured: true,
  },
  // Ajoute tes prochaines offres ici, par exemple :
  // {
  //   title: "Nom de l'offre",
  //   description: "Description courte.",
  //   price: "X CFA",
  //   free: false,
  //   featured: false,
  // },
];

export default function OffresPage() {
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, i) => (
          <div
            key={i}
            className="relative flex flex-col rounded-2xl border border-black/10 p-6 dark:border-white/10"
          >
            {offer.featured && (
              <span className="seal absolute -top-3 left-5 bg-paper-50 text-[10px] font-bold uppercase tracking-wide text-gold dark:bg-base-950">
                Offre phare
              </span>
            )}
            <span
              className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                offer.free
                  ? "bg-accent/15 text-accent"
                  : "bg-gold/15 text-gold"
              }`}
            >
              {offer.free ? "Gratuit" : "Payant"}
            </span>

            <h2 className="mt-4 font-display text-lg font-bold">
              {offer.title}
            </h2>
            <p className="mt-2 flex-1 text-sm opacity-75">
              {offer.description}
            </p>
            <p className="mt-4 font-display text-lg font-bold text-accent">
              {offer.free ? "Gratuit" : offer.price}
            </p>

            <Link
              href={`/contact?offre=${encodeURIComponent(offer.title)}`}
              className="mt-5 rounded-full bg-accent px-5 py-2.5 text-center text-sm font-bold text-white"
            >
              {offer.free ? "Recevoir gratuitement" : "Commander"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
