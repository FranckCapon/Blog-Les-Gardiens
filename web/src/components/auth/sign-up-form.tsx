"use client";

import { useState } from "react";

import { Field, FormMessage } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { authErrorMessage } from "@/lib/auth/errors";

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    setPending(true);
    setError(null);
    const { error } = await authClient.signUp.email({
      name: String(form.get("pseudo")).trim(),
      firstName: String(form.get("firstName")).trim(),
      lastName: String(form.get("lastName")).trim(),
      email,
      password: String(form.get("password")),
      callbackURL: "/profil",
    });
    setPending(false);
    if (error) {
      setError(authErrorMessage(error));
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <FormMessage tone="success">
        Compte créé ! Un lien de confirmation a été envoyé à {sentTo}. Ouvre-le pour activer ton
        compte.
      </FormMessage>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field id="pseudo" label="Pseudo (visible par les autres membres)">
        <Input id="pseudo" name="pseudo" autoComplete="username" minLength={3} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="Prénom">
          <Input id="firstName" name="firstName" autoComplete="given-name" required />
        </Field>
        <Field id="lastName" label="Nom">
          <Input id="lastName" name="lastName" autoComplete="family-name" required />
        </Field>
      </div>
      <Field id="email" label="E-mail">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field id="password" label="Mot de passe (10 caractères minimum)">
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
        {pending ? "Création…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
