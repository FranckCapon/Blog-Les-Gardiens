"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { FormMessage } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { type FormState, initialFormState } from "@/lib/actions";

export type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;

/**
 * Formulaire d'administration : appelle la Server Action, affiche l'état
 * d'envoi et les erreurs. `children` reçoit l'état pour pré-remplir les champs.
 */
export function AdminForm({
  action,
  submitLabel,
  children,
}: {
  action: FormAction;
  submitLabel: string;
  children: (state: FormState) => ReactNode;
}) {
  // Après chaque envoi refusé, les champs sont remontés avec les valeurs saisies :
  // la remise à zéro automatique des formulaires de React viderait sinon les <select>.
  const [state, formAction, pending] = useActionState(
    async (prev: FormState, formData: FormData): Promise<FormState> => ({
      ...(await action(prev, formData)),
      n: (prev.n ?? 0) + 1,
    }),
    initialFormState,
  );
  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div key={state.n ?? 0} className="contents">
        {children(state)}
      </div>
      {state.message ? <FormMessage tone="error">{state.message}</FormMessage> : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function PendingButton({
  children,
  pendingLabel,
  ...props
}: React.ComponentProps<typeof Button> & { pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

export { PendingButton };
