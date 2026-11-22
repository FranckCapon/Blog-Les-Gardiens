import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/guards";
import { roleLabels, type RoleName } from "@/lib/auth/permissions";
import { listMyUpcomingRegistrations } from "@/lib/data/registrations";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Mon profil" };

export default function ProfilPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Mon profil</h1>
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <div className="grid gap-6">
          <Profil />
          <MyRegistrations />
        </div>
      </Suspense>
    </main>
  );
}

async function Profil() {
  const { user } = await requireSession("/profil");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Nom</dt>
          <dd>
            {user.firstName} {user.lastName}
          </dd>
          <dt className="text-muted-foreground">E-mail</dt>
          <dd>{user.email}</dd>
          <dt className="text-muted-foreground">Rôle</dt>
          <dd>{roleLabels[user.role as RoleName] ?? user.role}</dd>
        </dl>
        <div>
          <SignOutButton />
        </div>
      </CardContent>
    </Card>
  );
}

async function MyRegistrations() {
  const { user } = await requireSession("/profil");
  await connection();
  const events = await listMyUpcomingRegistrations(user.id, new Date());
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Mes inscriptions</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune inscription à venir.{" "}
            <Link href="/evenements" className="text-primary underline underline-offset-4">
              Voir les prochains événements
            </Link>
          </p>
        ) : (
          <ul className="divide-y">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <Link href={`/evenements/${e.id}`} className="font-medium hover:text-primary">
                  {e.title}
                </Link>
                <time
                  dateTime={e.startsAt.toISOString()}
                  className="text-sm text-muted-foreground first-letter:uppercase"
                >
                  {formatDateTime(e.startsAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
