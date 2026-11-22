"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Menu déroulant pour mobile et tablette ; se referme à chaque changement de page. */
export function MobileNav({ account }: { account: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fermer le menu après une navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </Button>
      <div
        id="menu-mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b bg-background shadow-md"
      >
        <nav aria-label="Navigation principale" className="mx-auto max-w-6xl px-4 py-3">
          <ul className="grid gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 font-medium hover:bg-accent",
                    pathname.startsWith(item.href) && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">{account}</div>
        </nav>
      </div>
    </div>
  );
}
