import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const BASE_URL = "https://empire-chapeau-noir.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/offres",
    "/a-propos",
    "/faq",
    "/contact",
    "/blog",
    "/mentions-legales",
    "/confidentialite",
    "/cgv",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, created_at")
    .eq("published", true);

  const blogPages = (posts || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
  }));

  return [...staticPages, ...blogPages];
}
