"use client";

import { useActionState } from "react";

import type { FormAction } from "@/components/admin/form-shell";
import { Button } from "@/components/ui/button";
import { initialFormState } from "@/lib/actions";

export function RoleForm({
  action,
  current,
  roles,
  label,
}: {
  action: FormAction;
  current: string;
  roles: { value: string; label: string }[];
  /** Nom du membre, pour l'étiquette accessible. */
  label: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <select
        name="role"
        defaultValue={current}
        aria-label={`Rôle de ${label}`}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs dark:bg-input/30"
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? "…" : "Changer"}
      </Button>
      {state.message ? (
        <span
          role={state.ok ? "status" : "alert"}
          className={
            state.ok ? "text-xs text-emerald-700 dark:text-emerald-400" : "text-xs text-destructive"
          }
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
