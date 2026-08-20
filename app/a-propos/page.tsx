export default function AProposPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        Mon histoire
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">
        À propos de Samuel
      </h1>

      <div className="mt-8 space-y-5 text-base leading-relaxed opacity-85">
        <p>
          Je me suis lancé dans la création de contenu et les vidéos IA il y
          a un peu plus d'un an, avec un objectif simple au départ : générer
          un revenu complémentaire. Ce qui n'était qu'un projet à côté est
          devenu bien plus que ça.
        </p>
        <p>
          Depuis, j'ai généré des revenus concrets grâce à mes chaînes et mes
          méthodes de création — les résultats parlent d'eux-mêmes, tu peux
          en voir des preuves directement sur la page d'accueil.
        </p>
        <p>
          Aujourd'hui, je ne veux plus avancer seul. Mon objectif avec Empire
          Chapeau Noir, c'est de construire une vraie communauté de créateurs
          qui progressent ensemble, partagent leurs résultats et s'entraident
          — pas juste vendre une formation de plus.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 p-5 text-center dark:border-white/10">
          <p className="font-display text-2xl font-bold text-accent">40+</p>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
            Élèves accompagnés
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-5 text-center dark:border-white/10">
          <p className="font-display text-2xl font-bold text-accent">1-2</p>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
            Années d&apos;expérience
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-5 text-center dark:border-white/10">
          <p className="font-display text-2xl font-bold text-accent">100+</p>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
            Vidéos produites
          </p>
        </div>
      </div>
    </section>
  );
}
