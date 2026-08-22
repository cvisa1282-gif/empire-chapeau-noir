import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        404
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold">
        Cette page n&apos;existe pas
      </h1>
      <p className="mt-3 text-sm opacity-70">
        Le lien est peut-être incorrect ou la page a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
