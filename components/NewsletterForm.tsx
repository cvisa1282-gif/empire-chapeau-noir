"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    setStatus(error ? "error" : "success");
    if (!error) setEmail("");
  }

  if (status === "success") {
    return (
      <p className="mt-3 text-sm text-accent">
        Inscription confirmée, merci !
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ton@email.com"
        className="w-full rounded-full border border-white/15 bg-transparent px-4 py-2 text-sm placeholder:opacity-50 focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "..." : "OK"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">Erreur, réessaie.</p>
      )}
    </form>
  );
}
