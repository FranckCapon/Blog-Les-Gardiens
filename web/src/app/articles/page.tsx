import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ArticleCard } from "@/components/content/article-card";
import { Pagination, param, parsePage } from "@/components/content/pagination";
import { PageHeader } from "@/components/layout/page-header";
import { listArticles, listArticleTags } from "@/lib/data/articles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Articles",
  description: "Actualités, comptes rendus et annonces du club Les Gardiens de la Légende.",
};

export default function ArticlesPage({ searchParams }: PageProps<"/articles">) {
  return (
    <main className="flex-1">
      <PageHeader title="Articles">Les actualités et comptes rendus des Gardiens.</PageHeader>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-muted-foreground">Chargement des articles…</p>}>
          <ArticleList searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function ArticleList({ searchParams }: Pick<PageProps<"/articles">, "searchParams">) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const tagParam = param(sp.categorie);
  const tags = await listArticleTags();
  const activeTag = tags.find((t) => String(t.id) === tagParam);
  const { items, pageCount } = await listArticles({ tagId: activeTag?.id, page });

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
      active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent",
    );

  return (
    <>
      <nav aria-label="Catégories" className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/articles"
          className={chip(!activeTag)}
          aria-current={!activeTag ? "page" : undefined}
        >
          Tous
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/articles?categorie=${tag.id}`}
            className={chip(activeTag?.id === tag.id)}
            aria-current={activeTag?.id === tag.id ? "page" : undefined}
          >
            {tag.name}
          </Link>
        ))}
      </nav>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Aucun article pour le moment.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        pageCount={pageCount}
        pathname="/articles"
        params={{ categorie: activeTag ? String(activeTag.id) : undefined }}
      />
    </>
  );
}
