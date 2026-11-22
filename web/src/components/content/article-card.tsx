import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

import { Badge } from "./badge";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  author: string;
  tag: string;
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Card className="relative h-full gap-3 transition-colors hover:border-primary">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge>{article.tag}</Badge>
          <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt)}</time>
        </div>
        <CardTitle className="text-lg leading-snug">
          <Link href={`/articles/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{article.excerpt}</CardContent>
    </Card>
  );
}
