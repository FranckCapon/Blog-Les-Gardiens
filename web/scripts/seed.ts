// Remplit une base vide avec des données de démonstration :
//   npm run db:seed
// - les 17 articles de l'ancien site (BACK/data/article_seed.sql) ;
// - les 412 jeux possédés par le club, issus de son export BoardGameGeek (BACK/data/data2.sql) ;
// - des événements de démonstration, datés par rapport à aujourd'hui ;
// - 4 comptes fictifs (mot de passe : « demo-gardiens ») pour signer les contenus.
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { hashPassword } from "better-auth/crypto";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "../src/lib/db/schema";
import { slugify } from "../src/lib/slug";

config({ path: ".env.local" });

const db = drizzle(process.env.DATABASE_URL!, { schema });
const read = <T>(file: string): T =>
  JSON.parse(readFileSync(path.join(__dirname, "seed-data", file), "utf8")) as T;

type SeedArticle = {
  title: string;
  content: string;
  publishedAt: string;
  author: number;
  tag: number;
};
type SeedGame = {
  bggId: number;
  title: string;
  minPlayers: number;
  maxPlayers?: number;
  durationMinutes?: number;
  year?: number;
  isExpansion: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
};

async function main() {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.article);
  if (count > 0) {
    console.error(
      "La base contient déjà des articles : le jeu de démonstration n'est pas réinséré.",
    );
    process.exit(1);
  }

  await db.transaction(async (tx) => {
    // --- Comptes fictifs -----------------------------------------------------
    const password = await hashPassword("demo-gardiens");
    const people = [
      { name: "Le Scribe", firstName: "Sam", lastName: "Plume", role: "moderateur" },
      { name: "Maître du Jeu", firstName: "Max", lastName: "Dé", role: "admin" },
      { name: "Momo", firstName: "Maurice", lastName: "Thegamer", role: "membre" },
      { name: "Ricette", firstName: "Mauricette", lastName: "Thegameuse", role: "membre" },
    ];
    const users = await tx
      .insert(schema.user)
      .values(
        people.map((p) => ({
          id: randomUUID(),
          ...p,
          email: `${slugify(p.name)}@example.org`,
          emailVerified: true,
        })),
      )
      .returning();
    await tx.insert(schema.account).values(
      users.map((u) => ({
        id: randomUUID(),
        accountId: u.id,
        providerId: "credential",
        userId: u.id,
        password,
      })),
    );
    const [scribe, mj, momo, ricette] = users;

    // --- Étiquettes (reprises de BACK/data/seeding.sql) -----------------------
    const articleTags = await tx
      .insert(schema.articleTag)
      .values([{ name: "Actualités" }, { name: "Événements" }, { name: "Salons" }])
      .returning();
    const eventTags = await tx
      .insert(schema.eventTag)
      .values([{ name: "Soirée jeux" }, { name: "Murder party" }, { name: "Jeu de rôle" }])
      .returning();
    const [baseType, expansionType] = await tx
      .insert(schema.gameType)
      .values([{ name: "Jeu de base" }, { name: "Extension" }])
      .returning();
    const gameTags = await tx
      .insert(schema.gameTag)
      .values([
        { name: "Jeux de plateau" },
        { name: "Jeux de rôle" },
        { name: "Grandeur nature" },
        { name: "Jeux de cartes" },
        { name: "Jeux de figurines" },
      ])
      .returning();

    // --- Articles -------------------------------------------------------------
    const articles = read<SeedArticle[]>("articles.json");
    await tx.insert(schema.article).values(
      articles.map((a) => ({
        title: a.title,
        slug: slugify(a.title),
        content: a.content,
        authorId: a.author === 1 ? mj.id : scribe.id,
        tagId: articleTags[a.tag - 1].id,
        createdAt: new Date(a.publishedAt.replace(" 9:", " 09:")),
      })),
    );

    // --- Jeux -------------------------------------------------------------------
    const details: Record<string, Partial<typeof schema.game.$inferInsert>> = {
      Catan: {
        description:
          "Vous êtes à la tête d'une expédition chargée de coloniser l'île de Catane. Récoltez les ressources, échangez avec les autres joueurs et construisez routes, colonies et villes pour devenir le premier souverain de Catane.",
        author: "Klaus Teuber",
        publisher: "Kosmos",
        minAge: 10,
        quantity: 2,
      },
      "7 Wonders": {
        description:
          "Prenez la tête d'une grande cité de l'Antiquité et faites-la prospérer : ce jeu de cartes et de stratégie se joue en trois âges, avec un draft où chacun garde une carte et passe les autres.",
        author: "Antoine Bauza",
        publisher: "Repos Production",
        minAge: 10,
      },
    };
    const games = read<SeedGame[]>("games.json");
    const inserted = await tx
      .insert(schema.game)
      .values(
        games.map((g) => ({
          ...g,
          typeId: g.isExpansion ? expansionType.id : baseType.id,
          ...details[g.title],
        })),
      )
      .returning({ id: schema.game.id, title: schema.game.title });
    const byTitle = new Map(inserted.map((g) => [g.title, g.id]));
    const boardGames = gameTags[0];
    await tx
      .insert(schema.gameToTag)
      .values(inserted.map((g) => ({ gameId: g.id, tagId: boardGames.id })));

    // --- Événements ---------------------------------------------------------------
    const day = (offset: number, hour: number, minute = 0) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      d.setHours(hour, minute, 0, 0);
      return d;
    };
    const events = await tx
      .insert(schema.event)
      .values([
        {
          title: "Soirée jeux de plateau",
          description:
            "Venez découvrir les nouveautés de la ludothèque ou rejouer vos classiques. Débutants bienvenus, on vous explique les règles !",
          startsAt: day(3, 21),
          creatorId: scribe.id,
          tagId: eventTags[0].id,
        },
        {
          title: "Murder party : le manoir de Blackwood",
          description:
            "Un dîner qui tourne mal, un hôte retrouvé sans vie et douze suspects. Costume conseillé, fourberie obligatoire. Places limitées.",
          startsAt: day(17, 20, 30),
          creatorId: mj.id,
          tagId: eventTags[1].id,
        },
        {
          title: "One-shot L'Appel de Cthulhu",
          description:
            "Une partie d'initiation à l'Appel de Cthulhu pour 5 joueurs, personnages prétirés fournis. Âmes sensibles s'abstenir.",
          startsAt: day(10, 14),
          creatorId: mj.id,
          tagId: eventTags[2].id,
        },
        {
          title: "Une envie de tuer ?",
          description:
            "Vous serez le ou la bienvenue pour assassiner vos amis... dans la bonne humeur, autour d'une murder party.",
          startsAt: new Date("2021-04-03T20:00:00+02:00"),
          creatorId: ricette.id,
          tagId: eventTags[1].id,
        },
        {
          title: "Soirée jeux de printemps",
          description:
            "Si vous voulez nous rejoindre pour une soirée, vous êtes le ou la bienvenue ! Au programme : Catane et 7 Wonders.",
          startsAt: new Date("2021-06-01T19:00:00+02:00"),
          creatorId: momo.id,
          tagId: eventTags[0].id,
        },
      ])
      .returning();
    const gameIds = ["Catan", "7 Wonders"].map((t) => byTitle.get(t)).filter((id) => id != null);
    await tx
      .insert(schema.eventGame)
      .values([
        ...gameIds.map((gameId) => ({ eventId: events[0].id, gameId })),
        ...gameIds.map((gameId) => ({ eventId: events[4].id, gameId })),
      ]);
    await tx.insert(schema.eventParticipant).values([
      { eventId: events[0].id, userId: momo.id },
      { eventId: events[0].id, userId: ricette.id },
      { eventId: events[1].id, userId: momo.id },
      { eventId: events[3].id, userId: momo.id },
      { eventId: events[3].id, userId: ricette.id },
      { eventId: events[4].id, userId: momo.id },
    ]);

    console.log(
      `${users.length} comptes, ${articles.length} articles, ${inserted.length} jeux et ${events.length} événements ajoutés.`,
    );
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
