import { CalendarDays, Clock, Dices, MapPin, Sparkles, Swords, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/evenements" className="group">
            <Card className="h-full transition-colors group-hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="size-5 text-primary" aria-hidden />
                  Prochains événements
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Soirées jeux, tournois et sorties grandeur nature organisés par le club.
              </CardContent>
            </Card>
          </Link>
          <Link href="/jeux" className="group">
            <Card className="h-full transition-colors group-hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Dices className="size-5 text-primary" aria-hidden />
                  La ludothèque
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Les jeux du club, à découvrir et à essayer sur place.
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </main>
  );
}
