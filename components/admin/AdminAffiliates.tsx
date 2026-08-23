"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Affiliate = {
  id: string;
  name: string;
  phone: string | null;
  code: string;
  commission_rate: number;
  offer_slug: string | null;
  active: boolean;
};

type AffiliateRequest = {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  offer_title: string | null;
  status: string;
  created_at: string;
};

function generatePassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

export default function AdminAffiliates({
  onChange,
}: {
  onChange?: () => void;
}) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [requests, setRequests] = useState<AffiliateRequest[]>([]);
  const [salesTotals, setSalesTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    commissionRate: "20",
    offerSlug: "",
  });
  const [prefillRequestId, setPrefillRequestId] = useState<string | null>(
    null
  );

  async function load() {
    setLoading(true);
    const [aff, req] = await Promise.all([
      supabase.from("affiliates").select("*").order("created_at", { ascending: false }),
      supabase
        .from("affiliate_requests")
        .select("*")
        .eq("status", "en_attente")
        .order("created_at", { ascending: false }),
    ]);
    const affiliateList = (aff.data as Affiliate[]) || [];
    setAffiliates(affiliateList);
    setRequests((req.data as AffiliateRequest[]) || []);

    // Calcule le total des ventes confirmées par affilié
    if (affiliateList.length > 0) {
      const { data: offers } = await supabase.from("offers").select("title, price");
      const priceMap: Record<string, number> = {};
      (offers || []).forEach((o) => {
        if (o.price) priceMap[o.title] = o.price;
      });

      const { data: confirmed } = await supabase
        .from("order_requests")
        .select("referral_code, offer_requested")
        .eq("sale_confirmed", true);

      const totals: Record<string, number> = {};
      (confirmed || []).forEach((r) => {
        if (!r.referral_code) return;
        const price = r.offer_requested ? priceMap[r.offer_requested] || 0 : 0;
        const aff = affiliateList.find((a) => a.code === r.referral_code);
        const rate = aff ? aff.commission_rate : 0;
        totals[r.referral_code] =
          (totals[r.referral_code] || 0) + (price * rate) / 100;
      });
      setSalesTotals(totals);
    }

    setLoading(false);
    onChange?.();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function prefillFromRequest(r: AffiliateRequest) {
    let offerSlug = "";
    if (r.offer_title) {
      const { data: offer } = await supabase
        .from("offers")
        .select("slug")
        .eq("title", r.offer_title)
        .maybeSingle();
      offerSlug = offer?.slug || "";
    }
    setForm({
      name: r.name,
      phone: r.phone || "",
      email: r.email,
      password: generatePassword(),
      commissionRate: "20",
      offerSlug,
    });
    setPrefillRequestId(r.id);
    setResult("");
    setError("");
  }

  async function refuseRequest(id: string) {
    await supabase
      .from("affiliate_requests")
      .update({ status: "refuse" })
      .eq("id", id);
    load();
  }

  async function toggleActive(a: Affiliate) {
    await supabase
      .from("affiliates")
      .update({ active: !a.active })
      .eq("id", a.id);
    load();
  }

  function linkFor(a: { code: string; offer_slug: string | null }) {
    const base = "https://empire-chapeau-noir.vercel.app/offres";
    return a.offer_slug
      ? `${base}/${a.offer_slug}?ref=${a.code}`
      : `${base}?ref=${a.code}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setResult("");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch("/api/create-affiliate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        commissionRate: Number(form.commissionRate),
        offerSlug: form.offerSlug || null,
      }),
    });
    const data = await res.json();

    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Erreur inconnue.");
      return;
    }

    if (prefillRequestId) {
      await supabase
        .from("affiliate_requests")
        .update({ status: "approuve" })
        .eq("id", prefillRequestId);
      setPrefillRequestId(null);
    }

    setResult(
      `Affilié créé ! Transmets-lui : email "${form.email}", mot de passe "${form.password}", et le lien de connexion (${window.location.origin}/affilie).`
    );
    setForm({ name: "", phone: "", email: "", password: "", commissionRate: "20", offerSlug: "" });
    load();
  }

  return (
    <div>
      {requests.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="font-display text-sm font-bold">
            Demandes d&apos;affiliation en attente
          </p>
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-gold/40 bg-gold/5 p-4"
            >
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs opacity-70">
                {r.email}
                {r.phone ? ` · ${r.phone}` : ""}
              </p>
              {r.offer_title && (
                <p className="mt-1 text-xs">
                  <span className="opacity-60">Produit :</span>{" "}
                  {r.offer_title}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => prefillFromRequest(r)}
                  className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white"
                >
                  Approuver
                </button>
                <button
                  onClick={() => refuseRequest(r.id)}
                  className="rounded-full border border-black/10 px-4 py-1.5 text-xs dark:border-white/15"
                >
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-black/10 p-5 dark:border-white/10"
      >
        <p className="font-display text-sm font-bold">
          {prefillRequestId ? "Approuver cet affilié" : "Nouvel affilié"}
        </p>
        <input
          required
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          placeholder="Téléphone (optionnel)"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          required
          type="email"
          placeholder="Email de connexion"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <div className="flex gap-2">
          <input
            required
            type="text"
            placeholder="Mot de passe de connexion"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
          />
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, password: generatePassword() }))}
            className="shrink-0 rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold dark:border-white/15"
          >
            Générer
          </button>
        </div>
        <input
          placeholder="Slug du produit concerné (optionnel — vide = tout le catalogue)"
          value={form.offerSlug}
          onChange={(e) =>
            setForm((f) => ({ ...f, offerSlug: e.target.value }))
          }
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <div>
          <label className="mb-1 block text-xs opacity-60">
            Taux de commission (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.commissionRate}
            onChange={(e) =>
              setForm((f) => ({ ...f, commissionRate: e.target.value }))
            }
            className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "..." : "Créer l'affilié"}
          </button>
          {prefillRequestId && (
            <button
              type="button"
              onClick={() => {
                setPrefillRequestId(null);
                setForm({ name: "", phone: "", email: "", password: "", commissionRate: "20", offerSlug: "" });
              }}
              className="rounded-full border border-black/10 px-5 py-2 text-sm dark:border-white/15"
            >
              Annuler
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {result && <p className="text-xs text-accent">{result}</p>}
      </form>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm opacity-60">Chargement...</p>}
        {affiliates.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl border p-4 ${
              a.active
                ? "border-black/10 dark:border-white/10"
                : "border-red-500/30 bg-red-500/5 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {a.name}
                  {!a.active && (
                    <span className="ml-2 text-xs text-red-500">
                      (suspendu)
                    </span>
                  )}
                </p>
                <p className="text-xs opacity-60">
                  Code : <span className="font-mono text-accent">{a.code}</span>{" "}
                  · Commission : {a.commission_rate}%
                  {a.phone ? ` · ${a.phone}` : ""}
                </p>
              </div>
              <button
                onClick={() => toggleActive(a)}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                  a.active
                    ? "border border-black/10 dark:border-white/15"
                    : "bg-accent/15 text-accent"
                }`}
              >
                {a.active ? "Suspendre" : "Réactiver"}
              </button>
            </div>
            <p className="mt-2 text-sm font-semibold text-gold">
              {(salesTotals[a.code] || 0).toLocaleString("fr-FR")} CFA de
              commissions générées
            </p>
            <p className="mt-1 break-all text-xs opacity-50">
              {linkFor(a)}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(linkFor(a));
                setCopiedId(a.id);
                setTimeout(() => setCopiedId(null), 2000);
              }}
              className="mt-1 rounded-full border border-black/10 px-3 py-1 text-[11px] font-semibold dark:border-white/15"
            >
              {copiedId === a.id ? "Copié !" : "Copier le lien"}
            </button>
          </div>
        ))}
        {!loading && affiliates.length === 0 && (
          <p className="text-sm opacity-60">Aucun affilié pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
