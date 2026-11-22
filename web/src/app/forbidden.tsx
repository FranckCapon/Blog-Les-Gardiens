import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Accès refusé</h1>
      <p className="text-muted-foreground">
        Ton rôle ne permet pas d&apos;ouvrir cette page. Si tu penses que c&apos;est une erreur,
        contacte le bureau du club.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </main>
  );
}
