import type { Metadata } from "next";
import { Suspense } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/guards";
import { roleLabels, type RoleName } from "@/lib/auth/permissions";

export const metadata: Metadata = { title: "Mon profil" };

export default function ProfilPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Mon profil</h1>
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <Profil />
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
