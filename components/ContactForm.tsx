"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";

const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22899314796";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefilledOffer = searchParams.get("offre") || "";

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    offer: prefilledOffer,
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "saveFailed"
  >("idle");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    // Enregistre la demande dans Supabase pour garder une trace.
    // Si ça échoue (ex: base indisponible), on continue quand même vers
    // WhatsApp pour ne jamais perdre un contact potentiel.
    const { error } = await supabase.from("order_requests").insert({
      full_name: form.fullName,
      phone: form.phone,
      email: form.email,
      offer_requested: form.offer,
      message: form.message,
    });

    if (error) {
      setStatus("saveFailed");
    }

    // Construit le message WhatsApp pré-rempli
    const waText = encodeURIComponent(
      `Bonjour, je suis ${form.fullName}.\n` +
        (form.offer ? `Offre concernée : ${form.offer}\n` : "") +
        `Téléphone : ${form.phone}\n` +
        (form.email ? `Email : ${form.email}\n` : "") +
        `Message : ${form.message}`
    );

    window.open(`https://wa.me/${number}?text=${waText}`, "_blank");
    if (!error) setStatus("idle");
    setForm({ fullName: "", phone: "", email: "", offer: "", message: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nom complet</label>
        <input
          required
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm focus:border-accent dark:border-white/15"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Téléphone (WhatsApp)
          </label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm focus:border-accent dark:border-white/15"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email (optionnel)
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm focus:border-accent dark:border-white/15"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Offre concernée (optionnel)
        </label>
        <input
          value={form.offer}
          onChange={(e) => update("offer", e.target.value)}
          placeholder="Ex : Formation vidéos IA"
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm placeholder:opacity-40 focus:border-accent dark:border-white/15"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Message</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm focus:border-accent dark:border-white/15"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Envoi..." : "Envoyer sur WhatsApp"}
      </button>

      {status === "saveFailed" && (
        <p className="text-xs text-amber-600">
          Ta demande a bien été envoyée sur WhatsApp, mais elle n&apos;a pas
          pu être sauvegardée automatiquement.{" "}
          <a
            href={`https://wa.me/${number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Ouvrir WhatsApp directement
          </a>{" "}
          si la conversation ne s&apos;est pas ouverte.
        </p>
      )}
    </form>
  );
}
