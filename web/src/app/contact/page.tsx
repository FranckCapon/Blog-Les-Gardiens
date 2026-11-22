import { Clock, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { club } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Adresse, horaires et contact du club ${club.name} à ${club.address.city}.`,
};

// Carte OpenStreetMap : pas de clé d'API ni de cookie de suivi, contrairement à Google Maps.
const { lat, lng } = club.geo;
const bbox = [lng - 0.006, lat - 0.003, lng + 0.006, lat + 0.003].join(",");
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHeader title="Nous retrouver">
        Envie de nous rejoindre autour d&apos;un jeu ? Vous serez les bienvenus !
      </PageHeader>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-4">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" aria-hidden />
                Le local
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic">
                {club.address.street}
                <br />
                {club.address.postalCode} {club.address.city}
              </address>
            </CardContent>
          </Card>
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-primary" aria-hidden />
                Horaires d&apos;ouverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                {club.openingHours.map((slot) => (
                  <div key={slot.day} className="contents">
                    <dt className="font-medium">{slot.day}</dt>
                    <dd className="text-muted-foreground">{slot.hours}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5 text-primary" aria-hidden />
                Nous écrire
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1">
              <p className="text-sm text-muted-foreground">
                Une question ? Envoyez-nous un e-mail :
              </p>
              <a
                href={`mailto:${club.email}`}
                className="font-medium break-all text-primary underline underline-offset-4"
              >
                {club.email}
              </a>
            </CardContent>
          </Card>
        </div>
        <div className="grid content-start gap-2">
          <iframe
            title={`Plan d'accès au local, ${club.address.street}, ${club.address.city}`}
            src={mapSrc}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-xl border"
          />
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Agrandir le plan sur OpenStreetMap
          </a>
        </div>
      </div>
    </main>
  );
}
