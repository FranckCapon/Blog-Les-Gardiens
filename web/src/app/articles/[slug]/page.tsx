import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Badge } from "@/components/content/badge";
import { getArticleBySlug } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug);
  // notFound() ici renvoie un vrai 404 aux robots, pour qui les métadonnées sont bloquantes.
  if (!article) notFound();
  return { title: article.title, description: article.content.slice(0, 160) };
}

export default function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Tous les articles
        </Link>
        <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
          <ArticleContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function ArticleContent({ params }: Pick<PageProps<"/articles/[slug]">, "params">) {
  const article = await getArticleBySlug((await params).slug);
  if (!article) notFound();

  // Le contenu est du texte brut : un paragraphe par bloc séparé d'une ligne vide.
  const paragraphs = article.content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <article>
      <header className="grid gap-4 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge>{article.tag}</Badge>
          <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt)}</time>
          <span aria-hidden>·</span>
          <span>par {article.author}</span>
        </div>
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-wide text-balance sm:text-4xl">
          {article.title}
        </h1>
      </header>
      <div className="mt-6 grid gap-4 text-base leading-7">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p.trim()}
          </p>
        ))}
      </div>
    </article>
  );
}
