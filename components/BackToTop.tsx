"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className="fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-paper-50 text-lg shadow-md dark:border-white/15 dark:bg-base-900"
    >
      ↑
    </button>
  );
}
