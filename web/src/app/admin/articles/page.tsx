import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdminHeader, AdminTable, Flash } from "@/components/admin/admin-ui";
import { requirePermission } from "@/lib/auth/guards";
import { listAdminArticles } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Articles · Administration" };

export default function AdminArticlesPage({ searchParams }: PageProps<"/admin/articles">) {
  return (
    <>
      <AdminHeader
        title="Articles"
        create={{ href: "/admin/articles/nouveau", label: "Nouvel article" }}
      />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <Flash searchParams={searchParams} />
        <ArticlesTable />
      </Suspense>
    </>
  );
}

async function ArticlesTable() {
  await requirePermission({ article: ["update"] }, "/admin/articles");
  const articles = await listAdminArticles();
  return (
    <AdminTable head={["Titre", "Catégorie", "Auteur", "Publié le"]}>
      {articles.map((a) => (
        <tr key={a.id} className="hover:bg-muted/40">
          <td className="px-4 py-2">
            <Link href={`/admin/articles/${a.id}`} className="font-medium hover:text-primary">
              {a.title}
            </Link>
          </td>
          <td className="px-4 py-2 text-muted-foreground">{a.tag}</td>
          <td className="px-4 py-2 text-muted-foreground">{a.author}</td>
          <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
            {formatDate(a.createdAt)}
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}
