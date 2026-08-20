export default function CgvPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">
        Conditions générales de vente
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed opacity-85">
        <div>
          <h2 className="font-display text-lg font-bold">1. Objet</h2>
          <p className="mt-2">
            Les présentes conditions régissent les offres de formation,
            d&apos;accompagnement et de création de contenu proposées par
            Samuel via Empire Chapeau Noir.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            2. Commande et paiement
          </h2>
          <p className="mt-2">
            Le site ne propose pas de paiement en ligne. Toute demande passe
            par le formulaire de contact, qui ouvre un échange direct sur
            WhatsApp. Les modalités précises (contenu de l&apos;offre, prix,
            délais, moyen de paiement) sont définies d&apos;un commun accord
            lors de cet échange, avant tout engagement.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            3. Offres gratuites
          </h2>
          <p className="mt-2">
            Certaines ressources ou offres sont proposées gratuitement,
            identifiées comme telles sur le site. Elles ne font l&apos;objet
            d&apos;aucun paiement.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            4. Rétractation
          </h2>
          <p className="mt-2">
            Les conditions de rétractation applicables aux prestations
            payantes sont précisées directement lors de l&apos;échange
            WhatsApp préalable à toute commande.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            5. Responsabilité
          </h2>
          <p className="mt-2">
            Les résultats obtenus grâce aux formations et accompagnements
            dépendent de l&apos;implication de chaque personne et ne
            constituent pas une garantie de résultat.
          </p>
        </div>

        <p className="pt-4 text-xs opacity-60">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.
          Ces conditions seront complétées dès l&apos;obtention d&apos;un
          statut d&apos;activité officiel.
        </p>
      </div>
    </section>
  );
}
