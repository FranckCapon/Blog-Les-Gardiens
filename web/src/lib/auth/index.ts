import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

import { passwordHasher } from "./password";
import { ac, DEFAULT_ROLE, roles } from "./permissions";

export const auth = betterAuth({
  appName: "Les Gardiens de la Légende",
  database: drizzleAdapter(db, { provider: "pg", schema }),

  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    password: passwordHasher,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Réinitialiser ton mot de passe",
        text: `Bonjour ${user.name},\n\nPour choisir un nouveau mot de passe, ouvre ce lien (valable 1 heure) :\n${url}\n\nSi tu n'as rien demandé, ignore ce message.`,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Confirme ton adresse e-mail",
        text: `Bienvenue chez les Gardiens, ${user.name} !\n\nConfirme ton adresse en ouvrant ce lien :\n${url}`,
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // prolongée au plus une fois par jour
  },

  advanced: {
    // Cookie de session HttpOnly + SameSite=Lax dans tous les cas, et Secure en production.
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  plugins: [
    adminPlugin({
      ac,
      roles,
      defaultRole: DEFAULT_ROLE,
      adminRoles: ["admin"],
      bannedUserMessage: "Ce compte a été suspendu. Contacte le bureau du club.",
    }),
    // Doit rester le dernier plugin : pose les cookies lors des appels depuis des Server Actions.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
