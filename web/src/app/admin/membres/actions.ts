"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { z } from "zod";

import { type FormState } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/auth/guards";
import { roles } from "@/lib/auth/permissions";

const input = z.object({
  role: z.enum(Object.keys(roles) as [keyof typeof roles, ...(keyof typeof roles)[]], {
    error: "Rôle inconnu.",
  }),
});

/** Change le rôle d'un membre. Réservé aux administrateurs. */
export async function setMemberRole(
  userId: string,
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const { user } = await requirePermission({ user: ["set-role"] });
  if (typeof userId !== "string" || !userId) return { message: "Membre introuvable." };

  const parsed = input.safeParse({ role: formData.get("role") });
  if (!parsed.success) return { message: "Rôle inconnu." };

  // Un administrateur ne change pas son propre rôle : c'est un autre admin qui doit
  // le faire. Comme l'appelant reste admin, le site garde toujours au moins un admin.
  if (userId === user.id) {
    return { message: "Tu ne peux pas changer ton propre rôle." };
  }

  try {
    // Better Auth revérifie lui aussi la permission user:set-role de l'appelant.
    await auth.api.setRole({
      body: { userId, role: parsed.data.role },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) return { message: "Le changement de rôle a été refusé." };
    throw error;
  }
  return { message: "Rôle mis à jour.", ok: true };
}
