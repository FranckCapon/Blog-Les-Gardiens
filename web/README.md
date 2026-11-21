# Les Gardiens de la Légende — nouvelle version

Refonte du site du club avec une stack actuelle : **Next.js 16** (App Router) en TypeScript,
**Drizzle ORM** sur PostgreSQL, **Tailwind CSS v4** et **shadcn/ui**.
L'authentification (Better Auth) arrive à l'étape 3 du plan de migration.

L'ancienne application (`../FRONT` et `../BACK`) reste en place jusqu'à la bascule.

## Prérequis

- Node.js 20.9 ou plus récent
- Docker (pour la base PostgreSQL locale)

## Démarrer

```bash
cd web
npm install
cp .env.example .env.local   # puis adapter DATABASE_URL si besoin
npm run db:up                # lance PostgreSQL 17 en Docker
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                | Rôle                                                   |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Serveur de développement                               |
| `npm run build`       | Build de production                                    |
| `npm run lint`        | ESLint (règles Next.js + TypeScript)                   |
| `npm run typecheck`   | Vérification des types TypeScript                      |
| `npm run format`      | Formatage Prettier (tri des classes Tailwind inclus)   |
| `npm run db:up`       | Démarre PostgreSQL avec Docker Compose                 |
| `npm run db:generate` | Génère une migration SQL depuis `src/lib/db/schema.ts` |
| `npm run db:migrate`  | Applique les migrations du dossier `drizzle/`          |
| `npm run db:pull`     | Génère un schéma Drizzle à partir d'une base existante |
| `npm run db:studio`   | Ouvre Drizzle Studio pour explorer la base             |

## Ajouter un composant shadcn/ui

```bash
npx shadcn@latest add card input form
```

Les composants sont copiés dans `src/components/ui/` et peuvent être modifiés librement.

## Arborescence

```
src/
  app/              routes (App Router)
  components/ui/    composants shadcn/ui
  lib/db/           client et schéma Drizzle
  lib/utils.ts      utilitaire cn() pour les classes Tailwind
drizzle/            migrations SQL versionnées (créé par db:generate)
```
