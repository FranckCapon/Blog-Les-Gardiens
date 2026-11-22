"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { PendingButton } from "@/components/admin/form-shell";
import { Button } from "@/components/ui/button";

/** Suppression en deux temps, sans boîte de dialogue du navigateur. */
export function DeleteForm({ action, label }: { action: () => Promise<void>; label: string }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <Button type="button" variant="outline" onClick={() => setConfirming(true)}>
        <Trash2 aria-hidden />
        {label}
      </Button>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <span className="text-sm">Cette suppression est définitive.</span>
      <PendingButton variant="destructive" pendingLabel="Suppression…">
        Confirmer la suppression
      </PendingButton>
      <Button type="button" variant="ghost" onClick={() => setConfirming(false)}>
        Annuler
      </Button>
    </form>
  );
}
