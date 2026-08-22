"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AffiliateLogin from "../../components/affiliate/AffiliateLogin";
import AffiliateDashboard from "../../components/affiliate/AffiliateDashboard";

export default function AffiliatePage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return loggedIn ? (
    <AffiliateDashboard />
  ) : (
    <AffiliateLogin onLogin={() => setLoggedIn(true)} />
  );
}
