"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Field, FormMessage } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";

/** N'accepte qu'un chemin interne, pour éviter les redirections ouvertes. */
function safeReturnPath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/profil";
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) {
      setError(authErrorMessage(error));
      return;
    }
    router.push(safeReturnPath(searchParams.get("retour")));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field id="email" label="E-mail">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field id="password" label="Mot de passe">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      {error ? <FormMessage tone="error">{error}</FormMessage> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
