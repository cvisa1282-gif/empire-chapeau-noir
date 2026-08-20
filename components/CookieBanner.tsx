"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-paper-50 p-4 text-sm dark:border-white/10 dark:bg-base-900">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="opacity-80">
          Ce site utilise des cookies pour la newsletter et la mesure
          d&apos;audience. Vous pouvez accepter ou refuser.{" "}
          <a href="/confidentialite" className="underline">
            En savoir plus
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={refuse}
            className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold dark:border-white/10"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
