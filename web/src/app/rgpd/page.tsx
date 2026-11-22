import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, Prose } from "@/components/layout/page-header";
import { club } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales et données personnelles",
  description: `Mentions légales et politique de confidentialité du site ${club.name}.`,
};

// Texte repris de l'ancienne page RGPD (FRONT/src/components/RGPD) et mis à jour
// pour le nouveau site : comptes membres, cookie de session, carte OpenStreetMap.
// Les passages marqués « à compléter » attendent la validation du bureau du club.
export default function RgpdPage() {
  return (
    <main className="flex-1">
      <PageHeader title="Mentions légales et données personnelles" />
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <Prose>
          <h2>1. Éditeur du site</h2>
          <p>
            Ce site est édité par l&apos;association {club.name}, {club.address.street},{" "}
            {club.address.postalCode} {club.address.city}.
            <br />
            Contact : <a href={`mailto:${club.email}`}>{club.email}</a>
          </p>
          <p>
            Responsables de la publication : les référents du club.
            <br />
            Création du site d&apos;origine : Franck Capon, Laura Grenier, Romain Boudet et Lorène
            Meslin. Refonte : Franck Capon.
          </p>

          <h2>2. Hébergement</h2>
          <p>Hébergeur du site : à compléter (nom, adresse et téléphone de l&apos;hébergeur).</p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            Les textes, le logo et les contenus publiés sur ce site appartiennent à {club.name},
            sauf mention contraire. Les illustrations médiévales sont l&apos;œuvre de FireFly
            Studios, qui autorise leur utilisation à des fins non commerciales. Toute reproduction
            sans autorisation écrite préalable est interdite.
          </p>

          <h2>4. Données personnelles</h2>
          <p>
            Le club est responsable du traitement des données collectées sur ce site. Il ne les
            utilise que pour faire fonctionner le site et la vie du club, et ne les vend ni ne les
            cède à des tiers.
          </p>
          <h3>Données collectées</h3>
          <ul>
            <li>
              À la création d&apos;un compte : pseudo, prénom, nom, adresse e-mail et mot de passe
              (enregistré uniquement sous forme chiffrée et irréversible).
            </li>
            <li>Lors de l&apos;utilisation : inscriptions aux événements du club.</li>
            <li>
              Pour la sécurité des comptes : adresse IP et navigateur associés à chaque session de
              connexion.
            </li>
          </ul>
          <h3>Finalités et base légale</h3>
          <p>
            Ces données servent à gérer votre compte membre, vos inscriptions aux événements et la
            sécurité du site. Leur traitement repose sur votre inscription au site,
            c&apos;est-à-dire l&apos;exécution du service que vous demandez.
          </p>
          <h3>Visibilité</h3>
          <p>
            Seul votre pseudo est visible par les autres membres. Votre nom, votre prénom et votre
            adresse e-mail ne sont accessibles qu&apos;aux administrateurs du site.
          </p>
          <h3>Durée de conservation</h3>
          <p>
            Les données du compte sont conservées tant que le compte existe ; elles sont supprimées
            à la clôture du compte. Les sessions de connexion expirent après 7 jours sans activité.
            (Durées à valider par le bureau du club.)
          </p>
          <h3>Vos droits</h3>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
            portabilité et d&apos;opposition sur vos données. Pour les exercer, écrivez à{" "}
            <a href={`mailto:${club.email}`}>{club.email}</a>. Si vous estimez que vos droits ne
            sont pas respectés, vous pouvez adresser une réclamation à la{" "}
            <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
              CNIL
            </a>
            .
          </p>

          <h2>5. Cookies</h2>
          <p>
            Ce site n&apos;utilise ni cookie publicitaire ni outil de mesure d&apos;audience. Le
            seul cookie déposé est le cookie de session, créé quand vous vous connectez : il est
            indispensable pour rester connecté et n&apos;est pas lisible par les scripts de la page.
            Il ne nécessite donc pas votre consentement.
          </p>
          <p>
            La <Link href="/contact">page Contact</Link> affiche un plan fourni par OpenStreetMap ;
            son chargement transmet votre adresse IP aux serveurs d&apos;OpenStreetMap.
          </p>

          <h2>6. Liens vers d&apos;autres sites</h2>
          <p>
            Le site contient des liens vers d&apos;autres sites, comme celui de la {club.mjc.name}.
            Le club n&apos;est pas responsable de leur contenu.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Ces mentions sont soumises au droit français, notamment au Règlement général sur la
            protection des données (RGPD, règlement UE 2016/679), à la loi n° 78-17 du 6 janvier
            1978 relative à l&apos;informatique, aux fichiers et aux libertés, et à la loi n°
            2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique.
          </p>
        </Prose>
      </div>
    </main>
  );
}
