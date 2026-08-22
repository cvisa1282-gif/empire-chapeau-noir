"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminLogin from "../../components/admin/AdminLogin";
import AdminDashboard from "../../components/admin/AdminDashboard";

export default function AdminPage() {
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
    <AdminDashboard />
  ) : (
    <AdminLogin onLogin={() => setLoggedIn(true)} />
  );
}
