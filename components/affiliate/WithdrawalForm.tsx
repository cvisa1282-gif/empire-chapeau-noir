"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22899314796";

export default function WithdrawalForm({
  affiliateId,
  defaultName,
  estimatedAmount,
}: {
  affiliateId: string;
  defaultName: string;
  estimatedAmount: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const [paymentNumber, setPaymentNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await supabase.from("withdrawal_requests").insert({
      affiliate_id: affiliateId,
      name,
      payment_number: paymentNumber,
      payment_method: paymentMethod,
      email,
      amount_requested: estimatedAmount,
    });

    const text = encodeURIComponent(
      `Bonjour Samuel, je souhaite un retrait de ma commission.\n` +
        `Nom : ${name}\n` +
        `Montant : ${estimatedAmount.toLocaleString("fr-FR")} CFA\n` +
        `Moyen de paiement : ${paymentMethod}\n` +
        `Numéro de paiement : ${paymentNumber}\n` +
        `Email : ${email}`
    );
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");

    setSaving(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className="mt-4 text-sm text-accent">
        Demande de retrait envoyée sur WhatsApp et enregistrée ! Samuel te
        contactera pour le paiement.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-white"
      >
        Demander un retrait
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-black/10 p-5 dark:border-white/10"
    >
      <p className="font-display text-sm font-bold">
        Demande de retrait — {estimatedAmount.toLocaleString("fr-FR")} CFA
      </p>
      <p className="text-xs opacity-60">
        En envoyant, WhatsApp s&apos;ouvrira automatiquement avec un message
        pré-rempli adressé à Samuel — il te suffira de l&apos;envoyer.
      </p>
      <input
        required
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      />
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      >
        <option>Mobile Money</option>
        <option>Orange Money</option>
        <option>Moov Money</option>
        <option>Autre</option>
      </select>
      <input
        required
        placeholder="Numéro de paiement"
        value={paymentNumber}
        onChange={(e) => setPaymentNumber(e.target.value)}
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
        disabled={saving}
        className="w-full rounded-full bg-gold px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? "..." : "Envoyer sur WhatsApp"}
      </button>
    </form>
  );
}
