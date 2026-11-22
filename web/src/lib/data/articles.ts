import "server-only";

import { and, count, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib/db";
import { article, articleTag, user } from "@/lib/db/schema";

export const ARTICLES_PER_PAGE = 9;

/** Extrait court d'un article, coupé sur un mot. */
function excerpt(content: string, length = 220) {
  const flat = content.replace(/\s+/g, " ").trim();
  if (flat.length <= length) return flat;
  return `${flat.slice(0, flat.lastIndexOf(" ", length))}…`;
}

const articleSummary = {
  id: article.id,
  title: article.title,
  slug: article.slug,
  content: article.content,
  createdAt: article.createdAt,
  author: user.name,
  tag: articleTag.name,
  tagId: articleTag.id,
};

export async function listArticles({ tagId, page }: { tagId?: number; page: number }) {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  const where = tagId ? eq(article.tagId, tagId) : undefined;
  const [rows, [{ total }]] = await Promise.all([
    db
      .select(articleSummary)
      .from(article)
      .innerJoin(user, eq(user.id, article.authorId))
      .innerJoin(articleTag, eq(articleTag.id, article.tagId))
      .where(where)
      .orderBy(desc(article.createdAt))
      .limit(ARTICLES_PER_PAGE)
      .offset((page - 1) * ARTICLES_PER_PAGE),
    db.select({ total: count() }).from(article).where(where),
  ]);

  return {
    items: rows.map(({ content, ...a }) => ({ ...a, excerpt: excerpt(content) })),
    total,
    pageCount: Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE)),
  };
}

export async function latestArticles(limit = 3) {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  return (await listArticles({ page: 1 })).items.slice(0, limit);
}

export async function getArticleBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("articles", `article:${slug}`);

  const [row] = await db
    .select(articleSummary)
    .from(article)
    .innerJoin(user, eq(user.id, article.authorId))
    .innerJoin(articleTag, eq(articleTag.id, article.tagId))
    .where(and(eq(article.slug, slug)))
    .limit(1);
  return row ?? null;
}

export async function listArticleTags() {
  "use cache";
  cacheLife("days");
  cacheTag("articles");
  const tags = await db.select().from(articleTag);
  return tags.sort((a, b) => a.name.localeCompare(b.name, "fr"));
}
