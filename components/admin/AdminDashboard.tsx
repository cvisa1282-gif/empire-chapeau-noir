"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminOffers from "./AdminOffers";
import AdminTestimonials from "./AdminTestimonials";
import AdminBlog from "./AdminBlog";
import AdminRequests from "./AdminRequests";
import AdminNewsletterExport from "./AdminNewsletterExport";
import AdminAffiliates from "./AdminAffiliates";
import AdminWithdrawals from "./AdminWithdrawals";

const tabs = [
  { key: "requests", label: "Demandes" },
  { key: "offers", label: "Offres" },
  { key: "affiliates", label: "Affiliés" },
  { key: "withdrawals", label: "Retraits" },
  { key: "testimonials", label: "Témoignages" },
  { key: "blog", label: "Blog" },
  { key: "newsletter", label: "Newsletter" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabKey>("requests");
  const [pendingAffiliates, setPendingAffiliates] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);

  async function loadBadges() {
    const [aff, wd] = await Promise.all([
      supabase
        .from("affiliate_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "en_attente"),
      supabase
        .from("withdrawal_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "en_attente"),
    ]);
    setPendingAffiliates(aff.count || 0);
    setPendingWithdrawals(wd.count || 0);
  }

  useEffect(() => {
    loadBadges();
  }, [tab]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Administration</h1>
        <button
          onClick={() => supabase.auth.signOut().then(() => location.reload())}
          className="text-xs font-semibold opacity-60 hover:opacity-100"
        >
          Se déconnecter
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-black/10 dark:border-white/10">
        {tabs.map((t) => {
          const badge =
            t.key === "affiliates"
              ? pendingAffiliates
              : t.key === "withdrawals"
              ? pendingWithdrawals
              : 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2 text-sm font-semibold ${
                tab === t.key
                  ? "border-b-2 border-accent text-accent"
                  : "opacity-60"
              }`}
            >
              {t.label}
              {badge > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "requests" && <AdminRequests />}
        {tab === "offers" && <AdminOffers />}
        {tab === "affiliates" && <AdminAffiliates onChange={loadBadges} />}
        {tab === "withdrawals" && <AdminWithdrawals onChange={loadBadges} />}
        {tab === "testimonials" && <AdminTestimonials />}
        {tab === "blog" && <AdminBlog />}
        {tab === "newsletter" && <AdminNewsletterExport />}
      </div>
    </div>
  );
}
