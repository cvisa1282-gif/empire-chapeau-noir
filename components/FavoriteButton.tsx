"use client";

import { useEffect, useState } from "react";

export default function FavoriteButton({
  offerId,
  offerTitle,
  offerSlug,
}: {
  offerId: string;
  offerTitle: string;
  offerSlug: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.some((f: { id: string }) => f.id === offerId));
  }, [offerId]);

  function toggle() {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let next;
    if (isFavorite) {
      next = favs.filter((f: { id: string }) => f.id !== offerId);
    } else {
      next = [...favs, { id: offerId, title: offerTitle, slug: offerSlug }];
    }
    localStorage.setItem("favorites", JSON.stringify(next));
    setIsFavorite(!isFavorite);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Ajouter aux favoris"
      className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/15"
    >
      {isFavorite ? "★ Dans mes favoris" : "☆ Ajouter aux favoris"}
    </button>
  );
}
