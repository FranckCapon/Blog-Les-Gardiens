![Bannière des Gardiens de la Légende](conception/image/medieval.jpg)

<img align="left" src="conception/image/logo-noir.png" alt="Logo des Gardiens de la Légende" width="90"/>

# Les Gardiens de la Légende

Site du club de jeux **Les Gardiens de la Légende**, à Avrillé (Maine-et-Loire), depuis 1987 :
jeux de rôle, grandeur nature, jeux de plateau et jeux de cartes.

Ce dépôt contient la **refonte complète** du site, menée en 2026 comme projet de
certification. L'application actuelle se trouve dans le dossier [`web/`](web/). L'ancienne
version (React 17 et Express) est conservée dans `FRONT/` et `BACK/` jusqu'à la mise en ligne
de la nouvelle.

## Le site en bref

- **Pour tout le monde :** présentation du club, articles du blog avec catégories, catalogue
  de la ludothèque (412 jeux, recherche et filtres), agenda des événements, page contact et
  mentions légales.
- **Pour les membres :** création de compte avec confirmation de l'adresse e-mail, mot de
  passe oublié, profil, inscription et désinscription aux événements.
- **Pour l'équipe :** administration des articles, des événements (avec les jeux au
  programme et la liste des inscrits) et de la ludothèque, et gestion des rôles des membres.

## Pourquoi une refonte

L'ancienne version séparait une application React 17 avec Redux et une API Express 4. Elle
écrivait le SQL à la main et gérait les sessions avec un JWT maison. Ces briques ne sont plus
maintenues ou sont devenues difficiles à faire évoluer. Un audit a aussi relevé des points de
sécurité à corriger : contrôles de rôle incomplets sur l'API, jeton accessible au JavaScript de
la page, liste des membres publique.

La refonte garde le modèle de données et le contenu du club, et repart sur une base actuelle,
typée et testée.

## Stack technique

| Besoin           | Choix                                          | Pourquoi                                                                                     |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Application      | **Next.js 16** (App Router), React 19          | Une seule application remplace le front et l'API : pages, données et actions au même endroit |
| Langage          | **TypeScript** (mode strict)                   | Les erreurs de types sont détectées avant l'exécution                                        |
| Base de données  | **PostgreSQL** avec **Drizzle ORM**            | Requêtes typées, schéma versionné par migrations SQL, reprise du schéma d'origine            |
| Authentification | **Better Auth**                                | Comptes, vérification d'e-mail, réinitialisation, rôles, sessions sécurisées                 |
| Interface        | **Tailwind CSS 4** et composants **shadcn/ui** | Composants accessibles, copiés dans le projet et modifiables                                 |
| Validation       | **Zod**                                        | Mêmes règles de saisie côté serveur, avec messages en français                               |
| Tests            | **Vitest**, **Playwright**                     | Tests unitaires dans le dépôt ; parcours complets vérifiés dans un vrai navigateur           |

Les choix et les alternatives étudiées (React Router 7, Prisma) sont détaillés dans la
proposition d'architecture validée le 21 novembre 2026.

## Choix d'architecture

- **Rendu côté serveur et cache.** Les pages publiques sont pré-rendues et leurs données
  mises en cache (`"use cache"`). Seules les parties propres au visiteur, comme la session ou
  l'inscription à un événement, sont calculées à la demande (Partial Prerendering).
- **Server Actions plutôt qu'une API REST.** Les formulaires appellent directement des
  fonctions serveur. Chacune contrôle les droits, valide la saisie avec Zod, écrit en base,
  puis invalide uniquement les pages concernées (`updateTag`). Le site affiche ainsi
  immédiatement la donnée à jour, sans tout recalculer.
- **Formulaires sans bibliothèque dédiée.** `useActionState` de React 19 suffit ici : les
  formulaires d'administration fonctionnent même avant le chargement du JavaScript, et les erreurs sont
  renvoyées champ par champ.
- **Reprise du modèle de données.** Les tables de l'ancienne base (articles, jeux,
  événements, étiquettes) sont reprises dans le schéma Drizzle. Les domaines SQL d'origine y
  deviennent des contraintes `CHECK`. Les mots de passe bcrypt existants restent acceptés.
- **Code organisé par responsabilité** dans `web/src/` : routes dans `app/`, lectures en base
  dans `lib/data/`, règles de saisie dans `lib/validation/`, droits dans `lib/auth/`.

## Sécurité

- **Contrôle des droits côté serveur, partout.** Chaque page d'administration et chaque
  action qui écrit vérifie la session et la permission du rôle (`requirePermission`).
  L'interface masque ce qui n'est pas permis, mais c'est le serveur qui décide. Ces refus ont
  été vérifiés en rejouant des requêtes avec un rôle insuffisant ou sans session.
- **Trois rôles :** `membre`, `moderateur` (articles et événements) et `admin` (tout, y
  compris les suppressions, la ludothèque et les rôles). Le rôle ne peut pas être choisi à
  l'inscription, et un administrateur ne peut pas modifier son propre rôle.
- **Session dans un cookie `HttpOnly`**, marqué `Secure` en production, et jamais lisible
  par le JavaScript de la page.
- **Mots de passe** de 10 caractères minimum, hachés avec scrypt. La connexion et
  l'inscription sont limitées en nombre de tentatives.
- **Données personnelles :** la liste des membres n'est visible que par les administrateurs.
  Le public ne voit que le nombre d'inscrits à un événement.

## Démarrer

Tout se passe dans le dossier [`web/`](web/). Son [README](web/README.md) détaille les
prérequis, les variables d'environnement, les scripts et les données de démonstration. En
résumé :

```bash
cd web
npm install
cp .env.example .env.local   # puis renseigner DATABASE_URL et BETTER_AUTH_SECRET
npm run db:migrate           # crée les tables
npm run db:seed              # articles, 412 jeux du club, événements et comptes de démo
npm run dev                  # http://localhost:3000
```

## Avancement

| Étape | Contenu                                                                     | État     |
| ----- | --------------------------------------------------------------------------- | -------- |
| 1     | Socle de l'application (Next.js, TypeScript, Tailwind, outillage)           | Terminée |
| 2     | Base de données, authentification et rôles                                  | Terminée |
| 3     | Mise en page : en-tête, menu mobile, accueil, club, contact, mentions       | Terminée |
| 4     | Contenu public : articles, ludothèque, événements, données de démonstration | Terminée |
| 5     | Inscriptions aux événements et administration du contenu                    | Terminée |
| 6     | Jeux au programme des événements et gestion des rôles                       | Terminée |
| 7     | Reprise des données de l'ancienne base de production                        | À venir  |
| 8     | Mise en ligne, puis retrait de l'ancienne version                           | À venir  |

**Prochaines étapes :**

- Compléter les mentions légales : l'hébergeur et les durées de conservation des données.
- Choisir l'hébergement. Vercel avec une base Neon est envisagé, mais pas encore validé.
- Ajouter au dépôt les tests de bout en bout Playwright et une intégration continue
  (GitHub Actions).

## Conception

Les documents de conception de l'équipe d'origine sont dans [`conception/`](conception/) :
[user stories](conception/Users_stories.md), [modèle conceptuel de données](conception/MCD.md)
et maquettes.

## Auteurs

Équipe d'origine du projet :

- **Product Owner :** Franck Capon
- **Scrum Master :** Laura Grenier
- **Lead dev :** Lorène Meslin
- **Git master :** Romain Boudet

Refonte de 2026 : Franck Capon, avec l'aide de Claude Code.

## Ancienne version

L'ancienne version reste consultable dans `FRONT/` (React 17, Redux, Semantic UI, Webpack) et
`BACK/` (Node.js, Express 4, PostgreSQL avec Sqitch, Joi, Mocha et Chai, Redis). Ses
instructions d'installation se trouvent dans `FRONT/INSTALL.md` et dans l'historique Git de ce
fichier. Ces deux dossiers seront retirés après la mise en ligne de la nouvelle application.
