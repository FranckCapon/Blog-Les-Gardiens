import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdminHeader, parseId } from "@/components/admin/admin-ui";
import { DeleteForm } from "@/components/admin/delete-form";
import { requirePermission } from "@/lib/auth/guards";
import { roleCan } from "@/lib/auth/permissions";
import { getArticleForEdit, listArticleTagOptions } from "@/lib/data/admin";

import { deleteArticle, updateArticle } from "../actions";
import { ArticleForm } from "../article-form";

export const metadata: Metadata = { title: "Modifier un article · Administration" };

export default function EditArticlePage({ params }: PageProps<"/admin/articles/[id]">) {
  return (
    <>
      <AdminHeader
        title="Modifier l'article"
        back={{ href: "/admin/articles", label: "Articles" }}
      />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <EditArticle params={params} />
      </Suspense>
    </>
  );
}

async function EditArticle({ params }: Pick<PageProps<"/admin/articles/[id]">, "params">) {
  const { id: raw } = await params;
  const { user } = await requirePermission({ article: ["update"] }, `/admin/articles/${raw}`);
  const id = parseId(raw);
  const [article, tags] = await Promise.all([
    id ? getArticleForEdit(id) : null,
    listArticleTagOptions(),
  ]);
  if (!article) notFound();

  return (
    <div className="grid gap-8">
      <Link
        href={`/articles/${article.slug}`}
        className="inline-flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        Voir l&apos;article en ligne
        <ExternalLink className="size-4" aria-hidden />
      </Link>
      <ArticleForm
        action={updateArticle.bind(null, article.id)}
        tags={tags}
        defaults={{ title: article.title, content: article.content, tagId: article.tagId }}
        submitLabel="Enregistrer"
      />
      {roleCan(user.role, { article: ["delete"] }) ? (
        <section className="grid gap-3 border-t pt-6">
          <h2 className="font-medium">Supprimer l&apos;article</h2>
          <DeleteForm action={deleteArticle.bind(null, article.id)} label="Supprimer l'article" />
        </section>
      ) : null}
    </div>
  );
}
