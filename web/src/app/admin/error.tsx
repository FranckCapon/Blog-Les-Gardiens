"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="grid justify-items-start gap-4 rounded-lg border p-6">
      <h2 className="font-display text-xl font-semibold tracking-wide">
        L&apos;enregistrement n&apos;a pas abouti
      </h2>
      <p className="text-sm text-muted-foreground">
        Une erreur inattendue s&apos;est produite. Réessaie ; si le problème continue, préviens un
        administrateur.
      </p>
      <Button type="button" variant="outline" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
