import Image from "next/image";

// 👉 Pour ajouter un témoignage : dépose l'image dans /public,
// puis ajoute une ligne ici. On passera sur Supabase Storage
// plus tard pour que tu puisses gérer ça sans redéployer.
const testimonials = [
  { src: "/temoignage-1.jpg", alt: "Capture de résultats d'un élève" },
  { src: "/temoignage-2.jpg", alt: "Capture de résultats d'un élève" },
  { src: "/temoignage-3.jpg", alt: "Capture de résultats d'un élève" },
  { src: "/temoignage-4.jpg", alt: "Capture de résultats d'un élève" },
];

export default function TestimonialStrip() {
  return (
    <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="relative h-72 w-48 shrink-0 snap-start overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10"
        >
          <Image src={t.src} alt={t.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
