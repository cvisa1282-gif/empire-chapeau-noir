"use client";

import { useState } from "react";

const faqs = [
  {
    // 👉 Remplace ces questions/réponses par tes vraies FAQ.
    q: "Comment se déroule l'accompagnement ?",
    a: "Décris ici les grandes étapes de ton accompagnement ou de ta formation.",
  },
  {
    q: "Combien de temps faut-il pour voir des résultats ?",
    a: "Donne un ordre d'idée réaliste basé sur ton expérience et celle de tes élèves.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Explique la marche à suivre : remplir le formulaire de contact, échanger sur WhatsApp, puis modalités de paiement.",
  },
  {
    q: "Y a-t-il des offres gratuites ?",
    a: "Oui, certaines ressources et offres sont gratuites — retrouve-les sur la page Offres & Services.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-8 space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
            >
              {item.q}
              <span className="shrink-0 text-accent">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-4 text-sm opacity-75">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
