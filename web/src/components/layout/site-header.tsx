import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/guards";
import { roleCan } from "@/lib/auth/permissions";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-semibold">
          Les Gardiens de la Légende
        </Link>
        <nav className="flex items-center gap-2">
          <Suspense fallback={null}>
            <UserNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

async function UserNav() {
  const session = await getSession();
  if (!session) {
    return (
      <>
        <Button asChild variant="ghost" size="sm">
          <Link href="/connexion">Connexion</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/inscription">Rejoindre le club</Link>
        </Button>
      </>
    );
  }
  return (
    <>
      {roleCan(session.user.role, { article: ["create"] }) ? (
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">Administration</Link>
        </Button>
      ) : null}
      <Button asChild variant="outline" size="sm">
        <Link href="/profil">{session.user.name}</Link>
      </Button>
    </>
  );
}
