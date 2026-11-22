import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, Prose } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { club } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le club",
  description: `${club.name}, club de jeux fondé en ${club.foundedIn} à ${club.address.city}.`,
};

export default function LesGardiensPage() {
  return (
    <main className="flex-1">
      <PageHeader title="À propos des Gardiens">
        Un club de jeux fondé en {club.foundedIn}, ouvert à tous.
      </PageHeader>
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <Prose>
          <p>
            Club fondé en {club.foundedIn} au sein de la{" "}
            <a href={club.mjc.url} target="_blank" rel="noopener noreferrer">
              {club.mjc.name}
            </a>
            , les Gardiens de la Légende ont pour valeurs de sensibiliser et de responsabiliser les
            joueurs, et de mettre en avant le partage et le plaisir du jeu.
          </p>

          <h2>Nos activités</h2>
          <ul>
            {club.activities.map((activity) => (
              <li key={activity.name}>{activity.name}</li>
            ))}
          </ul>

          <h2>Venir jouer</h2>
          <p>
            Le club est ouvert toute l&apos;année, à tous, enfants comme adultes, pour partager
            notre passion du jeu. Venez jouer avec nous pendant 3 séances d&apos;essai gratuites :
            si le club vous plaît, rejoignez-nous et devenez à votre tour un Gardien.
          </p>
          <p>
            Pour connaître les horaires et l&apos;adresse du local, consultez la{" "}
            <Link href="/contact">page Contact</Link>.
          </p>
        </Prose>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/inscription">Devenir un Gardien</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
