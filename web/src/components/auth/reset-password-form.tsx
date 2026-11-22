"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Field, FormMessage } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? authErrorMessage({ code: "INVALID_TOKEN" }) : null,
  );
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.resetPassword({
      newPassword: String(form.get("password")),
      token,
    });
    setPending(false);
    if (error) {
      setError(authErrorMessage(error));
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <FormMessage tone="success">
        Mot de passe modifié. Tu peux maintenant{" "}
        <Link href="/connexion" className="underline">
          te connecter
        </Link>
        .
      </FormMessage>
    );
  }

  if (!token) {
    return (
      <FormMessage tone="error">
        {error ?? "Lien incomplet."}{" "}
        <Link href="/mot-de-passe-oublie" className="underline">
          Refaire une demande
        </Link>
      </FormMessage>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field id="password" label="Nouveau mot de passe (10 caractères minimum)">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </Field>
      {error ? <FormMessage tone="error">{error}</FormMessage> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Changer le mot de passe"}
      </Button>
    </form>
  );
}
