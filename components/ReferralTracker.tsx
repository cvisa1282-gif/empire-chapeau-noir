"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!ref) return;
    localStorage.setItem("referral_code", ref);
    supabase.from("referral_clicks").insert({ code: ref });
  }, [ref]);

  return null;
}
