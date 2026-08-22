import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.ADMIN_NOTIFY_EMAIL;

  // Si l'alerte email n'est pas configurée, on ne bloque rien —
  // la demande reste visible dans /admin de toute façon.
  if (!apiKey || !toEmail) {
    return NextResponse.json({ skipped: true });
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Empire Chapeau Noir <onboarding@resend.dev>",
        to: [toEmail],
        subject: `Nouvelle demande : ${body.full_name || "Visiteur"}`,
        text:
          `Nom : ${body.full_name || "-"}\n` +
          `Téléphone : ${body.phone || "-"}\n` +
          `Email : ${body.email || "-"}\n` +
          `Offre : ${body.offer_requested || "-"}\n` +
          `Message : ${body.message || "-"}\n\n` +
          `Voir toutes les demandes : https://empire-chapeau-noir.vercel.app/admin`,
      }),
    });
  } catch {
    // On ne fait rien échouer côté base de données si l'email ne part pas
  }

  return NextResponse.json({ ok: true });
}
