import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { FormMessage } from "@/components/auth/auth-card";
import { buttonVariants } from "@/components/ui/button";

export function AdminHeader({
  title,
  back,
  create,
  children,
}: {
  title: string;
  back?: { href: string; label: string };
  create?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <header className="mb-6 grid gap-3">
      {back ? (
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold tracking-wide">{title}</h1>
        {create ? (
          <Link href={create.href} className={buttonVariants()}>
            <Plus aria-hidden />
            {create.label}
          </Link>
        ) : null}
      </div>
      {children}
    </header>
  );
}

const flashMessages: Record<string, string> = {
  cree: "C'est enregistré : la fiche a été créée.",
  modifie: "C'est enregistré : les modifications sont en ligne.",
  supprime: "La fiche a été supprimée.",
};

/** Confirmation après une action (paramètre ?ok= posé par la redirection). */
export async function Flash({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string | string[] }>;
}) {
  const { ok } = await searchParams;
  const message = typeof ok === "string" ? flashMessages[ok] : undefined;
  if (!message) return null;
  return (
    <div className="mb-4 rounded-md border border-emerald-600/30 bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
      <FormMessage tone="success">{message}</FormMessage>
    </div>
  );
}

export function AdminTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}

/** Identifiant numérique d'une route dynamique, ou null. */
export function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
