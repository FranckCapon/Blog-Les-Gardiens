# Les Gardiens de la Légende — nouvelle version

Refonte du site du club avec une stack actuelle : **Next.js 16** (App Router) en TypeScript,
**Drizzle ORM** sur PostgreSQL, **Better Auth**, **Tailwind CSS v4** et **shadcn/ui**.

L'ancienne application (`../FRONT` et `../BACK`) reste en place jusqu'à la bascule.

## Prérequis

- Node.js 20.9 ou plus récent
- Docker (pour la base PostgreSQL locale)

## Démarrer

```bash
cd web
npm install
cp .env.example .env.local   # puis renseigner BETTER_AUTH_SECRET
npm run db:up                # lance PostgreSQL 17 en Docker
npm run db:migrate           # crée les tables
npm run db:seed              # facultatif : données de démonstration
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                | Rôle                                                   |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Serveur de développement                               |
| `npm run build`       | Build de production                                    |
| `npm run test`        | Tests unitaires (Vitest)                               |
| `npm run role`        | Change le rôle d'un membre                             |
| `npm run lint`        | ESLint (règles Next.js + TypeScript)                   |
| `npm run typecheck`   | Vérification des types TypeScript                      |
| `npm run format`      | Formatage Prettier (tri des classes Tailwind inclus)   |
| `npm run db:up`       | Démarre PostgreSQL avec Docker Compose                 |
| `npm run db:generate` | Génère une migration SQL depuis `src/lib/db/schema.ts` |
| `npm run db:migrate`  | Applique les migrations du dossier `drizzle/`          |
| `npm run db:pull`     | Génère un schéma Drizzle à partir d'une base existante |
| `npm run db:seed`     | Ajoute les données de démonstration (base vide)        |
| `npm run db:studio`   | Ouvre Drizzle Studio pour explorer la base             |

## Données de démonstration

`npm run db:seed` remplit une base vide avec :

- les 17 articles de l'ancien site (`BACK/data/article_seed.sql`) ;
- les 412 jeux possédés par le club, issus de son export BoardGameGeek (`BACK/data/data2.sql`) ;
- 5 événements, dont 3 à venir datés par rapport au jour du lancement ;
- 4 comptes fictifs en `@example.org` (mot de passe `demo-gardiens`), dont un modérateur et un admin.

Les fichiers sources sont dans `scripts/seed-data/`.

## Contenu public

Les pages Articles, Nos jeux et Événements lisent la base côté serveur via `src/lib/data/`.
Les résultats sont mis en cache une heure (`"use cache"`, étiquettes `articles`, `games`,
`events`). Chaque Server Action qui écrit appelle `updateTag(...)` sur les étiquettes touchées :
la page suivante affiche tout de suite la donnée à jour.
Les filtres passent par l'URL (`/jeux?q=catan&joueurs=4`), ce qui rend les recherches partageables.

## Inscriptions aux événements

Un membre connecté s'inscrit ou se désinscrit depuis la page de l'événement, tant qu'il
n'a pas commencé. Une désinscription garde la ligne (`cancelled_at`) et une nouvelle
inscription la réactive. Ses inscriptions à venir apparaissent sur `/profil`. Le public ne
voit que le nombre d'inscrits ; les pseudos ne sont visibles que de l'équipe, dans
l'administration.

## Administration

`/admin` propose les écrans permis par le rôle :

| Écran             | Créer / modifier  | Supprimer |
| ----------------- | ----------------- | --------- |
| Articles          | modérateur, admin | admin     |
| Événements        | modérateur, admin | admin     |
| Ludothèque (jeux) | admin             | admin     |

Les formulaires (`useActionState`) envoient à des Server Actions (`src/app/admin/*/actions.ts`)
qui revérifient la permission, valident la saisie avec Zod (`src/lib/validation/content.ts`)
et renvoient les erreurs champ par champ. Les dates d'événement se saisissent à l'heure de
Paris. Le slug d'un article est fixé à sa création, pour ne pas casser les liens partagés.

## Comptes et rôles

L'authentification est gérée par [Better Auth](https://www.better-auth.com) :
inscription avec pseudo, prénom, nom, e-mail et mot de passe (10 caractères minimum),
confirmation de l'adresse par e-mail, mot de passe oublié, et session dans un cookie
`HttpOnly` (`Secure` en production), jamais accessible au JavaScript de la page.
Sans `SMTP_URL`, les e-mails (liens de confirmation et de réinitialisation) s'affichent
dans la console du serveur.

| Rôle         | Peut                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| `membre`     | Gérer son profil, s'inscrire aux événements (rôle par défaut)            |
| `moderateur` | En plus : rédiger et modifier des articles, organiser des événements     |
| `admin`      | Tout, y compris supprimer du contenu et gérer les membres et leurs rôles |

Les permissions sont définies dans `src/lib/auth/permissions.ts`. Chaque page
d'administration et chaque Server Action qui écrit des données commence par
`requirePermission(...)` (`src/lib/auth/guards.ts`) : c'est ce contrôle côté serveur qui
fait foi. Le rôle ne peut pas être choisi à l'inscription ni modifié par le membre ;
la liste des membres n'est accessible qu'aux administrateurs.

Pour désigner le premier administrateur, après son inscription :

```bash
npm run role -- adresse@exemple.fr admin
```

Les comptes repris de l'ancienne base gardent leur mot de passe : les hashes bcrypt sont
acceptés, puis remplacés par un hash scrypt au prochain changement de mot de passe.

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
  app/(compte)/     connexion, inscription, mot de passe oublié
  app/profil/       profil du membre connecté
  app/admin/        administration (modérateurs et administrateurs)
  lib/auth/         Better Auth : configuration, rôles, contrôles d'accès
  lib/data/         lectures en base (articles, jeux, événements), en cache
  lib/db/schema/    schéma Drizzle (comptes et contenu du site)
  proxy.ts          redirection rapide vers la connexion sur les pages privées
  lib/utils.ts      utilitaire cn() pour les classes Tailwind
drizzle/            migrations SQL versionnées (créé par db:generate)
```
