"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Affiliate = {
  id: string;
  name: string;
  phone: string | null;
  code: string;
  commission_rate: number;
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

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [requests, setRequests] = useState<AffiliateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    commissionRate: "20",
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
    setAffiliates((aff.data as Affiliate[]) || []);
    setRequests((req.data as AffiliateRequest[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function prefillFromRequest(r: AffiliateRequest) {
    setForm({
      name: r.name,
      phone: r.phone || "",
      email: r.email,
      password: "",
      commissionRate: "20",
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
      `Affilié créé ! Code : ${data.code} — transmets-lui son email, son mot de passe et le lien de connexion (${window.location.origin}/affilie).`
    );
    setForm({ name: "", phone: "", email: "", password: "", commissionRate: "20" });
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
                setForm({ name: "", phone: "", email: "", password: "", commissionRate: "20" });
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
            className="rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <p className="font-semibold">{a.name}</p>
            <p className="text-xs opacity-60">
              Code : <span className="font-mono text-accent">{a.code}</span>{" "}
              · Commission : {a.commission_rate}%
              {a.phone ? ` · ${a.phone}` : ""}
            </p>
            <p className="mt-1 break-all text-xs opacity-50">
              Lien : https://empire-chapeau-noir.vercel.app/offres?ref=
              {a.code}
            </p>
          </div>
        ))}
        {!loading && affiliates.length === 0 && (
          <p className="text-sm opacity-60">Aucun affilié pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
