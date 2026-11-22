import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import { cancelRegistration, registerForEvent } from "@/app/evenements/[id]/actions";
import { PendingButton } from "@/components/admin/form-shell";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/auth/guards";
import { isRegistered } from "@/lib/data/registrations";

/** Bloc d'inscription d'un événement ; lit la session, donc à rendre sous <Suspense>. */
export async function EventRegistration({
  eventId,
  startsAt,
}: {
  eventId: number;
  startsAt: Date;
}) {
  await connection(); // « maintenant » doit être lu à la requête
  const session = await getSession();

  if (startsAt <= new Date()) {
    return <Notice>Cet événement est passé : les inscriptions sont closes.</Notice>;
  }

  if (!session) {
    return (
      <Notice>
        <span>Membre des Gardiens ? Connecte-toi pour t&apos;inscrire.</span>
        <Link
          href={`/connexion?retour=${encodeURIComponent(`/evenements/${eventId}`)}`}
          className={buttonVariants({ size: "sm" })}
        >
          Se connecter
        </Link>
      </Notice>
    );
  }

  if (await isRegistered(eventId, session.user.id)) {
    return (
      <form action={cancelRegistration.bind(null, eventId)}>
        <Notice>
          <span className="flex items-center gap-2 font-medium text-foreground">
            <CheckCircle2 className="size-5 text-primary" aria-hidden />
            Ton inscription est enregistrée.
          </span>
          <PendingButton variant="outline" size="sm" pendingLabel="Annulation…">
            Annuler mon inscription
          </PendingButton>
        </Notice>
      </form>
    );
  }

  return (
    <form action={registerForEvent.bind(null, eventId)}>
      <Notice>
        <span>Tu viens ? Inscris-toi pour que l&apos;équipe prévoie les tables.</span>
        <PendingButton size="sm" pendingLabel="Inscription…">
          M&apos;inscrire
        </PendingButton>
      </Notice>
    </form>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}
