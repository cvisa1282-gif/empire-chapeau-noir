# Empire Chapeau Noir — Guide de démarrage (Termux)

## 1. Préparer Termux
```
pkg update && pkg upgrade
pkg install nodejs git
```

## 2. Récupérer le projet
Décompresse le dossier `empire-chapeau-noir` reçu, place-toi dedans :
```
cd empire-chapeau-noir
```

## 3. Installer les dépendances
```
npm install
```

## 4. Configurer Supabase
1. Crée un compte sur supabase.com (gratuit)
2. Crée un nouveau projet
3. Dans Project Settings > API, copie l'URL et la clé "anon public"
4. Copie le fichier d'exemple : `cp .env.local.example .env.local`
5. Ouvre `.env.local` et colle tes valeurs

Table à créer dans Supabase (SQL editor) pour la newsletter :
```sql
create table newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Inscription publique"
on newsletter_subscribers for insert
to anon
with check (true);
```

## 5. Tester en local
```
npm run dev
```
Puis ouvre le lien affiché (souvent http://localhost:3000) dans ton navigateur.

## 6. Déployer sur Vercel
```
npm install -g vercel
vercel login
vercel
```
Suis les instructions à l'écran. Pense à ajouter tes variables d'environnement
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`) dans le dashboard Vercel (Project > Settings >
Environment Variables), puis relance `vercel --prod`.

## Où sont les couleurs/le style ?
Tout est centralisé dans `tailwind.config.js` (section `colors`) — dès que tu
m'envoies ton logo et tes couleurs, je mets à jour ce fichier et tout le site
se retexture automatiquement.

## État actuel
Cette première version contient : la page d'accueil, l'ossature du site
(header, footer, bouton WhatsApp, bandeau cookies, newsletter fonctionnelle).
Les pages Offres, Services, Vidéos, À propos, Blog, FAQ, Contact et les pages
légales arrivent dans les prochaines étapes.
