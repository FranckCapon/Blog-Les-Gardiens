"use client";

import { useState } from "react";

import { Field, FormMessage } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    await authClient.requestPasswordReset({
      email: String(form.get("email")),
      redirectTo: "/reinitialiser-mot-de-passe",
    });
    setPending(false);
    // Même message que le compte existe ou non, pour ne pas révéler les adresses inscrites.
    setDone(true);
  }

  if (done) {
    return (
      <FormMessage tone="success">
        Si un compte existe avec cette adresse, un lien de réinitialisation vient d&apos;être
        envoyé.
      </FormMessage>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field id="email" label="E-mail">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Recevoir un lien"}
      </Button>
    </form>
  );
}
