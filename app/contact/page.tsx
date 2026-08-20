import ContactForm from "../../components/ContactForm";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        Contact
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">
        Parlons de ton projet
      </h1>
      <p className="mt-4 text-sm opacity-70">
        Remplis ce formulaire — il ouvre directement une conversation
        WhatsApp avec le message pré-rempli.
      </p>

      <ContactForm />
    </section>
  );
}
