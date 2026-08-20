export default function AProposPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        Mon histoire
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">
        À propos de Samuel
      </h1>

      {/* 👉 Remplace ce texte par ton vrai parcours : comment tu as commencé,
          les résultats obtenus, pourquoi tu accompagnes aujourd'hui d'autres
          personnes. */}
      <div className="mt-8 space-y-5 text-base leading-relaxed opacity-85">
        <p>
          [Raconte ici comment tout a commencé — ton point de départ, ce qui
          t'a motivé à te lancer dans la création de contenu et la
          formation.]
        </p>
        <p>
          [Décris les résultats concrets obtenus : chaînes développées,
          audience touchée, revenus générés — les captures de témoignages sur
          la page d'accueil peuvent servir de preuve ici aussi.]
        </p>
        <p>
          [Explique pourquoi tu accompagnes aujourd'hui d'autres personnes à
          travers Empire Chapeau Noir : ta mission, ta méthode, ce qui te
          différencie.]
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 p-5 text-center dark:border-white/10">
          <p className="font-display text-2xl font-bold text-accent">[X]</p>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
            Élèves accompagnés
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-5 text-center dark:border-white/10">
          <p className="font-display text-2xl font-bold text-accent">[X]</p>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
            Années d&apos;expérience
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-5 text-center dark:border-white/10">
          <p className="font-display text-2xl font-bold text-accent">[X]</p>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
            Vidéos produites
          </p>
        </div>
      </div>
    </section>
  );
}
