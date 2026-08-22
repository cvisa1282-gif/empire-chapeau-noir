import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquante côté serveur." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // Vérifie que le token appartient bien à un admin
  const anonClient = createClient(supabaseUrl, anonKey);
  const { data: userData, error: userError } = await anonClient.auth.getUser(
    token
  );
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Session invalide." }, { status: 401 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: adminRow } = await adminClient
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { name, phone, email, password, commissionRate } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nom, email et mot de passe requis." },
      { status: 400 }
    );
  }

  // Crée le compte de connexion de l'affilié
  const { data: created, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message || "Impossible de créer le compte." },
      { status: 400 }
    );
  }

  const code = randomCode();

  const { error: insertError } = await adminClient.from("affiliates").insert({
    user_id: created.user.id,
    name,
    phone: phone || null,
    code,
    commission_rate: commissionRate || 20,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ code });
}
