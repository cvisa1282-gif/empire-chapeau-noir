"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Withdrawal = {
  id: string;
  name: string;
  payment_number: string;
  payment_method: string;
  email: string;
  amount_requested: number | null;
  status: string;
  created_at: string;
};

export default function AdminWithdrawals({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Withdrawal[]) || []);
    setLoading(false);
    onChange?.();
  }

  useEffect(() => {
    load();
  }, []);

  async function markPaid(id: string) {
    await supabase
      .from("withdrawal_requests")
      .update({ status: "payé" })
      .eq("id", id);
    load();
  }

  return (
    <div className="space-y-3">
      {loading && <p className="text-sm opacity-60">Chargement...</p>}
      {items.map((w) => (
        <div
          key={w.id}
          className="rounded-2xl border border-black/10 p-4 dark:border-white/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{w.name}</p>
              <p className="text-xs opacity-60">
                {w.payment_method} · {w.payment_number} · {w.email}
              </p>
            </div>
            <button
              onClick={() => markPaid(w.id)}
              disabled={w.status === "payé"}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                w.status === "payé"
                  ? "bg-emerald-500/15 text-emerald-500"
                  : "bg-gold/15 text-gold"
              }`}
            >
              {w.status === "payé" ? "Payé ✓" : "Marquer payé"}
            </button>
          </div>
          {w.amount_requested && (
            <p className="mt-2 text-sm font-semibold text-accent">
              {Number(w.amount_requested).toLocaleString("fr-FR")} CFA
            </p>
          )}
          <p className="mt-2 text-xs opacity-40">
            {new Date(w.created_at).toLocaleString("fr-FR")}
          </p>
        </div>
      ))}
      {!loading && items.length === 0 && (
        <p className="text-sm opacity-60">Aucune demande de retrait.</p>
      )}
    </div>
  );
}
