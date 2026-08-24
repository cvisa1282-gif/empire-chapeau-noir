import { supabase } from "../lib/supabase";

export const revalidate = 60;

export default async function TestimonialStrip() {
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const testimonials = data || [];

  if (testimonials.length === 0) return null;

  return (
    <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="relative flex h-72 w-48 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10"
        >
          <span className="absolute left-2 top-2 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            ✓ Vérifié
          </span>
          {t.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.image_url}
              alt={t.author_name || "Témoignage"}
              className="h-full w-full object-cover"
            />
          )}
          {t.content && (
            <p className="absolute bottom-0 bg-black/60 p-2 text-xs text-white">
              {t.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
