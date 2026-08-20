import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client "anon" — utilisable côté navigateur, protégé par les règles RLS
// que l'on définira dans Supabase (lecture publique du blog/témoignages,
// écriture publique uniquement sur newsletter + demandes de commande).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
