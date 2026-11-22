import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <AuthCard
      title="Rejoindre les Gardiens"
      description="Crée ton compte membre. Tu recevras un e-mail pour confirmer ton adresse."
      footer={
        <span>
          Déjà membre ?{" "}
          <Link href="/connexion" className="underline">
            Connecte-toi
          </Link>
        </span>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
