"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Testimonial = {
  id: string;
  author_name: string | null;
  content: string | null;
  image_url: string | null;
};

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Testimonial[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      const fileName = `testimonials/${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage
        .from("site-media")
        .upload(fileName, imageFile);
      if (!error) {
        const { data } = supabase.storage
          .from("site-media")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
    }

    await supabase.from("testimonials").insert({
      author_name: authorName || null,
      content: content || null,
      image_url: imageUrl,
    });

    setAuthorName("");
    setContent("");
    setImageFile(null);
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-black/10 p-5 dark:border-white/10"
      >
        <p className="font-display text-sm font-bold">Nouveau témoignage</p>
        <input
          placeholder="Nom (optionnel)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <textarea
          placeholder="Texte du témoignage (optionnel si tu mets juste une image)"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-xs"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "..." : "Ajouter"}
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {loading && <p className="text-sm opacity-60">Chargement...</p>}
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            {t.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.image_url}
                alt=""
                className="mb-2 h-32 w-full rounded-lg object-cover"
              />
            )}
            {t.author_name && (
              <p className="text-sm font-semibold">{t.author_name}</p>
            )}
            {t.content && <p className="text-xs opacity-70">{t.content}</p>}
            <button
              onClick={() => remove(t.id)}
              className="mt-2 text-xs font-semibold text-red-500"
            >
              Supprimer
            </button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm opacity-60">Aucun témoignage pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
