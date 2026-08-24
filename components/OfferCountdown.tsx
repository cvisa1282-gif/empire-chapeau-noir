"use client";

import { useEffect, useState } from "react";

export default function OfferCountdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}j ${hours}h ${minutes}min`);
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  return (
    <p className="mt-3 rounded-full bg-ember/15 px-4 py-2 text-sm font-bold text-ember">
      ⏳ Offre limitée — se termine dans {timeLeft}
    </p>
  );
}
