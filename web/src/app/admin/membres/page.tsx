import { BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminHeader, AdminTable } from "@/components/admin/admin-ui";
import { Pagination, param, parsePage } from "@/components/content/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requirePermission } from "@/lib/auth/guards";
import { roleLabels, type RoleName } from "@/lib/auth/permissions";
import { listMembers } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";

import { setMemberRole } from "./actions";
import { RoleForm } from "./role-form";

export const metadata: Metadata = { title: "Membres · Administration" };

const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({ value, label }));

export default function AdminMembersPage({ searchParams }: PageProps<"/admin/membres">) {
  return (
    <>
      <AdminHeader title="Membres">
        <p className="text-sm text-muted-foreground">
          Les rôles décident de ce que chacun peut faire sur le site : un modérateur rédige des
          articles et organise des événements, un administrateur gère tout.
        </p>
      </AdminHeader>
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <MembersTable searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function MembersTable({ searchParams }: Pick<PageProps<"/admin/membres">, "searchParams">) {
  const { user: me } = await requirePermission({ user: ["list", "set-role"] }, "/admin/membres");
  const sp = await searchParams;
  const q = param(sp.q)?.slice(0, 80);
  const page = parsePage(sp.page);
  const { items, total, pageCount } = await listMembers({ q, page });

  return (
    <div className="grid gap-4">
      <form role="search" className="flex gap-2" action="/admin/membres">
        <label htmlFor="q" className="sr-only">
          Rechercher un membre
        </label>
        <Input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Pseudo, nom ou e-mail…"
        />
        <Button type="submit" variant="outline">
          Rechercher
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        {total} membre{total > 1 ? "s" : ""}
        {q ? ` pour « ${q} »` : ""}
      </p>
      <AdminTable
        head={[
          "Membre",
          { label: "E-mail", className: "hidden md:table-cell" },
          { label: "Inscrit le", className: "hidden md:table-cell" },
          "Rôle",
        ]}
      >
        {items.map((m) => (
          <tr key={m.id} className="align-top">
            <td className="px-4 py-3">
              <span className="font-medium">{m.name}</span>
              <span className="block text-muted-foreground">
                {m.firstName} {m.lastName}
              </span>
              <span className="block break-all text-muted-foreground md:hidden">{m.email}</span>
            </td>
            <td className="hidden px-4 py-3 md:table-cell">
              <span className="inline-flex items-center gap-1">
                {m.email}
                {m.emailVerified ? (
                  <BadgeCheck
                    className="size-4 shrink-0 text-primary"
                    aria-label="adresse confirmée"
                  />
                ) : null}
              </span>
              {!m.emailVerified ? (
                <span className="block text-xs text-muted-foreground">adresse non confirmée</span>
              ) : null}
            </td>
            <td className="hidden px-4 py-3 whitespace-nowrap text-muted-foreground md:table-cell">
              {formatDate(m.createdAt)}
            </td>
            <td className="px-4 py-3">
              {m.id === me.id ? (
                <span>
                  {roleLabels[m.role as RoleName] ?? m.role}
                  <span className="block text-xs text-muted-foreground">
                    c&apos;est toi : un autre admin peut le changer
                  </span>
                </span>
              ) : (
                <RoleForm
                  action={setMemberRole.bind(null, m.id)}
                  current={m.role ?? "membre"}
                  roles={roleOptions}
                  label={m.name}
                />
              )}
            </td>
          </tr>
        ))}
      </AdminTable>
      <Pagination page={page} pageCount={pageCount} pathname="/admin/membres" params={{ q }} />
    </div>
  );
}
