import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export const revalidate = 0;

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();

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
