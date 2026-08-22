"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type OrderRequest = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  offer_requested: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default function AdminRequests() {
  const [items, setItems] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"nouveau" | "traité" | "tous">(
    "nouveau"
  );

  async function load() {
    setLoading(true);
    let query = supabase
      .from("order_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "tous") query = query.eq("status", filter);

    const { data } = await query;
    setItems((data as OrderRequest[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function toggleStatus(item: OrderRequest) {
    const next = item.status === "traité" ? "nouveau" : "traité";
    await supabase
      .from("order_requests")
      .update({ status: next })
      .eq("id", item.id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["nouveau", "traité", "tous"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              filter === f
                ? "bg-accent text-white"
                : "border border-black/10 dark:border-white/15"
            }`}
          >
            {f === "nouveau" ? "Nouvelles" : f === "traité" ? "Traitées" : "Toutes"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm opacity-60">Chargement...</p>}
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.full_name}</p>
                <p className="text-xs opacity-60">
                  {item.phone}
                  {item.email ? ` · ${item.email}` : ""}
                </p>
              </div>
              <button
                onClick={() => toggleStatus(item)}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                  item.status === "traité"
                    ? "bg-accent/15 text-accent"
                    : "bg-gold/15 text-gold"
                }`}
              >
                {item.status === "traité" ? "Traité ✓" : "Marquer traité"}
              </button>
            </div>
            {item.offer_requested && (
              <p className="mt-2 text-sm">
                <span className="opacity-60">Offre :</span>{" "}
                {item.offer_requested}
              </p>
            )}
            {item.message && (
              <p className="mt-1 text-sm opacity-80">{item.message}</p>
            )}
            <p className="mt-2 text-xs opacity-40">
              {new Date(item.created_at).toLocaleString("fr-FR")}
            </p>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm opacity-60">Aucune demande ici.</p>
        )}
      </div>
    </div>
  );
}
