"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22899314796";

export default function AffiliateRequestForm({
  offerTitle,
}: {
  offerTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("affiliate_requests").insert({
      name,
      phone,
      email,
      offer_title: offerTitle,
    });

    const text = encodeURIComponent(
      `Bonjour, je souhaite devenir affilié pour "${offerTitle}".\n` +
        `Nom : ${name}\nTéléphone : ${phone}\nEmail : ${email}`
    );
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");
    setSent(true);
  }

  if (sent) {
    return (
      <p className="mt-3 text-sm text-accent">
        Demande envoyée ! Samuel te recontacte après vérification.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 rounded-full border border-gold px-5 py-2 text-sm font-bold text-gold"
      >
        Devenir affilié pour ce produit
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <input
        required
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        required
        type="tel"
        placeholder="Téléphone WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      />
      <button
        type="submit"
        className="w-full rounded-full bg-gold px-5 py-2 text-sm font-bold text-white"
      >
        Envoyer ma demande
      </button>
    </form>
  );
}
