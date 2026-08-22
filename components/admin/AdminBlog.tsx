"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published: boolean;
};

const emptyForm = { title: "", excerpt: "", content: "", published: false };

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageUrl: string | undefined;
    if (imageFile) {
      const fileName = `blog/${Date.now()}-${imageFile.name}`;
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

    const payload: Record<string, unknown> = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      published: form.published,
    };
    if (imageUrl) payload.cover_image_url = imageUrl;

    if (editingId) {
      await supabase.from("blog_posts").update(payload).eq("id", editingId);
    } else {
      await supabase
        .from("blog_posts")
        .insert({ ...payload, slug: slugify(form.title) + "-" + Date.now() });
    }

    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setSaving(false);
    load();
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      published: post.published,
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-black/10 p-5 dark:border-white/10"
      >
        <p className="font-display text-sm font-bold">
          {editingId ? "Modifier l'article" : "Nouvel article"}
        </p>
        <input
          required
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          placeholder="Résumé court"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <textarea
          placeholder="Contenu de l'article"
          rows={6}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-xs"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((f) => ({ ...f, published: e.target.checked }))
            }
          />
          Publier immédiatement
        </label>
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
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex-1">
              <p className="font-semibold">{post.title}</p>
              <p className="text-xs opacity-60">
                {post.published ? "Publié" : "Brouillon"}
              </p>
            </div>
            <button
              onClick={() => startEdit(post)}
              className="text-xs font-semibold text-accent"
            >
              Modifier
            </button>
            <button
              onClick={() => remove(post.id)}
              className="text-xs font-semibold text-red-500"
            >
              Supprimer
            </button>
          </div>
        ))}
        {!loading && posts.length === 0 && (
          <p className="text-sm opacity-60">Aucun article pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
