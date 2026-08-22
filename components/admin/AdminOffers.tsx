"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Offer = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  is_free: boolean;
  featured: boolean;
  image_url: string | null;
  position: number | null;
  views: number | null;
  price: number | null;
};

const emptyForm = {
  title: "",
  description: "",
  category: "",
  price: "",
  is_free: false,
  featured: false,
};

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("offers")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false });
    setOffers((data as Offer[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadImageIfAny(): Promise<string | null> {
    if (!imageFile) return null;
    const fileName = `offers/${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage
      .from("site-media")
      .upload(fileName, imageFile);
    if (error) return null;
    const { data } = supabase.storage.from("site-media").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const imageUrl = await uploadImageIfAny();
    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: form.price ? Number(form.price) : null,
      is_free: form.is_free,
      featured: form.featured,
    };
    if (imageUrl) payload.image_url = imageUrl;

    if (editingId) {
      await supabase.from("offers").update(payload).eq("id", editingId);
    } else {
      const maxPos = offers.reduce((m, o) => Math.max(m, o.position || 0), 0);
      await supabase.from("offers").insert({ ...payload, position: maxPos + 1 });
    }

    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setSaving(false);
    load();
  }

  function startEdit(offer: Offer) {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      description: offer.description || "",
      category: offer.category || "",
      price: offer.price ? String(offer.price) : "",
      is_free: offer.is_free,
      featured: offer.featured,
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette offre ?")) return;
    await supabase.from("offers").delete().eq("id", id);
    load();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= offers.length) return;
    const a = offers[index];
    const b = offers[target];
    await supabase.from("offers").update({ position: b.position }).eq("id", a.id);
    await supabase.from("offers").update({ position: a.position }).eq("id", b.id);
    load();
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-black/10 p-5 dark:border-white/10"
      >
        <p className="font-display text-sm font-bold">
          {editingId ? "Modifier l'offre" : "Nouvelle offre"}
        </p>
        <input
          required
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <textarea
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          placeholder="Catégorie (optionnel)"
          value={form.category}
          onChange={(e) =>
            setForm((f) => ({ ...f, category: e.target.value }))
          }
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          type="number"
          min={0}
          placeholder="Prix en CFA (utilisé pour calculer les commissions affiliés)"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-xs"
        />
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_free}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_free: e.target.checked }))
              }
            />
            Gratuit
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((f) => ({ ...f, featured: e.target.checked }))
              }
            />
            Offre phare
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "..." : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-full border border-black/10 px-5 py-2 text-sm dark:border-white/15"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm opacity-60">Chargement...</p>}
        {offers.map((offer, i) => (
          <div
            key={offer.id}
            className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-xs disabled:opacity-30"
                aria-label="Monter"
              >
                ▲
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === offers.length - 1}
                className="text-xs disabled:opacity-30"
                aria-label="Descendre"
              >
                ▼
              </button>
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {offer.title}{" "}
                {offer.featured && (
                  <span className="text-xs text-gold">★ phare</span>
                )}
              </p>
              <p className="text-xs opacity-60">
                {offer.is_free ? "Gratuit" : "Payant"}
                {offer.category ? ` · ${offer.category}` : ""}
                {" · "}
                <span className="font-semibold text-accent">
                  {offer.views || 0} vue{(offer.views || 0) > 1 ? "s" : ""}
                </span>
              </p>
            </div>
            <button
              onClick={() => startEdit(offer)}
              className="text-xs font-semibold text-accent"
            >
              Modifier
            </button>
            <button
              onClick={() => remove(offer.id)}
              className="text-xs font-semibold text-red-500"
            >
              Supprimer
            </button>
          </div>
        ))}
        {!loading && offers.length === 0 && (
          <p className="text-sm opacity-60">Aucune offre pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
