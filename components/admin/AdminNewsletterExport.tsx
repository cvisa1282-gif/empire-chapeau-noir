"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminNewsletterExport() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  async function exportCsv() {
    setLoading(true);
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("email, created_at")
      .order("created_at", { ascending: false });

    const rows = data || [];
    setCount(rows.length);

    const csv =
      "email,date d'inscription\n" +
      rows
        .map(
          (r) =>
            `${r.email},${new Date(r.created_at).toLocaleDateString("fr-FR")}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
      <p className="font-display text-sm font-bold">Newsletter</p>
      <p className="mt-1 text-xs opacity-60">
        Télécharge la liste des inscrits (fichier CSV, ouvrable dans Excel).
      </p>
      <button
        onClick={exportCsv}
        disabled={loading}
        className="mt-3 rounded-full bg-accent px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "..." : "Télécharger le CSV"}
      </button>
      {count !== null && (
        <p className="mt-2 text-xs opacity-60">
          {count} abonné{count > 1 ? "s" : ""} exporté{count > 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}
