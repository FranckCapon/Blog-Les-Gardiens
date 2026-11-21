import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Les Gardiens de la Légende</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Le club de jeux de société fait peau neuve. Articles, jeux et événements arrivent bientôt
        sur cette nouvelle version du site.
      </p>
      <Button asChild>
        <Link href="https://github.com/FranckCapon/Blog-Les-Gardiens">Suivre le projet</Link>
      </Button>
    </main>
  );
}
