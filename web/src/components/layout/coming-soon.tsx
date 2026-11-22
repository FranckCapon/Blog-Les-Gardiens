import Link from "next/link";

import { Button } from "@/components/ui/button";

import { PageHeader } from "./page-header";

/** Page provisoire pour les rubriques qui arrivent aux prochaines étapes de la refonte. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <main className="flex-1">
      <PageHeader title={title}>{description}</PageHeader>
      <div className="mx-auto grid w-full max-w-6xl justify-items-start gap-4 px-4 py-12">
        <p className="text-muted-foreground">
          Cette rubrique arrive très bientôt sur la nouvelle version du site.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </main>
  );
}
