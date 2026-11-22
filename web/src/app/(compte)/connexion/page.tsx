import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <AuthCard
      title="Connexion"
      description="Connecte-toi pour t'inscrire aux événements du club."
      footer={
        <div className="grid gap-1">
          <Link href="/mot-de-passe-oublie" className="underline">
            Mot de passe oublié ?
          </Link>
          <span>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="underline">
              Inscris-toi
            </Link>
          </span>
        </div>
      }
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
