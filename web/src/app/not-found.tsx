import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="font-display text-5xl font-semibold text-primary">404</p>
      <h1 className="font-display text-2xl font-semibold tracking-wide">Page introuvable</h1>
      <p className="text-muted-foreground">
        Cette page s&apos;est perdue dans les brumes de la légende. Elle a peut-être été déplacée ou
        supprimée.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </main>
  );
}
