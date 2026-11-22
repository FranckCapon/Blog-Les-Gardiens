import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { AdminHeader, AdminTable, Flash } from "@/components/admin/admin-ui";
import { requirePermission } from "@/lib/auth/guards";
import { listAdminEvents } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Événements · Administration" };

export default function AdminEventsPage({ searchParams }: PageProps<"/admin/evenements">) {
  return (
    <>
      <AdminHeader
        title="Événements"
        create={{ href: "/admin/evenements/nouveau", label: "Nouvel événement" }}
      />
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <Flash searchParams={searchParams} />
        <EventsTable />
      </Suspense>
    </>
  );
}

async function EventsTable() {
  await requirePermission({ event: ["update"] }, "/admin/evenements");
  await connection();
  const events = await listAdminEvents();
  const now = new Date();
  return (
    <AdminTable head={["Titre", "Date", "Type", "Inscrits"]}>
      {events.map((e) => (
        <tr
          key={e.id}
          className={e.startsAt <= now ? "text-muted-foreground" : "hover:bg-muted/40"}
        >
          <td className="px-4 py-2">
            <Link href={`/admin/evenements/${e.id}`} className="font-medium hover:text-primary">
              {e.title}
            </Link>
            {e.startsAt <= now ? <span className="ml-2 text-xs">(passé)</span> : null}
          </td>
          <td className="px-4 py-2 whitespace-nowrap first-letter:uppercase">
            {formatDateTime(e.startsAt)}
          </td>
          <td className="px-4 py-2">{e.tag}</td>
          <td className="px-4 py-2 tabular-nums">{e.participants}</td>
        </tr>
      ))}
    </AdminTable>
  );
}
