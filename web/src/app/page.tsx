import {
  CalendarDays,
  Clock,
  Dices,
  MapPin,
  Newspaper,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { ArticleCard } from "@/components/content/article-card";
import { EventItem } from "@/components/content/event-item";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { latestArticles } from "@/lib/data/articles";
import { upcomingEvents } from "@/lib/data/events";
import { currentHour } from "@/lib/format";
import { club } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[url(/images/bandeau.jpg)] bg-cover bg-center opacity-25 dark:opacity-15"
        />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div className="grid gap-6">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-widest text-primary uppercase">
              <Swords className="size-4" aria-hidden />
              {club.tagline}
            </p>
            <h1 className="font-display text-4xl leading-tight font-semibold tracking-wide text-balance sm:text-5xl">
              {club.name}
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">
              Jeux de rôle, de plateau, de cartes, de figurines, grandeur nature : le club est
              ouvert toute l&apos;année, à tous, enfants comme adultes, pour partager le plaisir du
              jeu.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Venir jouer</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/les-gardiens">Découvrir le club</Link>
              </Button>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-gold" aria-hidden />3 séances d&apos;essai gratuites
              avant de vous engager.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rotate-2 rounded-2xl bg-gold/30 blur-sm"
            />
            <Image
              src="/images/chevalier.jpg"
              alt="Chevalier en armure tenant une épée, illustration de FireFly Studios"
              width={715}
              height={1024}
              priority
              sizes="(min-width: 768px) 384px, 90vw"
              className="aspect-[4/5] rounded-xl border object-cover object-top shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-semibold tracking-wide sm:text-3xl">
          Ce que nous pratiquons
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {club.activities.map((activity) => (
            <li key={activity.name}>
              <Card className="h-full gap-3 py-5">
                <CardHeader className="px-5">
                  <CardTitle className="flex items-center gap-2">
                    <Dices className="size-5 text-primary" aria-hidden />
                    {activity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 text-sm text-muted-foreground">
                  {activity.description}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
          <div className="grid content-start gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-wide">
              <Clock className="size-5 text-primary" aria-hidden />
              Quand venir
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {club.openingHours.map((slot) => (
                <div key={slot.day} className="contents">
                  <dt className="font-medium">{slot.day}</dt>
                  <dd className="text-muted-foreground">{slot.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid content-start gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-wide">
              <MapPin className="size-5 text-primary" aria-hidden />
              Où nous trouver
            </h2>
            <address className="text-muted-foreground not-italic">
              {club.address.street}
              <br />
              {club.address.postalCode} {club.address.city}
            </address>
            <Link
              href="/contact"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Voir le plan et nous écrire
            </Link>
          </div>
          <div className="grid content-start gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-wide">
              <Users className="size-5 text-primary" aria-hidden />
              Devenir un Gardien
            </h2>
            <p className="text-muted-foreground">
              Créez votre compte pour suivre les événements du club et vous y inscrire.
            </p>
            <div>
              <Button asChild>
                <Link href="/inscription">Rejoindre le club</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 lg:grid-cols-2">
        <div className="grid content-start gap-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold tracking-wide">
              <CalendarDays className="size-6 text-primary" aria-hidden />
              Prochains événements
            </h2>
            <Link
              href="/evenements"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Tout voir
            </Link>
          </div>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement…</p>}>
            <NextEvents />
          </Suspense>
        </div>
        <div className="grid content-start gap-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold tracking-wide">
              <Newspaper className="size-6 text-primary" aria-hidden />
              Derniers articles
            </h2>
            <Link
              href="/articles"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              Tout voir
            </Link>
          </div>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement…</p>}>
            <LatestArticles />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function NextEvents() {
  // Lu à chaque requête (dates relatives à maintenant), puis mis en cache une heure.
  await connection();
  const events = await upcomingEvents(currentHour());
  if (events.length === 0) {
    return <p className="text-muted-foreground">Aucun événement prévu pour le moment.</p>;
  }
  return (
    <ul className="grid gap-3">
      {events.map((e) => (
        <li key={e.id}>
          <EventItem event={e} />
        </li>
      ))}
    </ul>
  );
}

async function LatestArticles() {
  await connection();
  const articles = await latestArticles(3);
  return (
    <ul className="grid gap-3">
      {articles.map((a) => (
        <li key={a.id}>
          <ArticleCard article={a} />
        </li>
      ))}
    </ul>
  );
}
