import Link from "next/link";

import { club, mainNav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div className="grid content-start gap-2">
          <p className="font-display text-base font-semibold">{club.name}</p>
          <p className="text-muted-foreground">{club.tagline}.</p>
          <address className="text-muted-foreground not-italic">
            {club.address.street}
            <br />
            {club.address.postalCode} {club.address.city}
          </address>
        </div>
        <nav aria-label="Pied de page" className="grid content-start gap-2">
          <p className="font-semibold">Le site</p>
          <ul className="grid gap-1 text-muted-foreground">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/rgpd" className="hover:text-foreground">
                Mentions légales et données personnelles
              </Link>
            </li>
          </ul>
        </nav>
        <div className="grid content-start gap-2">
          <p className="font-semibold">Nous écrire</p>
          <a href={`mailto:${club.email}`} className="text-muted-foreground hover:text-foreground">
            {club.email}
          </a>
          <p className="text-xs text-muted-foreground">
            Illustrations : FireFly Studios, utilisées avec leur autorisation à des fins non
            commerciales.
          </p>
        </div>
      </div>
    </footer>
  );
}
