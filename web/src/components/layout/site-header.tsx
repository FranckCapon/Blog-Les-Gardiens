import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/guards";
import { roleCan } from "@/lib/auth/permissions";
import { club } from "@/lib/site";

import { MenuIcon } from "lucide-react";

import { MainNav, MainNavLinks } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-3" aria-label={`${club.name}, accueil`}>
          <Image
            src="/logo-noir.png"
            alt=""
            width={40}
            height={37}
            priority
            className="dark:invert"
          />
          <span className="font-display text-base leading-tight font-semibold tracking-wide sm:text-lg">
            {club.name}
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<MainNavLinks pathname="" />}>
            <MainNav />
          </Suspense>
          <div className="hidden items-center gap-2 lg:flex">
            <Suspense fallback={null}>
              <AccountLinks />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <Button variant="ghost" size="icon" className="lg:hidden" disabled aria-label="Menu">
                <MenuIcon />
              </Button>
            }
          >
            <MobileNav
              account={
                <Suspense fallback={null}>
                  <AccountLinks />
                </Suspense>
              }
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

async function AccountLinks() {
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
