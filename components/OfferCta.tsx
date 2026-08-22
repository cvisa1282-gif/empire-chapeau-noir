"use client";

import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function OfferCta({
  offerId,
  href,
  children,
  className,
}: {
  offerId: string;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        // Fire-and-forget : ne bloque jamais la navigation
        supabase.rpc("increment_offer_views", { offer_id: offerId });
      }}
    >
      {children}
    </Link>
  );
}
