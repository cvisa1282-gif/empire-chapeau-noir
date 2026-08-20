"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Comment se déroule l'accompagnement ?",
    a: "Tout commence par un échange direct sur WhatsApp après ta demande via le formulaire de contact. On fait le point sur ton objectif, puis je te guide étape par étape avec des méthodes concrètes, testées sur mes propres chaînes.",
  },
  {
    q: "Combien de temps faut-il pour voir des résultats ?",
    a: "Ça dépend de ton implication, mais avec les bonnes méthodes, les premiers résultats concrets (audience, revenus) arrivent généralement en quelques semaines à quelques mois de pratique régulière.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Il n'y a pas de paiement en ligne sur le site : tu remplis le formulaire de contact, on échange sur WhatsApp pour définir l'offre qui te correspond, et les modalités de paiement sont réglées directement avec moi.",
  },
  {
    q: "Y a-t-il des offres gratuites ?",
    a: "Oui, certaines ressources et offres sont entièrement gratuites — retrouve-les sur la page Offres & Services, identifiées par un badge dédié.",
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
