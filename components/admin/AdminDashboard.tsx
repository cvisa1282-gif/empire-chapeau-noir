"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminOffers from "./AdminOffers";
import AdminTestimonials from "./AdminTestimonials";
import AdminBlog from "./AdminBlog";
import AdminRequests from "./AdminRequests";
import AdminNewsletterExport from "./AdminNewsletterExport";

const tabs = [
  { key: "requests", label: "Demandes" },
  { key: "offers", label: "Offres" },
  { key: "testimonials", label: "Témoignages" },
  { key: "blog", label: "Blog" },
  { key: "newsletter", label: "Newsletter" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabKey>("requests");

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
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === t.key
                ? "border-b-2 border-accent text-accent"
                : "opacity-60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "requests" && <AdminRequests />}
        {tab === "offers" && <AdminOffers />}
        {tab === "testimonials" && <AdminTestimonials />}
        {tab === "blog" && <AdminBlog />}
        {tab === "newsletter" && <AdminNewsletterExport />}
      </div>
    </div>
  );
}
