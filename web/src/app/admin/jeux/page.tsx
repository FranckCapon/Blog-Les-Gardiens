import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdminHeader, AdminTable, Flash } from "@/components/admin/admin-ui";
import { Pagination, param, parsePage } from "@/components/content/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requirePermission } from "@/lib/auth/guards";
import { listAdminGames } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Ludothèque · Administration" };

export default function AdminGamesPage({ searchParams }: PageProps<"/admin/jeux">) {
  return (
    <>
      <AdminHeader
        title="Ludothèque"
        create={{ href: "/admin/jeux/nouveau", label: "Nouveau jeu" }}
      />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <Flash searchParams={searchParams} />
        <GamesTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function GamesTable({ searchParams }: Pick<PageProps<"/admin/jeux">, "searchParams">) {
  await requirePermission({ game: ["update"] }, "/admin/jeux");
  const sp = await searchParams;
  const q = param(sp.q)?.slice(0, 80);
  const page = parsePage(sp.page);
  const { items, total, pageCount } = await listAdminGames({ q, page });

  return (
    <div className="grid gap-4">
      <form role="search" className="flex gap-2" action="/admin/jeux">
        <label htmlFor="q" className="sr-only">
          Rechercher un jeu
        </label>
        <Input id="q" name="q" type="search" defaultValue={q} placeholder="Rechercher un jeu…" />
        <Button type="submit" variant="outline">
          Rechercher
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        {total} fiche{total > 1 ? "s" : ""}
        {q ? ` pour « ${q} »` : ""}
      </p>
      <AdminTable head={["Titre", "Type", "Année", "Exemplaires"]}>
        {items.map((g) => (
          <tr key={g.id} className="hover:bg-muted/40">
            <td className="px-4 py-2">
              <Link href={`/admin/jeux/${g.id}`} className="font-medium hover:text-primary">
                {g.title}
              </Link>
            </td>
            <td className="px-4 py-2 text-muted-foreground">{g.type}</td>
            <td className="px-4 py-2 text-muted-foreground tabular-nums">{g.year ?? "—"}</td>
            <td className="px-4 py-2 tabular-nums">{g.quantity}</td>
          </tr>
        ))}
      </AdminTable>
      <Pagination page={page} pageCount={pageCount} pathname="/admin/jeux" params={{ q }} />
    </div>
  );
}
