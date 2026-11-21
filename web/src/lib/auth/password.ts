import "server-only";

import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword } from "better-auth/crypto";

// Les nouveaux mots de passe sont hachés avec scrypt (défaut de Better Auth).
// Les comptes repris de l'ancienne base gardent leur hash bcrypt ("$2a$", "$2b$"…)
// et restent utilisables sans réinitialisation.
export const passwordHasher = {
  hash: (password: string) => hashPassword(password),
  verify: async ({ hash, password }: { hash: string; password: string }) => {
    if (/^\$2[aby]\$/.test(hash)) {
      return bcrypt.compare(password, hash);
    }
    return verifyPassword({ hash, password });
  },
};
