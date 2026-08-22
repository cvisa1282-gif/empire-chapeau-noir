import Link from "next/link";
import { supabase } from "../../lib/supabase";

export const revalidate = 0;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
};

export default async function BlogPage() {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const posts = (data as Post[]) || [];

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <span className="seal text-xs font-bold uppercase tracking-wide text-gold">
        Blog
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">
        Actualités & conseils
      </h1>

      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex gap-4 rounded-2xl border border-black/10 p-5 transition hover:border-accent dark:border-white/10"
          >
            {post.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image_url}
                alt=""
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
            )}
            <div>
              <h2 className="font-display text-lg font-bold">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-1 text-sm opacity-70">{post.excerpt}</p>
              )}
              <p className="mt-2 text-xs opacity-50">
                {new Date(post.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-sm opacity-60">
            Aucun article publié pour l&apos;instant — reviens bientôt !
          </p>
        )}
      </div>
    </section>
  );
}
