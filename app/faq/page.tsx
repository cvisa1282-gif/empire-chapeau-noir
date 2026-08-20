import FaqAccordion from "../../components/FaqAccordion";

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        Questions fréquentes
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">
        FAQ
      </h1>
      <p className="mt-4 text-sm opacity-70">
        Une question qui n&apos;a pas de réponse ici ?{" "}
        <a href="/contact" className="text-accent underline">
          Contacte-moi directement
        </a>
        .
      </p>

      <FaqAccordion />
    </section>
  );
}
