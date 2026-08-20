export default function MentionsLegalesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">
        Mentions légales
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed opacity-85">
        <div>
          <h2 className="font-display text-lg font-bold">Éditeur du site</h2>
          <p className="mt-2">
            Le site Empire Chapeau Noir est édité par Samuel, à titre
            individuel. L&apos;activité est actuellement en cours de
            formalisation administrative (statut officiel à venir).
          </p>
          <p className="mt-2">
            Contact : via WhatsApp au{" "}
            <a href="https://wa.me/22899314796" className="text-accent underline">
              +228 99 31 47 96
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Hébergement</h2>
          <p className="mt-2">
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, États-Unis.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            Propriété intellectuelle
          </h2>
          <p className="mt-2">
            L&apos;ensemble des contenus présents sur ce site (textes,
            visuels, vidéos, logo) est la propriété de Samuel / Empire
            Chapeau Noir, sauf mention contraire. Toute reproduction sans
            autorisation est interdite.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            Données personnelles
          </h2>
          <p className="mt-2">
            Le traitement des données personnelles collectées sur ce site
            est détaillé dans notre{" "}
            <a href="/confidentialite" className="text-accent underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>

        <p className="pt-4 text-xs opacity-60">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.
          Ces mentions seront complétées dès l&apos;obtention d&apos;un
          statut d&apos;activité officiel.
        </p>
      </div>
    </section>
  );
}
