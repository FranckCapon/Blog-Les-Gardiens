import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Pagination par liens, qui conserve les autres paramètres de l'URL (filtres). */
export function Pagination({
  page,
  pageCount,
  pathname,
  params,
}: {
  page: number;
  pageCount: number;
  pathname: string;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
  const linkClass =
    "inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm font-medium hover:bg-accent";
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass} rel="prev">
          <ChevronLeft className="size-4" aria-hidden />
          Précédent
        </Link>
      ) : (
        <span />
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} sur {pageCount}
      </p>
      {page < pageCount ? (
        <Link href={href(page + 1)} className={cn(linkClass)} rel="next">
          Suivant
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Lit un numéro de page depuis l'URL ; toute valeur invalide donne 1. */
export function parsePage(value: string | string[] | undefined) {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** Lit un paramètre texte unique depuis l'URL. */
export function param(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || undefined;
}
