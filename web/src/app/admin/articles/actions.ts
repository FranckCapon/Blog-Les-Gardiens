"use server";

import { eq, like, or } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { type FormState, formValues, pgCode, validId } from "@/lib/actions";
import { requirePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { article } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";
import { articleInput, fieldErrors } from "@/lib/validation/content";

/** Slug libre dérivé du titre : « mon-titre », sinon « mon-titre-2 », etc. */
async function uniqueSlug(title: string) {
  const base = slugify(title) || "article";
  const taken = new Set(
    (
      await db
        .select({ slug: article.slug })
        .from(article)
        .where(or(eq(article.slug, base), like(article.slug, `${base}-%`)))
    ).map((r) => r.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

function saveError(error: unknown, formData: FormData): FormState {
  const values = formValues(formData);
  if (pgCode(error) === "23505") {
    return { errors: { title: "Un article porte déjà ce titre." }, values };
  }
  if (pgCode(error) === "23503") {
    return { errors: { tagId: "Cette catégorie n'existe plus." }, values };
  }
  throw error;
}

export async function createArticle(_: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requirePermission({ article: ["create"] });
  const parsed = articleInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }

  const slug = await uniqueSlug(parsed.data.title);
  try {
    await db.insert(article).values({ ...parsed.data, slug, authorId: user.id });
  } catch (error) {
    return saveError(error, formData);
  }
  updateTag("articles");
  updateTag(`article:${slug}`);
  redirect("/admin/articles?ok=cree");
}

export async function updateArticle(
  id: number,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  await requirePermission({ article: ["update"] });
  const articleId = validId(id);
  if (!articleId) return { message: "Cet article n'existe plus." };
  const parsed = articleInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), values: formValues(formData) };
  }

  // Le slug ne change pas avec le titre : les liens déjà partagés restent valides.
  let updated: { slug: string }[];
  try {
    updated = await db
      .update(article)
      .set(parsed.data)
      .where(eq(article.id, articleId))
      .returning({ slug: article.slug });
  } catch (error) {
    return saveError(error, formData);
  }
  if (!updated[0]) return { message: "Cet article n'existe plus." };

  updateTag("articles");
  updateTag(`article:${updated[0].slug}`);
  redirect("/admin/articles?ok=modifie");
}

export async function deleteArticle(id: number) {
  await requirePermission({ article: ["delete"] });
  const articleId = validId(id);
  if (!articleId) redirect("/admin/articles");
  const [deleted] = await db
    .delete(article)
    .where(eq(article.id, articleId))
    .returning({ slug: article.slug });
  if (deleted) {
    updateTag("articles");
    updateTag(`article:${deleted.slug}`);
  }
  redirect("/admin/articles?ok=supprime");
}
