import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-base-950 text-paper-100 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">
              Empire Chapeau Noir
            </p>
            <p className="mt-3 max-w-xs text-sm opacity-70">
              Formation, accompagnement et création de contenu.
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              {/* Remplace ces liens par tes vrais profils */}
              <a href="#" className="opacity-70 hover:opacity-100">
                Instagram
              </a>
              <a href="#" className="opacity-70 hover:opacity-100">
                TikTok
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide opacity-60">
              Navigation
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/offres" className="opacity-80 hover:opacity-100">
                  Offres & Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="opacity-80 hover:opacity-100">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="opacity-80 hover:opacity-100">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide opacity-60">
              Newsletter
            </p>
            <p className="mt-3 text-sm opacity-70">
              Reçois les nouveautés et offres en avant-première.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs opacity-60 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Empire Chapeau Noir. Tous droits
            réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/cgv">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
