import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminHeader } from "@/components/admin/admin-ui";
import { requirePermission } from "@/lib/auth/guards";
import { listArticleTagOptions } from "@/lib/data/admin";

import { createArticle } from "../actions";
import { ArticleForm } from "../article-form";

export const metadata: Metadata = { title: "Nouvel article · Administration" };

export default function NewArticlePage() {
  return (
    <>
      <AdminHeader title="Nouvel article" back={{ href: "/admin/articles", label: "Articles" }} />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <NewArticle />
      </Suspense>
    </>
  );
}

async function NewArticle() {
  await requirePermission({ article: ["create"] }, "/admin/articles/nouveau");
  const tags = await listArticleTagOptions();
  return <ArticleForm action={createArticle} tags={tags} submitLabel="Publier l'article" />;
}
