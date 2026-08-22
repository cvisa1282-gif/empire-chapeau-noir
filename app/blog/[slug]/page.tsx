import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";

export const revalidate = 0;

async function getPost(slug: string) {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Article introuvable" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt=""
          className="mb-8 h-64 w-full rounded-2xl object-cover"
        />
      )}
      <p className="text-xs opacity-50">
        {new Date(post.created_at).toLocaleDateString("fr-FR")}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
        {post.title}
      </h1>

      <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed opacity-85">
        {post.content}
      </div>
    </article>
  );
}
