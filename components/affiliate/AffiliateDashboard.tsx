"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import WithdrawalForm from "./WithdrawalForm";

type Affiliate = {
  id: string;
  name: string;
  code: string;
  commission_rate: number;
  offer_slug: string | null;
  active: boolean;
};

type OrderRequest = {
  id: string;
  full_name: string;
  offer_requested: string | null;
  status: string;
  sale_confirmed: boolean;
  created_at: string;
};

type Withdrawal = {
  id: string;
  amount_requested: number | null;
  status: string;
  created_at: string;
};

export default function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [clicksCount, setClicksCount] = useState(0);
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [offerPrices, setOfferPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: aff } = await supabase
      .from("affiliates")
      .select("*")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!aff) {
      setLoading(false);
      return;
    }
    setAffiliate(aff);

    const { count } = await supabase
      .from("referral_clicks")
      .select("*", { count: "exact", head: true })
      .eq("code", aff.code);
    setClicksCount(count || 0);

    const { data: reqs } = await supabase
      .from("order_requests")
      .select("*")
      .eq("referral_code", aff.code)
      .order("created_at", { ascending: false });
    setRequests((reqs as OrderRequest[]) || []);

    const { data: wds } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("affiliate_id", aff.id)
      .order("created_at", { ascending: false });
    setWithdrawals((wds as Withdrawal[]) || []);

    const { data: offers } = await supabase
      .from("offers")
      .select("title, price");
    const priceMap: Record<string, number> = {};
    (offers || []).forEach((o) => {
      if (o.price) priceMap[o.title] = o.price;
    });
    setOfferPrices(priceMap);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return null;

  if (!affiliate) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center text-sm opacity-70">
        Ce compte n&apos;est pas encore rattaché à un profil affilié.
        Contacte Samuel.
      </div>
    );
  }

  if (!affiliate.active) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="font-display text-xl font-bold text-red-500">
          Compte suspendu
        </p>
        <p className="mt-2 text-sm opacity-70">
          Ton accès affilié a été temporairement suspendu. Contacte Samuel
          pour plus d&apos;informations.
        </p>
      </div>
    );
  }

  const link = affiliate.offer_slug
    ? `https://empire-chapeau-noir.vercel.app/offres/${affiliate.offer_slug}?ref=${affiliate.code}`
    : `https://empire-chapeau-noir.vercel.app/offres?ref=${affiliate.code}`;
  const confirmedSales = requests.filter((r) => r.sale_confirmed);
  const estimatedCommission = confirmedSales.reduce((sum, r) => {
    const price = r.offer_requested ? offerPrices[r.offer_requested] : 0;
    return sum + ((price || 0) * affiliate.commission_rate) / 100;
  }, 0);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Empire Chapeau Noir",
          text: "Découvre cette formation !",
          url: link,
        });
      } catch {
        // partage annulé, rien à faire
      }
    } else {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          Salut {affiliate.name} 👋
        </h1>
        <button
          onClick={() => supabase.auth.signOut().then(() => location.reload())}
          className="text-xs font-semibold opacity-60"
        >
          Se déconnecter
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 p-5 dark:border-white/10">
        <p className="text-xs uppercase tracking-wide opacity-60">
          Ton lien à partager
        </p>
        <p className="mt-2 break-all font-mono text-sm text-accent">{link}</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold dark:border-white/15"
          >
            {copied ? "Copié !" : "Copier"}
          </button>
          <button
            onClick={handleShare}
            className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white"
          >
            Partager
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <p className="font-display text-xl font-bold text-accent">
            {clicksCount}
          </p>
          <p className="text-[11px] uppercase tracking-wide opacity-60">
            Clics
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <p className="font-display text-xl font-bold text-accent">
            {requests.length}
          </p>
          <p className="text-[11px] uppercase tracking-wide opacity-60">
            Demandes
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <p className="font-display text-xl font-bold text-emerald-500">
            {confirmedSales.length}
          </p>
          <p className="text-[11px] uppercase tracking-wide opacity-60">
            Ventes confirmées
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <p className="font-display text-xl font-bold text-gold">
            {estimatedCommission.toLocaleString("fr-FR")} CFA
          </p>
          <p className="text-[11px] uppercase tracking-wide opacity-60">
            Commission
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs opacity-50">
        Taux de commission : {affiliate.commission_rate}% · Calculée
        uniquement sur les ventes que Samuel a confirmées.
      </p>

      {estimatedCommission > 0 ? (
        <WithdrawalForm
          affiliateId={affiliate.id}
          defaultName={affiliate.name}
          estimatedAmount={estimatedCommission}
        />
      ) : (
        <p className="mt-4 text-sm opacity-60">
          Pas encore de vente confirmée — continue à partager ton lien !
        </p>
      )}

      {withdrawals.length > 0 && (
        <div className="mt-8">
          <p className="font-display text-sm font-bold">
            Mes demandes de retrait
          </p>
          <div className="mt-3 space-y-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-xl border border-black/10 p-3 text-sm dark:border-white/10"
              >
                <span>
                  {w.amount_requested
                    ? Number(w.amount_requested).toLocaleString("fr-FR")
                    : "-"}{" "}
                  CFA ·{" "}
                  {new Date(w.created_at).toLocaleDateString("fr-FR")}
                </span>
                <span
                  className={
                    w.status === "payé"
                      ? "font-semibold text-emerald-500"
                      : "font-semibold text-gold"
                  }
                >
                  {w.status === "payé" ? "Payé" : "En attente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <p className="font-display text-sm font-bold">
          Demandes générées par ton lien
        </p>
        <div className="mt-3 space-y-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-black/10 p-3 text-sm dark:border-white/10"
            >
              <p className="font-semibold">{r.full_name}</p>
              <p className="text-xs opacity-60">
                {r.offer_requested || "Offre non précisée"} ·{" "}
                {new Date(r.created_at).toLocaleDateString("fr-FR")} ·{" "}
                {r.sale_confirmed ? (
                  <span className="text-emerald-500">Vente confirmée</span>
                ) : (
                  "En attente"
                )}
              </p>
            </div>
          ))}
          {requests.length === 0 && (
            <p className="text-sm opacity-60">
              Aucune demande générée pour l&apos;instant — partage ton lien !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
