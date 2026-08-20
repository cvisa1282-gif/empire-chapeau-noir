export default function ConfidentialitePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-extrabold md:text-4xl">
        Politique de confidentialité
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed opacity-85">
        <div>
          <h2 className="font-display text-lg font-bold">
            Données collectées
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Newsletter</strong> : votre adresse email, lorsque vous
              vous inscrivez volontairement.
            </li>
            <li>
              <strong>Formulaire de contact</strong> : nom, téléphone, email
              (facultatif) et message, lorsque vous nous contactez.
            </li>
            <li>
              <strong>Cookies</strong> : utilisés pour le fonctionnement de
              la newsletter et, si vous l&apos;acceptez, pour la mesure
              d&apos;audience.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">
            Finalité du traitement
          </h2>
          <p className="mt-2">
            Ces données sont utilisées uniquement pour répondre à vos
            demandes, vous envoyer la newsletter si vous y êtes inscrit·e, et
            améliorer le site. Elles ne sont ni vendues ni transmises à des
            tiers à des fins commerciales.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Hébergement</h2>
          <p className="mt-2">
            Les données sont stockées de façon sécurisée via Supabase et le
            site est hébergé par Vercel Inc.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Vos droits</h2>
          <p className="mt-2">
            Conformément au RGPD, vous disposez d&apos;un droit
            d&apos;accès, de rectification et de suppression de vos données.
            Pour exercer ces droits, contactez-nous via{" "}
            <a href="https://wa.me/22899314796" className="text-accent underline">
              WhatsApp
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Cookies</h2>
          <p className="mt-2">
            Un bandeau vous permet d&apos;accepter ou de refuser les cookies
            non essentiels dès votre première visite. Vous pouvez modifier
            votre choix à tout moment en effaçant les cookies de votre
            navigateur.
          </p>
        </div>

        <p className="pt-4 text-xs opacity-60">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.
        </p>
      </div>
    </section>
  );
}
